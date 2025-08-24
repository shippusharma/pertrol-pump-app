import { serverWithApiVersion } from '@/configs/env';
import { sessionStorage } from '@/services/session-storage';
import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { router } from 'expo-router';
import { getApiBaseUrl } from './ip';

interface InternalAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Main API service class
export class ApiInstance {
  private axiosInstance: AxiosInstance; // Axios instance for HTTP requests
  private abortController: AbortController; // Controller for aborting requests
  private isRefreshing: boolean; // Flag to track if token refresh is in progress
  private failedQueue: {
    // Queue for failed requests during token refresh
    resolve: (value?: unknown) => void;
    reject: (error: AxiosError) => void;
    config: InternalAxiosRequestConfig;
  }[];

  private readonly loginScreen = '/login';
  private readonly refreshEndpoint = '/auth/refresh';

  // Constructor initializes the API service with base URL and login URL
  constructor(private readonly baseUrl: string) {
    this.baseUrl = baseUrl; // Set base URL for API endpoints
    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: { 'Content-Type': 'application/json' },
      // timeout: 10000, // Increased timeout for mobile networks
    });

    this.abortController = new AbortController(); // Initialize abort controller
    this.isRefreshing = false; // Initialize refresh flag
    this.failedQueue = []; // Initialize failed request queue
    this.setupInterceptors(); // Set up request/response interceptors
  }

  // Sets up axios interceptors for request and response handling
  private setupInterceptors() {
    // Request interceptor - runs before each request
    this.axiosInstance.interceptors.request.use(
      async config => {
        // Get access token from secure storage
        const accessToken = await sessionStorage.getAccessToken();
        // Add authorization header if token exists
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error) // Handle request error
    );

    // Response interceptor - runs after each response
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response, // Pass through successful responses
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig; // Get original request config
        const status = error.response?.status ?? 0; // Get HTTP status code
        const errorData = error.response?.data ?? ''; // Get error response data

        // Prevent infinite loop if refresh request itself fails with 401
        if (originalRequest.url === this.refreshEndpoint) return Promise.reject(error);

        // Check if error is due to session termination
        if (status === 401 && this.isSessionTerminatedError(errorData)) {
          await this.clearStoredCredentials(); // Clear stored credentials
          return Promise.reject(error); // Reject the promise
        }

        // Handle 401 errors (unauthorized) for token refresh
        if (status === 401 && !originalRequest._retry) {
          // If refresh is already happening → queue this request
          if (this.isRefreshing) return this.queueRequest(originalRequest); // Start token refresh

          // Mark refresh in progress before starting it
          this.isRefreshing = true; // Set refresh flag
          originalRequest._retry = true; // Mark request as retried
          return this.handleTokenRefresh(originalRequest); // Queue request if refresh in progress
        }
        // For other errors, reject normally
        return Promise.reject(error);
      }
    );
  }

  // Checks if error indicates session termination
  private isSessionTerminatedError(errorData: any): boolean {
    // Extract error message if available
    const errorMessage = typeof errorData === 'object' && 'message' in errorData ? errorData.message : '';
    return errorMessage.toLowerCase() === 'session terminated'; // Check for session termination message
  }

  /**
   * Refresh the access token using the refresh token
   */
  private async handleTokenRefresh(originalRequest: InternalAxiosRequestConfig): Promise<AxiosResponse> {
    try {
      await this.refreshToken(); // Attempt token refresh
      this.processQueuedRequests(); // Process queued requests after refresh
      return this.axiosInstance(originalRequest); // Retry original request
    } catch (refreshError) {
      this.handleRefreshError(refreshError as AxiosError); // Handle refresh error
      return Promise.reject(refreshError); // Reject promise
    } finally {
      this.isRefreshing = false; // Reset refresh flag
    }
  }

  // Queues failed requests during token refresh
  private queueRequest(originalRequest: InternalAxiosRequestConfig): Promise<unknown> {
    return new Promise((resolve, reject) => {
      // Clone request config and mark as retried
      const configToQueue = { ...originalRequest, _retry: true };
      // Add to failed queue with resolve/reject handlers
      this.failedQueue.push({
        resolve: () => resolve(this.axiosInstance(configToQueue)), // Resolve by retrying request
        reject: (err: AxiosError) => reject(err), // Reject with error
        config: configToQueue,
      });
    });
  }

  // Performs the actual token refresh request
  private async refreshToken(): Promise<void> {
    const refreshToken = await sessionStorage.getRefreshToken(); // Get refresh token from secure storage
    if (!refreshToken) throw new Error('No refresh token available'); // Validate token exists
    try {
      // Make refresh token request to server
      const response = await axios.post(
        `${this.baseUrl}${this.refreshEndpoint}`,
        { authorization: `Bearer ${refreshToken}` },
        {
          headers: { 'Content-Type': 'application/json' },
          signal: this.abortController.signal, // Attach abort signal
        }
      );

      // Validate successful response
      if (response.data.status === 200 && response.data.success) {
        await this.updateTokens(response.data.accessToken, response.data.refreshToken); // Update tokens
      } else {
        throw new Error('Failed to refresh token'); // Throw if refresh failed
      }
    } catch (error) {
      await this.clearStoredCredentials(); // Clear credentials on error
      throw error; // Re-throw error
    }
  }

  // Updates tokens in secure storage and axios headers
  private async updateTokens(accessToken: string, refreshToken: string): Promise<void> {
    // Store tokens in secure storage
    await sessionStorage.setAuth(accessToken, refreshToken);

    // Update Redux store
    // store.dispatch(setAuth_({ accessToken, refreshToken }));

    // Update axios header
    this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  // Processes all queued requests after token refresh
  private processQueuedRequests(): void {
    this.failedQueue.forEach(prom => prom.resolve()); // Resolve each queued promise
    this.failedQueue = []; // Clear the queue
  }

  // Handles errors during token refresh
  private handleRefreshError(error: AxiosError): void {
    this.failedQueue.forEach(prom => prom.reject(error)); // Reject all queued promises
    this.failedQueue = []; // Clear the queue
    this.clearStoredCredentials(); // Clear stored credentials
  }

  /**
   * Clear stored credentials by resetting Redux store and secure storage
   */
  private async clearStoredCredentials(): Promise<void> {
    // Reset Redux store
    // resetReduxStoredData();

    // Remove tokens from secure storage
    await sessionStorage.deleteAuth();

    // Cancel all pending requests from the old session
    this.abortController.abort();
    this.abortController = new AbortController();

    // Clear any queued requests that are waiting for a refresh
    this.failedQueue = [];
    // Reset refreshing state
    this.isRefreshing = false;

    return router.replace(this.loginScreen);
  }

  // Generic request method for all HTTP methods
  private async request<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    params?: Record<string, unknown>,
    data?: any,
    headers?: Record<string, string>,
    configOverrides?: AxiosRequestConfig
  ): Promise<T> {
    try {
      // Make the request with provided configuration
      const response = await this.axiosInstance.request<T>({
        method,
        url,
        params,
        data,
        headers,
        ...configOverrides,
        signal: this.abortController.signal, // Attach abort signal
      });
      return response.data; // Return response data
    } catch (error) {
      // eslint-disable-next-line import/no-named-as-default-member
      if (axios.isCancel(error)) return Promise.reject({}); // Handle request cancellation
      throw error; // Re-throw other errors
    }
  }

  // GET request wrapper
  async get<T>(
    url: string,
    params: Record<string, unknown> = {},
    headers: Record<string, string> = {},
    configOverrides: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>('get', url, params, undefined, headers, configOverrides);
  }

  // POST request wrapper
  async post<T>(
    url: string,
    data: any = {},
    headers: Record<string, string> = {},
    configOverrides: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>('post', url, undefined, data, headers, configOverrides);
  }

  // PUT request wrapper
  async put<T>(
    url: string,
    data: any = {},
    headers: Record<string, string> = {},
    configOverrides: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>('put', url, undefined, data, headers, configOverrides);
  }

  // PATCH request wrapper
  async patch<T>(
    url: string,
    data: any = {},
    headers: Record<string, string> = {},
    configOverrides: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>('patch', url, undefined, data, headers, configOverrides);
  }

  // DELETE request wrapper
  async delete<T>(
    url: string,
    data: any = {},
    headers: Record<string, string> = {},
    configOverrides: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>('delete', url, undefined, data, headers, configOverrides);
  }

  // Aborts all pending requests
  abortRequest(): void {
    this.abortController.abort(); // Abort current requests
    this.abortController = new AbortController(); // Create new controller for future requests
  }
}

export const apiInstance = new ApiInstance(getApiBaseUrl() || serverWithApiVersion);

/**
//! Cleanup function to abort the request when the component unmounts
    useEffect(() => {
      return () => {
        apiInstance.abortRequest();
      };
    }, []);
 */
