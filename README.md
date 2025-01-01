# Toronto Audio Tour Guide 🎧 🗺️

An interactive mobile application that provides audio-guided tours of Toronto's landmarks and attractions, built with React Native and Expo.

## Features

- 🎧 **Audio Tours**: Immersive audio guides for Toronto's landmarks
- 🗺️ **Interactive Map**: Explore Toronto with an interactive map featuring key attractions
- ⭐ **Favorites System**: Save and quickly access your favorite locations
- 🎨 **Toronto-Themed**: Designed with Toronto's official flag colors (Blue #2D3F7D, Red #ED2939)
- 🎮 **Advanced Audio Controls**:
  - Play/Pause functionality
  - Speed control (1x/2x)
  - 10-second skip forward/backward
  - Progress tracking
  - Volume control

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npx expo start
```

## App Structure

The app consists of three main tabs:

### 🏠 Home Tab

- Welcome screen with Toronto skyline
- Featured attractions carousel
- Favorites collection
- Quick access to popular tours

### 🗺️ Explore Tab

- Interactive map of Toronto
- Location markers with categories:
  - Landmarks (Red)
  - Sports venues (Blue)
  - Attractions (Green)
- Information callouts with ratings and tour access

### 🎧 Tour Tab

- Full-screen audio player
- Location information
- Advanced playback controls
- Favorite toggle functionality

## Technologies Used

- React Native with Expo
- TypeScript for type safety
- Expo Router for navigation
- Zustand for state management
- Expo AV for audio handling
- React Native Maps for location features
- React Native Reanimated for animations

## Development

To run the app in development mode:

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- City of Toronto for inspiration
- Expo team for the development framework
- React Native community for resources and support

## Contact

For any inquiries about this project, please reach out to [your-contact-info].
