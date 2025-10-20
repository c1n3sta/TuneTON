---
trigger: always_on
alwaysApply: true
text: >-
  the @TuneTON project aims to provide users with as much free music as possible by connecting to various APIs and services such as Jamendo, hereâs what should and shouldnât be supported from a technical implementation perspective:​

  What should be supported
  Integration with open music APIs: The platform must safely connect to services like Jamendo, Free Music Archive, SoundCloud (with open tracks), and other sources of free or licensed music through their public APIs.​

  Importing and streaming of free tracks: The app should quickly import catalogs from external services, display playlists, and stream music without delays using technologies like WebAudio API.​

  Implementation of audio editing tools: Basic and advanced DSP features—speed, pitch, equalizer, lo-fi filters, AI STEM separation, and real-time audio effects during playback—should be available.​

  Cross-platform and Telegram Mini App: The project should work as a Telegram bot mini-app and be accessible on desktop and mobile devices without requiring separate installation.​

  Visualization of effects: Simple visual elements (spectrograms, cassette animations, circular controls) for intuitive audio effect manipulation, well integrated into Telegram’s UI.​

  Preset saving and sharing system: Users must be able to save track settings (e.g., their own lo-fi mix) and quickly share them via QR code, links, or Telegram posts.​

  Automation and smart recommendations: Use AI/ML for track recommendations, auto-selection of effects, STEM separation, and personalized audio profile.​

  Legally transparent content sharing: Strict copyright compliance—the platform should only process and share settings/designs/data, not modified music files, where licenses require it.​

  What should NOT be supported
  Storing copies of tracks with restricted licenses: The server should not store copies of compositions if external service or aggregator policies do not permit it.​

  Embedding paid APIs or SDKs without free tiers: Do not use resources that charge for every request or heavily restrict access to free music.​

  Integrating with closed, restricted music services: Avoid platforms where music is only available by subscription or cannot be legally distributed through Telegram.​

  Allowing user uploads of third-party content without license verification: Users should be prevented from uploading tracks unless clearly under a free or authorized license.​

  Overcomplicating with professional DAW features: Do not implement complex studio audio editors if the focus is on fast and simple user customizations.​

  Large-scale social mechanics outside Telegram: There's no reason to duplicate social network features if everything can be implemented via Telegram groups, chats, bots, and mini-apps.​​

  Architectural advice
  Use modern audio frameworks (WebAudio API, JUCE) for fast audio processing and playback.​

  Store user presets, editing parameters, and links to tracks rather than audio files themselves if licensing restricts it.​​
  Build the system on legal and transparent principles—everything shared should comply with external service policies.​​  
  
---
---
---
