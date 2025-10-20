\*\*Concept of a Music Streaming Player with Personalized On-the-Fly Track Editing

General Description:
An innovative music streaming player enabling listeners to modify popular tracks live according to their personal preferences. The platform combines a rich music library with modern audio effects, providing a unique experience of customizing compositions during playback.

1. Key Platform Features
   Licensed Track Streaming:
   Access to an extensive library of popular music with high-quality audio.

Real-Time Track Editing:
Users can apply these effects during playback:

Tempo slow-down/speed-up (Pitch & Tempo shift)

Lo-fi mode with special presets simulating vinyl, cassette, radio, "dirty" filters, etc.

Equalizer for manual adjustment of low, mid, and high frequencies

Cut/remix: cutting pieces, looping, adding reverb, changing track structure

Crossfade between effects

Vocal/instrument removal or emphasis via AI STEM separation

Saving and Sharing Presets:
Users can save custom track settings and share them with friends or communities via links or QR codes.

2. Personalization and Social Features
   Personal Audio Profile:
   Users create unique sound "styles" applied to all chosen tracks (e.g., consistently pitch shifted up a half tone plus slight vinyl crackle).

Interactive Playlists:
Build playlists from both original and modified track versions.

Social Challenges:
Prizes for the most popular or unusual customizations, contests for best lo-fi remix, etc.

3. UX/UI Features
   Visual Editor:
   Simple sliders, presets, and circular controls beneath the player.

Audio Effect Visualization:
Spectrum changes when toggling Lo-fi/Hi-Fi modes, tape animation during cassette mode.

Platform Integration:
Desktop and mobile apps integrated with social networks and messengers for sharing custom track versions.

4. Technology Base
   AI and Machine Learning:
   Used for STEM separation, beat detection, and personalized recommendations based on user customizations.

High-Performance Audio Engine:
Built with modern frameworks like WebAudio API, JUCE, and Protobuf for transmitting processed audio data.

Legal Transparency:
User modifications do not violate copyrights as only information about applied settings is shared, not the processed files (or processed via DSP).

5. Additional Features
   Background noises (rain, café, etc.) for immersive listening

Automation of effects based on time-codes during track playback

Support for cross-platform sessions to continue custom listening on any device

DJ mode integration for smooth track transitions while preserving custom effects

This service occupies a niche between classic streaming and beatmaker/jam communities, letting every listener feel like a sound engineer without complex DAWs or technical expertise.

TON Blockchain and Telegram Integration
TON Blockchain Integration:
Built on TON (The Open Network), a scalable, fast decentralized blockchain developed by the Telegram team, providing high transaction throughput and data security.

Telegram Bot / Mini-App:
Accessible inside Telegram as an embedded app, enabling millions of messenger users to use the player without installing separate software.

Royalty Distribution via Toncoin:
Artist and rights holder payments automated by smart contracts on TON, enabling transparent and precise royalty distribution in Toncoin, reducing intermediaries and accelerating payouts.

User Rewards and Prizes:
Participants in remix contests and social activities earn Toncoin rewards, boosting community engagement.

Decentralized Content Storage:
TON Storage and other TON services ensure protection of original content and user edits, respecting author rights.

NFT Ecosystem:
Create, sell, and trade unique audio presets and customized track versions as NFTs within the TON environment.

The player thus becomes part of a decentralized music ecosystem with transparent monetization and active community interaction inside Telegram and the TON blockchain, providing unique opportunities for artists and listeners utilizing advanced TON technology and Telegram's revolutionary platform.

Advanced Gamification Leveraging Telegram Stars and Latest Features
Telegram Stars and Gifts System

Earn Stars for app activity: listening, creating/publishing custom tracks, participating in challenges.

Stars can be exchanged for unique profile decorations, stickers, audio presets, premium features (e.g., enhanced audio effects, AI STEM separation), or sent as appreciation to artists/users.

Animated Gifts can be sent for great mixes or challenge participation; Gifts can be converted to Stars or stored for profile status.

Social and Competitive Elements

Regular challenges/tournaments (e.g., best weekly lo-fi remix, speedrun mix creation). Winners get Stars, NFT rewards, exclusive Gifts displayable in profiles.

Leaderboards tracking listens, likes, Stars earned, collaborative remixes, publicly visible in Telegram profiles.

Collectible NFT audio badges for milestones (first remix, marathon participation, top weekly charts), viewable, tradable, or sellable via TON.

Telegram Integration and Personalization

Full compatibility with Telegram Mini Apps: instant launch via chat or QR code, push notifications on events and rewards, unified Telegram profile and audience.

Public profiles and Gift collections: display achievements, animated Gifts, and NFTs as part of social identity.

Groups and team challenges for collaborative music battles, club rankings, or communities inside Telegram.

Latest Telegram Ecosystem Mechanics

Use Stars for promoting mixes/playlists inside Telegram through promotional posts or exclusive content access.

AI integration and custom bots assist in remix creation, challenge management, and idea generation (e.g., Grok AI/Telegram bot).

Reactive, animated UI with interactive emoji reactions, achievement animations, and dynamic interface themes reflecting user progress and profile status.

Monetization and Cash Out

Stars earned convert to TON cryptocurrency, then to real money or spent on Telegram marketplace for NFTs and exclusives.

This music player becomes not only an audio and editing tool but also a social platform enriched with extensive gamification, fitting perfectly into Telegram's ecosystem, driven by Stars, Gifts, NFTs, challenges, achievements, and team competitions—leveraging all the latest Telegram features of 2025 for a cutting-edge, engaging user experience.

# Telegram Web App Integration

This document explains how the Telegram Web App integration works in the MelodyMix application.

## Features

- Seamless authentication with Telegram accounts
- Protected routes that require authentication
- Responsive onboarding experience
- Development mode support for testing outside Telegram

## How It Works

1. **Authentication Flow**:

   - When the app loads, it checks if it's running inside Telegram WebView
   - If running in Telegram, it initializes the WebApp and checks for user data
   - If not authenticated, users are redirected to the onboarding screen
   - Users can connect their Telegram account via the onboarding flow

2. **Development Mode**:
   - When running outside Telegram (e.g., in a browser), a mock user is used
   - This allows for easier development and testing

\*\*

<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->