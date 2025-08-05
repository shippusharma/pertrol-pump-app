import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Card } from '../components/Card';
import { ArrowLeft, Bell, Fuel, Wrench, Camera, Info } from 'lucide-react-native';
import { Notification } from '../types/data';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Low Fuel Alert',
      message: 'Fuel level is below 10%',
      timestamp: '10:30 AM',
      type: 'fuel-alert',
      isRead: false,
      icon: 'fuel',
    },
    {
      id: '2',
      title: 'Maintenance Reminder',
      message: 'Vehicle 12345 is due for maintenance',
      timestamp: '9:15 AM',
      type: 'maintenance',
      isRead: false,
      icon: 'wrench',
    },
    {
      id: '3',
      title: 'Toilet Issue',
      message: 'Toilet 67890 requires immediate attention',
      timestamp: 'Yesterday 4:45 PM',
      type: 'toilet-issue',
      isRead: true,
      icon: 'camera',
    },
    {
      id: '4',
      title: 'Fuel Update',
      message: 'Vehicle 54321 has been refueled',
      timestamp: 'Yesterday 2:20 PM',
      type: 'general',
      isRead: true,
      icon: 'fuel',
    },
  ]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => (notif.id === notificationId ? { ...notif, isRead: true } : notif)));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const getNotificationIcon = (iconType: string) => {
    switch (iconType) {
      case 'fuel':
        return <Fuel size={20} color="#FFFFFF" />;
      case 'wrench':
        return <Wrench size={20} color="#FFFFFF" />;
      case 'camera':
        return <Camera size={20} color="#FFFFFF" />;
      default:
        return <Info size={20} color="#FFFFFF" />;
    }
  };

  const getIconBackgroundColor = (type: string) => {
    switch (type) {
      case 'fuel-alert':
        return '#EF4444';
      case 'maintenance':
        return '#F59E0B';
      case 'toilet-issue':
        return '#8B5CF6';
      default:
        return '#2563EB';
    }
  };

  const todayNotifications = notifications.filter(n => !n.timestamp.includes('Yesterday'));
  const yesterdayNotifications = notifications.filter(n => n.timestamp.includes('Yesterday'));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity style={styles.bellButton} onPress={markAllAsRead}>
          <Bell size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today Section */}
        {todayNotifications.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Today</Text>
            {todayNotifications.map(notification => (
              <TouchableOpacity key={notification.id} onPress={() => markAsRead(notification.id)} activeOpacity={0.8}>
                <Card
                  style={
                    notification.isRead ? styles.notificationCard : { ...styles.notificationCard, ...styles.unreadCard }
                  }
                >
                  <View style={styles.notificationContent}>
                    <View
                      style={[
                        styles.notificationIcon,
                        {
                          backgroundColor: getIconBackgroundColor(notification.type),
                        },
                      ]}
                    >
                      {getNotificationIcon(notification.icon || 'info')}
                    </View>
                    <View style={styles.notificationText}>
                      <Text style={[styles.notificationTitle, !notification.isRead && styles.unreadTitle]}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                    </View>
                    <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                  </View>
                  {!notification.isRead && <View style={styles.unreadDot} />}
                </Card>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Yesterday Section */}
        {yesterdayNotifications.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Yesterday</Text>
            {yesterdayNotifications.map(notification => (
              <TouchableOpacity key={notification.id} onPress={() => markAsRead(notification.id)} activeOpacity={0.8}>
                <Card
                  style={
                    notification.isRead ? styles.notificationCard : { ...styles.notificationCard, ...styles.unreadCard }
                  }
                >
                  <View style={styles.notificationContent}>
                    <View
                      style={[
                        styles.notificationIcon,
                        {
                          backgroundColor: getIconBackgroundColor(notification.type),
                        },
                      ]}
                    >
                      {getNotificationIcon(notification.icon || 'info')}
                    </View>
                    <View style={styles.notificationText}>
                      <Text style={[styles.notificationTitle, !notification.isRead && styles.unreadTitle]}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                    </View>
                    <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                  </View>
                  {!notification.isRead && <View style={styles.unreadDot} />}
                </Card>
              </TouchableOpacity>
            ))}
          </>
        )}

        {notifications.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No notifications</Text>
          </Card>
        )}
      </ScrollView>
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  bellButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    marginTop: 8,
  },
  notificationCard: {
    marginBottom: 12,
    position: 'relative',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 8,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  emptyCard: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    fontStyle: 'italic',
  },
});
