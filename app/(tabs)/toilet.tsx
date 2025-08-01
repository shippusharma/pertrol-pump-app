import * as ImagePicker from 'expo-image-picker';
import { CircleCheck as CheckCircle, Upload, Circle as XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';

interface ToiletCheckEntry {
  id: string;
  timestamp: Date;
  status: 'clean' | 'not-clean';
  photoUri: string;
  comments?: string;
  location: string;
}

export default function ToiletCheckScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'clean' | 'not-clean' | null>(null);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkHistory, setCheckHistory] = useState<ToiletCheckEntry[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'clean',
      photoUri: 'https://images.pexels.com/photos/7534555/pexels-photo-7534555.jpeg?auto=compress&cs=tinysrgb&w=300',
      comments: 'Facilities are well maintained',
      location: 'Building A - Ground Floor',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'not-clean',
      photoUri: 'https://images.pexels.com/photos/7534578/pexels-photo-7534578.jpeg?auto=compress&cs=tinysrgb&w=300',
      comments: 'Needs immediate cleaning',
      location: 'Building B - Second Floor',
    },
  ]);

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
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery permission is required to select photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      Alert.alert('Photo Required', 'Please take a photo of the toilet facilities.');
      return;
    }

    if (!status) {
      Alert.alert('Status Required', 'Please select the cleanliness status.');
      return;
    }

    try {
      setIsSubmitting(true);

      const newEntry: ToiletCheckEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        status,
        photoUri: selectedImage,
        comments: comments.trim(),
        location: 'Current Location', // Replace with actual location
      };

      setCheckHistory(prev => [newEntry, ...prev]);
      
      // Reset form
      setSelectedImage(null);
      setStatus(null);
      setComments('');

      Alert.alert('Success', 'Toilet check submitted successfully!');
    } catch (error) {
      console.error('Error submitting toilet check:', error);
      Alert.alert('Error', 'Failed to submit toilet check. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Toilet Check</Text>
        <Text style={styles.subtitle}>Inspect and report facility status</Text>
      </View>

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

      {/* Status Selection */}
      <Card style={styles.statusCard}>
        <Text style={styles.sectionTitle}>Cleanliness Status</Text>
        <View style={styles.statusButtons}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              status === 'clean' && styles.statusButtonSelected,
              { borderColor: '#10B981' }
            ]}
            onPress={() => setStatus('clean')}
          >
            <CheckCircle size={24} color={status === 'clean' ? '#FFFFFF' : '#10B981'} />
            <Text style={[
              styles.statusButtonText,
              status === 'clean' && styles.statusButtonTextSelected
            ]}>
              Clean
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusButton,
              status === 'not-clean' && styles.statusButtonSelected,
              { borderColor: '#EF4444' }
            ]}
            onPress={() => setStatus('not-clean')}
          >
            <XCircle size={24} color={status === 'not-clean' ? '#FFFFFF' : '#EF4444'} />
            <Text style={[
              styles.statusButtonText,
              status === 'not-clean' && styles.statusButtonTextSelected
            ]}>
              Not Clean
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Comments */}
      <Card style={styles.commentsCard}>
        <Input
          label="Comments (Optional)"
          placeholder="Add any additional notes about the toilet condition..."
          value={comments}
          onChangeText={setComments}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </Card>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Button
          title="Submit Check"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!selectedImage || !status}
          style={styles.submitButton}
        />
      </View>

      {/* Check History */}
      <Card style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Recent Checks</Text>
        {checkHistory.map((entry) => (
          <View key={entry.id} style={styles.historyItem}>
            <Image source={{ uri: entry.photoUri }} style={styles.historyImage} />
            <View style={styles.historyContent}>
              <View style={styles.historyHeader}>
                <View style={styles.statusIndicator}>
                  {entry.status === 'clean' ? (
                    <CheckCircle size={16} color="#10B981" />
                  ) : (
                    <XCircle size={16} color="#EF4444" />
                  )}
                  <Text style={[
                    styles.statusText,
                    { color: entry.status === 'clean' ? '#10B981' : '#EF4444' }
                  ]}>
                    {entry.status === 'clean' ? 'Clean' : 'Not Clean'}
                  </Text>
                </View>
                <Text style={styles.historyTime}>
                  {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Text style={styles.historyLocation}>{entry.location}</Text>
              {entry.comments && (
                <Text style={styles.historyComments}>{entry.comments}</Text>
              )}
            </View>
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
  photoCard: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
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
  statusCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  statusButtonSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  statusButtonTextSelected: {
    color: '#FFFFFF',
  },
  commentsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  submitContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 8,
  },
  historyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  historyTime: {
    fontSize: 12,
    color: '#64748B',
  },
  historyLocation: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  historyComments: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
  },
});