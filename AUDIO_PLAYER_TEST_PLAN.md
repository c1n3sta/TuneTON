# Audio Player Test Plan

## Executive Summary

This document outlines a comprehensive test plan to validate the audio player fixes. The tests focus on verifying that the architectural conflict between HTMLAudioElement and WebAudioEngine is resolved, and that all audio functionality works correctly.

## 1. Unit Tests

### 1.1 useAudioPlayer Hook Tests

**Test File**: `src/hooks/useAudioPlayer.test.ts`

**Test Cases**:

1. **Audio Engine Initialization**
   ```typescript
   test('should initialize AudioEngineWrapper', () => {
     const { result } = renderHook(() => useAudioPlayer());
     expect(result.current).toBeDefined();
     // Verify audioEngine is initialized
   });
   ```

2. **Load Track Function**
   ```typescript
   test('should delegate loadTrack to AudioEngineWrapper', async () => {
     const { result } = renderHook(() => useAudioPlayer());
     const mockTrack: AudioTrack = {
       id: '123',
       title: 'Test Track',
       artist: 'Test Artist',
       duration: 180,
       source: 'https://example.com/test.mp3'
     };
     
     // Mock AudioEngineWrapper.loadTrack
     const mockLoadTrack = jest.fn();
     // ... setup mock
     
     await act(async () => {
       result.current.loadTrack(mockTrack);
     });
     
     expect(mockLoadTrack).toHaveBeenCalledWith(mockTrack);
   });
   ```

3. **Play/Pause Functionality**
   ```typescript
   test('should delegate play/pause to AudioEngineWrapper', async () => {
     const { result } = renderHook(() => useAudioPlayer());
     
     // Mock AudioEngineWrapper methods
     const mockPlay = jest.fn();
     const mockPause = jest.fn();
     // ... setup mocks
     
     // Test play
     await act(async () => {
       result.current.togglePlayPause();
     });
     expect(mockPlay).toHaveBeenCalled();
     
     // Test pause
     await act(async () => {
       result.current.togglePlayPause();
     });
     expect(mockPause).toHaveBeenCalled();
   });
   ```

4. **Seek Function**
   ```typescript
   test('should delegate seek to AudioEngineWrapper', () => {
     const { result } = renderHook(() => useAudioPlayer());
     const mockSeek = jest.fn();
     // ... setup mock
     
     act(() => {
       result.current.seek(30);
     });
     
     expect(mockSeek).toHaveBeenCalledWith(30);
   });
   ```

5. **Volume Control**
   ```typescript
   test('should delegate volume control to AudioEngineWrapper', () => {
     const { result } = renderHook(() => useAudioPlayer());
     const mockSetVolume = jest.fn();
     // ... setup mock
     
     act(() => {
       result.current.setVolume(0.5);
     });
     
     expect(mockSetVolume).toHaveBeenCalledWith(0.5);
   });
   ```

### 1.2 AudioEngineWrapper Tests

**Test File**: `src/core/audio/AudioEngineWrapper.test.ts`

**Test Cases**:

1. **Initialization on User Interaction**
   ```typescript
   test('should initialize WebAudioEngine on first user interaction', async () => {
     const wrapper = new AudioEngineWrapper();
     const mockEngine = {
       loadTrack: jest.fn(),
       play: jest.fn()
     };
     
     // Mock WebAudioEngine constructor
     const mockConstructor = jest.fn(() => mockEngine);
     (global as any).WebAudioEngine = mockConstructor;
     
     await wrapper.loadTrack({} as AudioTrack);
     
     expect(mockConstructor).toHaveBeenCalled();
     expect(wrapper.hasUserInteracted).toBe(true);
   });
   ```

2. **Method Delegation**
   ```typescript
   test('should delegate methods to WebAudioEngine', async () => {
     const wrapper = new AudioEngineWrapper();
     const mockEngine = {
       loadTrack: jest.fn(),
       play: jest.fn(),
       pause: jest.fn()
     };
     
     // Force initialization
     (wrapper as any).audioEngine = mockEngine;
     
     await wrapper.loadTrack({} as AudioTrack);
     wrapper.pause();
     
     expect(mockEngine.loadTrack).toHaveBeenCalled();
     expect(mockEngine.pause).toHaveBeenCalled();
   });
   ```

### 1.3 URL Validation Tests

**Test File**: `src/components/player/utils.test.ts`

**Test Cases**:

1. **Valid Jamendo URLs**
   ```typescript
   test('should validate correct Jamendo streaming URLs', () => {
     const validUrl = 'https://api.jamendo.com/v3.0/tracks/filestream/?track_id=12345&client_id=abcdef123456';
     expect(isValidAudioUrl(validUrl)).toBe(true);
   });
   ```

2. **Invalid Jamendo URLs**
   ```typescript
   test('should reject malformed Jamendo URLs', () => {
     const invalidUrls = [
       'https://api.jamendo.com/v3.0/tracks/filestream/?track_id=abc&client_id=123',
       'https://api.jamendo.com/v3.0/tracks/filestream/?track_id=123',
       'https://example.com/v3.0/tracks/filestream/?track_id=123&client_id=abc'
     ];
     
     invalidUrls.forEach(url => {
       expect(isValidAudioUrl(url)).toBe(false);
     });
   });
   ```

3. **Valid Audio Extensions**
   ```typescript
   test('should validate URLs with audio extensions', () => {
     const validUrls = [
       'https://example.com/audio.mp3',
       'https://example.com/audio.wav',
       'https://example.com/audio.ogg',
       'https://example.com/audio.m4a',
       'https://example.com/audio.flac'
     ];
     
     validUrls.forEach(url => {
       expect(isValidAudioUrl(url)).toBe(true);
     });
   });
   ```

## 2. Integration Tests

### 2.1 Audio Playback Flow

**Test File**: `src/integration/audioPlayback.test.ts`

**Test Cases**:

1. **Complete Playback Flow**
   ```typescript
   test('should complete full playback flow from track loading to playback', async () => {
     // Setup mock Jamendo track
     const jamendoTrack: JamendoTrack = {
       id: 12345,
       name: 'Test Track',
       artist_name: 'Test Artist',
       duration: 180,
       audio: 'https://api.jamendo.com/v3.0/tracks/filestream/?track_id=12345&client_id=testkey'
     };
     
     // Render MusicPlayer with track
     const { getByTestId } = render(
       <MusicPlayer currentTrack={jamendoTrack} />
     );
     
     // Wait for track to load
     await waitFor(() => {
       expect(getByTestId('track-title')).toHaveTextContent('Test Track');
     });
     
     // Click play button
     const playButton = getByTestId('play-button');
     fireEvent.click(playButton);
     
     // Verify audio engine is called
     // This would require mocking the AudioEngineWrapper
   });
   ```

2. **Effect Controls Integration**
   ```typescript
   test('should apply audio effects through the engine', async () => {
     const { getByTestId } = render(<MusicPlayer />);
     
     // Open effects panel
     const effectsButton = getByTestId('effects-button');
     fireEvent.click(effectsButton);
     
     // Adjust EQ
     const eqSlider = getByTestId('eq-band-0');
     fireEvent.change(eqSlider, { target: { value: 5 } });
     
     // Verify effect is applied
     // This would require mocking the AudioEngineWrapper methods
   });
   ```

## 3. End-to-End Tests

### 3.1 Real Device Testing

**Test Environment**: Telegram Web Apps on iOS and Android

**Test Cases**:

1. **Basic Playback**
   - Load a track from Jamendo
   - Verify track metadata displays correctly
   - Click play button
   - Verify audio plays without errors
   - Check that playback controls update correctly

2. **Effect Application**
   - Open effects panel
   - Apply EQ settings
   - Verify audio changes are audible
   - Test reverb and other effects

3. **Seek Functionality**
   - Play a track
   - Drag progress bar to middle
   - Verify playback continues from new position
   - Check that time display updates correctly

4. **Volume Control**
   - Adjust volume slider
   - Verify audio level changes
   - Test mute/unmute functionality

### 3.2 Browser Compatibility

**Test Browsers**:
- Chrome (Desktop and Mobile)
- Safari (Desktop and Mobile)
- Firefox
- Edge

**Test Cases**:
- Verify audio playback works in all browsers
- Check that autoplay policy handling works correctly
- Confirm that effects are applied consistently

## 4. Performance Tests

### 4.1 Memory Usage

**Test**: Monitor memory usage during extended playback sessions

**Metrics**:
- Memory consumption should remain stable
- No significant increase over time
- Proper cleanup when tracks change

### 4.2 CPU Usage

**Test**: Monitor CPU usage during playback with effects

**Metrics**:
- CPU usage should be reasonable (<50% on mobile devices)
- No performance degradation over time
- Smooth UI interactions during playback

### 4.3 Network Performance

**Test**: Measure streaming performance with various network conditions

**Metrics**:
- Fast loading times for track metadata
- Smooth streaming without buffering
- Graceful handling of network interruptions

## 5. Error Handling Tests

### 5.1 Invalid Track Data

**Test Cases**:
- Load track with missing ID
- Load track with invalid audio URL
- Load track with malformed data
- Verify appropriate error messages are displayed

### 5.2 Network Errors

**Test Cases**:
- Simulate network failure during track loading
- Test with unreachable Jamendo API
- Verify retry mechanisms work
- Check that users receive helpful error messages

### 5.3 Autoplay Restrictions

**Test Cases**:
- Test in browsers with strict autoplay policies
- Verify user interaction prompts appear
- Confirm that audio plays after user interaction
- Check that error handling works for autoplay blocks

## 6. Regression Tests

### 6.1 Previous Functionality

**Test Cases**:
- Verify that all existing UI features still work
- Check that navigation between sections functions correctly
- Confirm that user preferences are maintained
- Validate that all visual elements display properly

### 6.2 Edge Cases

**Test Cases**:
- Load very short tracks (<10 seconds)
- Load very long tracks (>1 hour)
- Test with tracks that have special characters in titles
- Verify handling of tracks with no cover art
- Test with tracks that fail to load

## 7. Validation Criteria

### 7.1 Success Metrics

1. **Functional Requirements**:
   - ✅ Audio playback works on 100% of valid tracks
   - ✅ All audio effects function properly
   - ✅ Playback controls respond correctly
   - ✅ Error handling provides clear feedback

2. **Performance Requirements**:
   - ✅ Memory usage <100MB during normal operation
   - ✅ CPU usage <50% on mobile devices
   - ✅ Track loading time <3 seconds
   - ✅ No noticeable UI lag during playback

3. **Compatibility Requirements**:
   - ✅ Works in Telegram Web Apps on iOS and Android
   - ✅ Compatible with Chrome, Safari, Firefox, Edge
   - ✅ Functions correctly on various screen sizes
   - ✅ No browser-specific issues

### 7.2 Failure Conditions

The fix is considered unsuccessful if:
- Audio playback fails on valid tracks
- Memory usage exceeds 200MB
- CPU usage consistently exceeds 70%
- User interface becomes unresponsive
- Error messages are unclear or misleading
- Any existing functionality is broken

## 8. Test Execution Plan

### 8.1 Phase 1: Unit Tests (Day 1)
- Implement and run all unit tests
- Fix any failing tests
- Achieve 90%+ code coverage for audio components

### 8.2 Phase 2: Integration Tests (Day 2)
- Implement integration tests
- Verify component interactions
- Test error handling scenarios

### 8.3 Phase 3: Manual Testing (Day 3)
- Test on real devices
- Verify Telegram Web Apps compatibility
- Check browser compatibility

### 8.4 Phase 4: Performance Testing (Day 4)
- Run memory and CPU usage tests
- Test under various network conditions
- Optimize performance if needed

### 8.5 Phase 5: Regression Testing (Day 5)
- Verify existing functionality still works
- Test edge cases
- Final validation on all target platforms

## 9. Test Data

### 9.1 Test Tracks

**Valid Tracks**:
- Various genres and durations
- Different audio quality levels
- Tracks with and without cover art
- Tracks from different Jamendo artists

**Invalid Tracks**:
- Tracks with malformed URLs
- Tracks with missing metadata
- Tracks with expired streaming links

### 9.2 Test Environments

**Devices**:
- iPhone 12+ (iOS 15+)
- Samsung Galaxy S21+ (Android 12+)
- Desktop browsers (latest versions)

**Network Conditions**:
- WiFi (high speed)
- 4G/LTE (moderate speed)
- 3G (low speed)
- Intermittent connectivity

## 10. Reporting

### 10.1 Test Results

Each test phase will produce:
- Test execution report
- Defect log with severity levels
- Performance metrics
- Compatibility matrix

### 10.2 Success Criteria

The fix is considered successful when:
- All unit tests pass (100%)
- All integration tests pass (100%)
- Manual testing shows no critical issues
- Performance metrics meet requirements
- All target platforms function correctly