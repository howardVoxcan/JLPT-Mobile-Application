import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { getVoices, createShadowingSession } from '../../services/shadowingService';

export default function ShadowingPracticeScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'image'
  const [textInput, setTextInput] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isVoiceCreated, setIsVoiceCreated] = useState(false);
  const [audioDuration, setAudioDuration] = useState('0:00');
  const [currentTime, setCurrentTime] = useState('0:00');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [sound, setSound] = useState(null);

  /* ======================
     LOAD VOICES ON MOUNT
     ====================== */
  useEffect(() => {
    let mounted = true;

    const fetchVoices = async () => {
      try {
        setLoading(true);
        const data = await getVoices();
        if (mounted) {
          setVoices(data);
          if (data.length > 0) {
            setSelectedVoice(data[0]);
          }
        }
      } catch (error) {
        console.error('Load voices error:', error);
        Alert.alert('Lỗi', 'Không thể tải danh sách giọng đọc');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchVoices();
    return () => {
      mounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  /* ======================
     CREATE VOICE SESSION
     ====================== */
  const handleCreateVoice = async () => {
    if (activeTab === 'text' && !textInput.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập văn bản để tạo giọng nói');
      return;
    }

    if (activeTab === 'image' && !selectedImage) {
      Alert.alert('Thông báo', 'Vui lòng chọn hình ảnh để tạo giọng nói');
      return;
    }

    if (!selectedVoice) {
      Alert.alert('Thông báo', 'Vui lòng chọn giọng đọc');
      return;
    }

    try {
      setCreating(true);

      const data = {
        input_type: activeTab,
        text_input: activeTab === 'text' ? textInput : '',
        image: activeTab === 'image' ? selectedImage : null,
        voice: selectedVoice.id,
        speed: speed,
        pitch: pitch,
      };

      const result = await createShadowingSession(data);
      setSessionData(result);
      setAudioDuration(result.audio_duration || '0:00');
      setIsVoiceCreated(true);

      Alert.alert('Thành công', 'Đã tạo giọng nói thành công!');
    } catch (error) {
      console.error('Create voice error:', error);
      Alert.alert('Lỗi', error.response?.data?.detail || 'Không thể tạo giọng nói');
    } finally {
      setCreating(false);
    }
  };

  /* ======================
     AUDIO PLAYBACK
     ====================== */
  const handlePlayPause = async () => {
    if (!sessionData?.audio_url) {
      Alert.alert('Thông báo', 'Không có file âm thanh để phát');
      return;
    }

    try {
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
          } else {
            await sound.playAsync();
            setIsPlaying(true);
          }
        }
      } else {
        // Load and play audio
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: sessionData.audio_url },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      Alert.alert('Lỗi', 'Không thể phát audio');
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      if (status.positionMillis && status.durationMillis) {
        const progressPercent = (status.positionMillis / status.durationMillis) * 100;
        setProgress(progressPercent);

        const currentMin = Math.floor(status.positionMillis / 60000);
        const currentSec = Math.floor((status.positionMillis % 60000) / 1000);
        setCurrentTime(`${currentMin}:${currentSec.toString().padStart(2, '0')}`);
      }

      if (status.didJustFinish) {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime('0:00');
      }
    }
  };

  /* ======================
     IMAGE PICKER
     ====================== */
  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Cần quyền truy cập thư viện ảnh');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Lỗi', 'Không thể chọn hình ảnh');
    }
  };

  /* ======================
     DOWNLOAD AUDIO
     ====================== */
  const handleDownload = () => {
    if (!sessionData?.audio_url) {
      Alert.alert('Thông báo', 'Không có file âm thanh để tải');
      return;
    }
    // TODO: Implement actual download logic for mobile
    Alert.alert('Thông báo', 'Tính năng tải xuống đang được phát triển');
  };

  const renderAudioPlayer = () => (
    <View style={styles.audioPlayer}>
      <TouchableOpacity 
        style={styles.playButton}
        onPress={handlePlayPause}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={isPlaying ? "pause" : "play"} 
          size={22} 
          color="#000000" 
        />
      </TouchableOpacity>
      <Text style={styles.audioTime}>{currentTime} / {audioDuration}</Text>
      <View style={styles.timeline}>
        <View style={styles.timelineBg} />
        <View style={[styles.timelineFill, { width: `${progress}%` }]} />
      </View>
      <TouchableOpacity style={styles.audioControl} activeOpacity={0.7}>
        <Ionicons name="volume-high-outline" size={22} color="#000000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.audioControl} activeOpacity={0.7}>
        <Ionicons name="ellipsis-vertical" size={22} color="#000000" />
      </TouchableOpacity>
    </View>
  );

  if (isVoiceCreated) {
    return (
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Text Input (read-only or editable) */}
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Dán văn bản bạn cần luyện phát âm vào đây."
              placeholderTextColor={Colors.textSecondary}
              value={textInput}
              onChangeText={setTextInput}
              editable={true}
            />
          </View>

          {/* Audio Player */}
          {renderAudioPlayer()}

          {/* Action Buttons */}
          <TouchableOpacity 
            style={styles.pronounceButton}
            onPress={handlePlayPause}
            activeOpacity={0.7}
          >
            <Text style={styles.pronounceButtonText}>Phát âm thanh</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.downloadLink}
            onPress={handleDownload}
            activeOpacity={0.7}
          >
            <Ionicons name="download-outline" size={20} color={Colors.textPrimary} />
            <Text style={styles.downloadText}>Tải tệp âm thanh</Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Đang tải giọng đọc...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'text' && styles.tabActive]}
            onPress={() => setActiveTab('text')}
            activeOpacity={0.7}
          >
            {activeTab === 'text' && <View style={styles.tabHighlight} />}
            <Text style={styles.tabText}>Văn bản</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'image' && styles.tabActive]}
            onPress={() => setActiveTab('image')}
            activeOpacity={0.7}
          >
            {activeTab === 'image' && <View style={styles.tabHighlight} />}
            <Text style={styles.tabText}>Hình ảnh</Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'text' ? (
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Dán văn bản bạn cần luyện phát âm vào đây."
              placeholderTextColor={Colors.textSecondary}
              value={textInput}
              onChangeText={setTextInput}
            />
            <Text style={styles.characterCount}>Số ký tự: {textInput.length}</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.imageUploadContainer}
            onPress={handleImageUpload}
            activeOpacity={0.7}
          >
            {selectedImage ? (
              <Image source={{ uri: selectedImage.uri }} style={styles.uploadedImage} />
            ) : (
              <>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={50} color={Colors.textPlaceholder} />
                </View>
                <Text style={styles.uploadText}>
                  Kéo thả hình ảnh hoặc{' '}
                  <Text style={styles.uploadLink}>chọn tải lên từ tệp</Text>
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Voice Settings */}
        <View style={styles.settingsContainer}>
          {/* Giọng đọc */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Giọng đọc</Text>
            <TouchableOpacity style={styles.dropdown} activeOpacity={0.7}>
              <Text style={styles.dropdownText}>
                {selectedVoice?.name || 'Chọn giọng'}
              </Text>
              <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Tốc độ */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Tốc độ</Text>
            <TouchableOpacity style={styles.dropdown} activeOpacity={0.7}>
              <Text style={styles.dropdownText}>{speed.toFixed(1)}</Text>
              <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Cao thấp */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Cao thấp</Text>
            <TouchableOpacity style={styles.dropdown} activeOpacity={0.7}>
              <Text style={styles.dropdownText}>{pitch}</Text>
              <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Create Voice Button */}
        <TouchableOpacity 
          style={[styles.createButton, creating && styles.createButtonDisabled]}
          onPress={handleCreateVoice}
          activeOpacity={0.7}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.createButtonText}>Tạo giọng nói</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 33,
  },
  tabsContainer: {
    flexDirection: 'row',
    width: 328,
    height: 30,
    marginBottom: 20,
    alignSelf: 'center',
  },
  tab: {
    width: 164,
    height: 30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    backgroundColor: Colors.white,
  },
  tabHighlight: {
    position: 'absolute',
    width: 132.39,
    height: 17,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
  },
  tabText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
    zIndex: 1,
  },
  textInputContainer: {
    width: 328,
    minHeight: 360,
    borderWidth: 2,
    borderColor: '#E1E1E1',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19,
    color: Colors.textPrimary,
    textAlignVertical: 'top',
    minHeight: 300,
  },
  characterCount: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 10,
  },
  imageUploadContainer: {
    width: 328,
    height: 360,
    borderWidth: 2,
    borderColor: '#E1E1E1',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
  uploadText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  uploadLink: {
    color: Colors.secondaryHover,
  },
  settingsContainer: {
    width: 328,
    marginBottom: 20,
    alignSelf: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 19,
    color: Colors.textPrimary,
    width: 88,
  },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 38,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E1E1E1',
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  dropdownText: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 14,
    color: Colors.textSecondary,
  },
  createButton: {
    width: 200,
    height: 48,
    backgroundColor: '#FFB7C5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  createButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.white,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    borderRadius: 200,
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginBottom: 20,
    gap: 12,
    width: 328,
    alignSelf: 'center',
  },
  playButton: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTime: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    color: '#000000',
    minWidth: 67,
    flexShrink: 0,
  },
  timeline: {
    flex: 1,
    height: 4,
    borderRadius: 200,
    position: 'relative',
  },
  timelineBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 200,
  },
  timelineFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#595959',
    borderRadius: 200,
  },
  audioControl: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pronounceButton: {
    width: 328,
    height: 48,
    backgroundColor: '#FFB7C5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  pronounceButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.white,
  },
  downloadLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 8,
  },
  downloadText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19,
    color: Colors.textPrimary,
  },
});