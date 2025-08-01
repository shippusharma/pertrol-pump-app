import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { router } from 'expo-router';
import { Card } from '../components/Card';
import { ArrowLeft, Mail, Phone, MapPin, Globe, Users, Shield, Zap } from 'lucide-react-native';

export default function AboutScreen() {
  const openEmail = () => {
    Linking.openURL('mailto:support@fieldutility.com');
  };

  const openPhone = () => {
    Linking.openURL('tel:+1234567890');
  };

  const openWebsite = () => {
    Linking.openURL('https://fieldutility.com');
  };

  const features = [
    {
      icon: <Users size={24} color="#2563EB" />,
      title: 'Team Management',
      description: 'Efficiently manage your field team with role-based access control.',
    },
    {
      icon: <Shield size={24} color="#10B981" />,
      title: 'Secure Data',
      description: 'Your data is protected with enterprise-grade security measures.',
    },
    {
      icon: <Zap size={24} color="#F59E0B" />,
      title: 'Real-time Tracking',
      description: 'Monitor activities and get instant updates from the field.',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>About</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <Card style={styles.appCard}>
          <View style={styles.appHeader}>
            <View style={styles.appIcon}>
              <Zap size={32} color="#FFFFFF" />
            </View>
            <View style={styles.appInfo}>
              <Text style={styles.appName}>Field Utility Tracker</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
            </View>
          </View>
          <Text style={styles.appDescription}>
            A comprehensive field utility tracking application designed to streamline operations, 
            monitor resources, and enhance productivity for field teams.
          </Text>
        </Card>

        {/* Features */}
        <Card style={styles.featuresCard}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                {feature.icon}
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Contact Information */}
        <Card style={styles.contactCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={openEmail}>
            <View style={styles.contactIcon}>
              <Mail size={20} color="#2563EB" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactDetails}>support@fieldutility.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={openPhone}>
            <View style={styles.contactIcon}>
              <Phone size={20} color="#10B981" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Phone Support</Text>
              <Text style={styles.contactDetails}>+1 (234) 567-8900</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <MapPin size={20} color="#F59E0B" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Office Location</Text>
              <Text style={styles.contactDetails}>
                123 Business Street{'\n'}
                Suite 100{'\n'}
                City, State 12345
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.contactItem} onPress={openWebsite}>
            <View style={styles.contactIcon}>
              <Globe size={20} color="#8B5CF6" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Website</Text>
              <Text style={styles.contactDetails}>www.fieldutility.com</Text>
            </View>
          </TouchableOpacity>
        </Card>

        {/* Legal */}
        <Card style={styles.legalCard}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <Text style={styles.legalText}>
            © 2024 Field Utility Tracker. All rights reserved.
          </Text>
          <Text style={styles.legalText}>
            This application is designed for professional field operations management.
          </Text>
          <View style={styles.legalLinks}>
            <TouchableOpacity>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.legalLink}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </Card>
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
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  appCard: {
    marginBottom: 20,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  appVersion: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  appDescription: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  featuresCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  contactCard: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  contactDetails: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  legalCard: {
    marginBottom: 20,
  },
  legalText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 8,
  },
  legalLinks: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 20,
  },
  legalLink: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
});