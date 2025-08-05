export interface AttendanceRecord {
  id: string;
  userId: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  type: 'check-in' | 'check-out';
  notes?: string;
}

export interface ToiletCheck {
  id: string;
  userId: string;
  timestamp: string;
  status: 'clean' | 'not-clean';
  photoUri: string;
  comments?: string;
  location?: string;
}

export interface FuelRecord {
  id: string;
  userId: string;
  timestamp: string;
  fuelInLiters: number;
  density: number;
  photoUri?: string;
  type: 'refill' | 'consumption';
  notes?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  timestamp: string;
  amount: number;
  type: 'income' | 'expense';
  category: 'cash' | 'upi';
  description: string;
  icon?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'fuel-alert' | 'maintenance' | 'toilet-issue' | 'general';
  isRead: boolean;
  icon?: string;
}
