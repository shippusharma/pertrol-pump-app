import * as Location from 'expo-location';
import { CircleCheck as CheckCircle, Clock, MapPin, Circle as XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface AttendanceEntry {
  id: string;
  type: 'check-in' | 'check-out';
  timestamp: Date;
  location: LocationData;
}

// Geofence configuration (example coordinates)
const OFFICE_LOCATION = {
  latitude: 37.7749,
  longitude: -122.4194,
  radius: 100, // meters
};

export default function AttendanceScreen() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [attendanceEntries, setAttendanceEntries] = useState<AttendanceEntry[]>([]);
  const [lastAction, setLastAction] = useState<'check-in' | 'check-out' | null>(null);

  useEffect(() => {
    getCurrentLocation();
    loadAttendanceHistory();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for attendance tracking.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const locationData: LocationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: address[0] ? `${address[0].street}, ${address[0].city}` : undefined,
      };

      setLocation(locationData);
    } catch (error) {
      if (error instanceof Error) {
        return Alert.alert('Location Error', 'Unable to get current location. Please try again.');
      }
      throw error;
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const loadAttendanceHistory = () => {
    // Mock data - replace with actual data loading
    const mockEntries: AttendanceEntry[] = [
      {
        id: '1',
        type: 'check-in',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          address: 'Main Office, San Francisco',
        },
      },
    ];
    setAttendanceEntries(mockEntries);
    setLastAction(mockEntries.length > 0 ? mockEntries[0].type : null);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const isWithinGeofence = (): boolean => {
    if (!location) return false;

    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      OFFICE_LOCATION.latitude,
      OFFICE_LOCATION.longitude
    );

    return distance <= OFFICE_LOCATION.radius;
  };

  const handleAttendanceAction = async (type: 'check-in' | 'check-out') => {
    if (!location) {
      Alert.alert('Location Required', 'Please enable location to mark attendance.');
      return;
    }

    if (!isWithinGeofence()) {
      Alert.alert('Outside Geofence', 'You must be within the office premises to mark attendance.', [
        { text: 'OK', style: 'default' },
        { text: 'Refresh Location', onPress: getCurrentLocation },
      ]);
      return;
    }

    const newEntry: AttendanceEntry = {
      id: Date.now().toString(),
      type,
      timestamp: new Date(),
      location,
    };

    setAttendanceEntries(prev => [newEntry, ...prev]);
    setLastAction(type);

    Alert.alert(
      'Success',
      `Successfully ${type === 'check-in' ? 'checked in' : 'checked out'} at ${newEntry.timestamp.toLocaleTimeString()}`
    );
  };

  const getNextAction = (): 'check-in' | 'check-out' => {
    return lastAction === 'check-in' ? 'check-out' : 'check-in';
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Attendance</Text>
        <Text style={styles.subtitle}>Track your work hours</Text>
      </View>

      {/* Current Location */}
      <Card style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <MapPin size={20} color="#2563EB" />
          <Text style={styles.locationTitle}>Current Location</Text>
        </View>
        {isLoadingLocation ? (
          <Text style={styles.locationText}>Getting location...</Text>
        ) : location ? (
          <>
            <Text style={styles.locationText}>
              {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
            </Text>
            <Text style={[styles.geofenceStatus, { color: isWithinGeofence() ? '#10B981' : '#EF4444' }]}>
              {isWithinGeofence() ? '✓ Within office premises' : '✗ Outside office premises'}
            </Text>
          </>
        ) : (
          <Text style={styles.locationText}>Location not available</Text>
        )}
        <Button
          title="Refresh Location"
          onPress={getCurrentLocation}
          variant="outline"
          size="sm"
          loading={isLoadingLocation}
          style={styles.refreshButton}
        />
      </Card>

      {/* Attendance Action */}
      <Card style={styles.actionCard}>
        <View style={styles.actionHeader}>
          <Clock size={20} color="#F59E0B" />
          <Text style={styles.actionTitle}>Mark Attendance</Text>
        </View>
        <Text style={styles.actionSubtitle}>Current time: {new Date().toLocaleTimeString()}</Text>
        <Button
          title={`${getNextAction() === 'check-in' ? 'Check In' : 'Check Out'}`}
          onPress={() => handleAttendanceAction(getNextAction())}
          disabled={!location || !isWithinGeofence()}
          style={styles.attendanceButton}
        />
      </Card>

      {/* Today's Entries */}
      <Card style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Today&apos;s Attendance</Text>
        {attendanceEntries.length === 0 ? (
          <Text style={styles.emptyText}>No attendance records for today</Text>
        ) : (
          attendanceEntries.map(entry => (
            <View key={entry.id} style={styles.entryItem}>
              <View style={styles.entryIcon}>
                {entry.type === 'check-in' ? (
                  <CheckCircle size={20} color="#10B981" />
                ) : (
                  <XCircle size={20} color="#EF4444" />
                )}
              </View>
              <View style={styles.entryContent}>
                <Text style={styles.entryType}>{entry.type === 'check-in' ? 'Checked In' : 'Checked Out'}</Text>
                <Text style={styles.entryTime}>
                  {formatTime(entry.timestamp)} • {formatDate(entry.timestamp)}
                </Text>
                <Text style={styles.entryLocation}>{entry.location.address || 'Location not available'}</Text>
              </View>
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  locationCard: {
    margin: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  geofenceStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  refreshButton: {
    marginTop: 8,
  },
  actionCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  attendanceButton: {
    marginTop: 8,
  },
  historyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  entryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  entryContent: {
    flex: 1,
  },
  entryType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  entryTime: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  entryLocation: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
});
