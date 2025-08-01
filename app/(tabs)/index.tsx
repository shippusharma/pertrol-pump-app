import { router } from 'expo-router';
import {
  Bell,
  Calendar,
  Camera,
  Clock,
  CreditCard,
  Fuel,
  LogOut,
  MapPin
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

interface DashboardCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  onPress?: () => void;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Attendance',
      value: 'Check In/Out',
      icon: <Calendar size={24} color="#FFFFFF" />,
      color: '#10B981',
      onPress: () => router.push('/(tabs)/attendance'),
    },
    {
      title: 'Toilet Check',
      value: 'Inspect Status',
      icon: <Camera size={24} color="#FFFFFF" />,
      color: '#8B5CF6',
      onPress: () => router.push('/(tabs)/toilet'),
    },
    {
      title: 'Fuel Monitor',
      value: '6000L',
      icon: <Fuel size={24} color="#FFFFFF" />,
      color: '#F59E0B',
      onPress: () => router.push('/(tabs)/fuel'),
    },
    {
      title: 'Transactions',
      value: '$1,250',
      icon: <CreditCard size={24} color="#FFFFFF" />,
      color: '#2563EB',
      onPress: () => router.push('/(tabs)/transactions'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good {getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <View style={styles.timeContainer}>
              <Clock size={16} color="#64748B" />
              <Text style={styles.currentTime}>
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => router.push('/notifications')}
            >
              <Bell size={24} color="#374151" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={handleLogout}
            >
              <LogOut size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        {dashboardCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.statCard}
            onPress={card.onPress}
            activeOpacity={0.8}
          >
            <Card style={StyleSheet.flatten([
              styles.statCardContent,
              card?.color ? { backgroundColor: card.color } : {}
            ])}>
              <View style={styles.statIcon}>
                {card.icon}
              </View>
              <Text style={styles.statValue}>{card.value}</Text>
              <Text style={styles.statTitle}>{card.title}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Today's Summary */}
      <Card style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Today&apos;s Summary</Text>
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryIcon}>
            <MapPin size={20} color="#10B981" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryText}>Checked in at 9:00 AM</Text>
            <Text style={styles.summarySubtext}>Location: Main Office</Text>
          </View>
        </View>

        <View style={styles.summaryItem}>
          <View style={styles.summaryIcon}>
            <Fuel size={20} color="#F59E0B" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryText}>Fuel level at 60%</Text>
            <Text style={styles.summarySubtext}>6000L remaining</Text>
          </View>
        </View>

        <View style={styles.summaryItem}>
          <View style={styles.summaryIcon}>
            <Camera size={20} color="#8B5CF6" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryText}>3 toilet checks completed</Text>
            <Text style={styles.summarySubtext}>All facilities clean</Text>
          </View>
        </View>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <Button
            title="Mark Attendance"
            onPress={() => router.push('/(tabs)/attendance')}
            variant="outline"
            size="sm"
            style={styles.actionButton}
          />
          <Button
            title="Add Transaction"
            onPress={() => router.push('/(tabs)/transactions')}
            variant="outline"
            size="sm"
            style={styles.actionButton}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  currentTime: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    marginRight: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  settingsButton: {
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
  },
  statCard: {
    width: '47%',
  },
  statCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statIcon: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  summarySubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  actionsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});