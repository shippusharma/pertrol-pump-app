export const ALLOWED_MIME_TYPES = [
  'image/jpeg', // JPEG/JPG image
  'image/jpg', // JPG image
  'image/png', // png format : Portable Network Graphics
  'image/svg+xml', // Scalable Vector Graphics (SVG)
  'image/webp', // WEBP image
  'image/gif', // Graphics Interchange Format (GIF)
  'image/vnd.microsoft.icon', // Icon format
  'video/mp4', // MP4 video
  'video/webm', // WEBM Video
  'video/mpeg', // 	MPEG Video
  'audio/webm', // 	WEBM audio
  'audio/ogg', // 	OGG audio
  'audio/mp3', // 	MP3 Audio
  'text/plain', // Add text/plain for .txt files
  'text/csv', // Add text/csv for csv files
  'text/html', // HyperText Markup Language (HTML)
  'application/pdf', // PDF format
  'application/json', // 	JSON format
  'application/xml', // XML format
  'application/javascript', // JavaScript module
  'application/zip', // ZIP format
  'application/gzip', // GZip Compressed Archive
];

export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif'];

export const AUDIO_MIME_TYPES = ['audio/webm', 'audio/mp3', 'audio/ogg'];

export const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/mpeg'];

export const TEXT_MIME_TYPES = ['text/html', 'text/plain', 'text/csv'];

export const APPLICATION_MIME_TYPES = [
  'application/pdf',
  'application/json',
  'application/xml',
  'application/javascript',
  'application/gzip',
  'application/zip',
];

export const ALL_MIME_TYPES = [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES, ...TEXT_MIME_TYPES, ...APPLICATION_MIME_TYPES];

export const RESOLUTIONS = [
  { name: '144p', width: 256, height: 144, bitrate: '200k', audio: '48k', label: 'Low (144p)' },
  { name: '240p', width: 426, height: 240, bitrate: '400k', audio: '64k', label: 'Low (240p)' },
  { name: '360p', width: 640, height: 360, bitrate: '800k', audio: '96k', label: 'SD (360p)' },
  { name: '480p', width: 854, height: 480, bitrate: '1400k', audio: '128k', label: 'SD (480p)' },
  { name: '720p', width: 1280, height: 720, bitrate: '2800k', audio: '128k', label: 'HD (720p)' },
  { name: '1080p', width: 1920, height: 1080, bitrate: '5000k', audio: '192k', label: 'Full HD (1080p)' },
  { name: '1080p', width: 2048, height: 1080, bitrate: '6000k', audio: '192k', label: '2K (1080p)' },
  { name: '1440p', width: 2560, height: 1440, bitrate: '8000k', audio: '256k', label: 'Quad HD (1440p)' },
  { name: '2160p', width: 3840, height: 2160, bitrate: '16000k', audio: '320k', label: '4K UHD (2160p)' },
  { name: '4320p', width: 7680, height: 4320, bitrate: '64000k', audio: '512k', label: '8K UHD (4320p)' },
  { name: '8640p', width: 15360, height: 8640, bitrate: '128000k', audio: '1024k', label: '16K UHD (8640p)' },
];

/**
 **-----------------------------------------------
 *!               Validation
 **-----------------------------------------------
 */

export const MAX_FILE_SIZE_5MB = 5 * 1024 * 1024; // 5MB

export const MAX_FILE_SIZE_10MB = 10 * 1024 * 1024; // 10MB

export const INVALID_IMAGES_FORMAT = 'Invalid File. Only jpeg, jpg, png, webp are allowed.';

export const AVATAR_PROFILE = 'Profile Image is required!';

export const UPLOADING_FAILED = 'Uploading is failed!';

export const INVALID_FILE_TYPES = 'Invalid File Type!';
