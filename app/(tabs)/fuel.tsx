import * as ImagePicker from 'expo-image-picker';
import { TrendingDown, TrendingUp, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';

interface FuelEntry {
  id: string;
  timestamp: Date;
  fuelInLiters: number;
  density: number;
  type: 'refill' | 'consumption';
  photoUri?: string;
  notes?: string;
}

export default function FuelMonitorScreen() {
  const [fuelAmount, setFuelAmount] = useState('');
  const [density, setDensity] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFuelLevel] = useState(6000); // Mock current fuel level
  const [fuelHistory, setFuelHistory] = useState<FuelEntry[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      fuelInLiters: 5000,
      density: 0.85,
      type: 'refill',
      notes: 'Regular fuel refill',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      fuelInLiters: 1000,
      density: 0.85,
      type: 'consumption',
      notes: 'Daily operations',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      fuelInLiters: 6000,
      density: 0.85,
      type: 'refill',
      notes: 'Tank refill',
    },
  ]);

  const maxFuelCapacity = 10000; // Maximum tank capacity
  const fuelPercentage = (currentFuelLevel / maxFuelCapacity) * 100;
  const isLowFuel = currentFuelLevel < 4000;

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      if (error instanceof Error) {
        return Alert.alert('Error', 'Failed to take photo. Please try again.');
      }
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!fuelAmount.trim()) {
      Alert.alert('Validation Error', 'Please enter fuel amount.');
      return;
    }

    if (!density.trim()) {
      Alert.alert('Validation Error', 'Please enter density.');
      return;
    }

    const fuelValue = parseFloat(fuelAmount);
    const densityValue = parseFloat(density);

    if (isNaN(fuelValue) || fuelValue <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid fuel amount.');
      return;
    }

    if (isNaN(densityValue) || densityValue <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid density.');
      return;
    }

    try {
      setIsSubmitting(true);

      const newEntry: FuelEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        fuelInLiters: fuelValue,
        density: densityValue,
        type: 'refill', // You could add logic to determine this
        photoUri: selectedImage || undefined,
      };

      setFuelHistory(prev => [newEntry, ...prev]);

      // Reset form
      setFuelAmount('');
      setDensity('');
      setSelectedImage(null);

      Alert.alert('Success', 'Fuel record submitted successfully!');
    } catch (error) {
      if (error instanceof Error) {
        return Alert.alert('Error', 'Failed to submit fuel record. Please try again.');
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const showImagePicker = () => {
    Alert.alert('Add Photo', 'Choose how you want to add a photo', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Take Photo', onPress: takePhoto },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Fuel Monitor</Text>
        <Text style={styles.subtitle}>Track fuel levels and consumption</Text>
      </View>

      {/* Fuel Gauge */}
      <Card style={styles.gaugeCard}>
        <Text style={styles.sectionTitle}>Fuel Level</Text>
        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeBackground}>
            <View style={[styles.gaugeFill, { width: `${fuelPercentage}%` }]} />
          </View>
          <View style={styles.gaugeLabels}>
            <Text style={styles.fuelLevel}>{currentFuelLevel}L</Text>
            <Text style={styles.fuelPercentage}>{fuelPercentage.toFixed(1)}%</Text>
          </View>
        </View>
        {isLowFuel && (
          <View style={styles.alertContainer}>
            <Text style={styles.alertText}>Alert: Fuel below 4000L</Text>
          </View>
        )}
      </Card>

      {/* Input Form */}
      <Card style={styles.inputCard}>
        <Input
          label="Fuel in Liters"
          placeholder="Enter fuel amount"
          value={fuelAmount}
          onChangeText={setFuelAmount}
          keyboardType="numeric"
          variant="filled"
        />

        <Input
          label="Density"
          placeholder="Enter density"
          value={density}
          onChangeText={setDensity}
          keyboardType="numeric"
          variant="filled"
        />
      </Card>

      {/* Photo Upload */}
      <Card style={styles.photoCard}>
        <Text style={styles.sectionTitle}>Upload Photo</Text>
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.changeImageButton} onPress={showImagePicker}>
              <Text style={styles.changeImageText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadArea} onPress={showImagePicker}>
            <Upload size={32} color="#64748B" />
            <Text style={styles.uploadText}>Upload Photo</Text>
            <Text style={styles.uploadSubtext}>Capture a photo of the fuel tank or gauge</Text>
            <Button
              title="Take Photo"
              onPress={showImagePicker}
              variant="outline"
              size="sm"
              style={styles.takePhotoButton}
            />
          </TouchableOpacity>
        )}
      </Card>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Button title="Submit" onPress={handleSubmit} loading={isSubmitting} style={styles.submitButton} />
      </View>

      {/* Fuel History */}
      <Card style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Fuel History</Text>
        {fuelHistory.map(entry => (
          <View key={entry.id} style={styles.historyItem}>
            <View style={styles.historyIcon}>
              {entry.type === 'refill' ? (
                <TrendingUp size={20} color="#10B981" />
              ) : (
                <TrendingDown size={20} color="#EF4444" />
              )}
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyType}>{entry.type === 'refill' ? 'Fuel Refill' : 'Fuel Consumption'}</Text>
              <Text style={styles.historyDate}>
                {entry.timestamp.toLocaleDateString()} • {entry.fuelInLiters}L
              </Text>
              {entry.notes && <Text style={styles.historyNotes}>{entry.notes}</Text>}
            </View>
            <Text style={[styles.historyAmount, { color: entry.type === 'refill' ? '#10B981' : '#EF4444' }]}>
              {entry.type === 'refill' ? '+' : '-'}
              {entry.fuelInLiters}L
            </Text>
          </View>
        ))}
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
  gaugeCard: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  gaugeContainer: {
    marginBottom: 12,
  },
  gaugeBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gaugeFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fuelLevel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  fuelPercentage: {
    fontSize: 16,
    color: '#64748B',
  },
  alertContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  alertText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  inputCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  photoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  takePhotoButton: {
    marginTop: 8,
  },
  imageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  changeImageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
  },
  changeImageText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  submitContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#2563EB',
  },
  historyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  historyDate: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  historyNotes: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    fontStyle: 'italic',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
