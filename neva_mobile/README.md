# Neva Mobile App - Flutter

A cross-platform mobile application for kidney health assessment using Flutter.

## 📋 Prerequisites

### 1. Install Flutter SDK

**Option A: Using Homebrew (macOS)**
```bash
brew install flutter
```

**Option B: Manual Installation**
- Download from: https://flutter.dev/docs/get-started/install/macos
- Extract to `~/development/flutter`
- Add to `~/.zshrc`:
  ```bash
  export PATH="$PATH:~/development/flutter/bin"
  ```
- Reload: `source ~/.zshrc`

**Option C: Using FVM (Recommended)**
```bash
brew install fvm
fvm install stable
fvm global stable
```

### 2. Verify Installation
```bash
flutter --version
flutter doctor
```

## 🚀 Getting Started

### 1. Clone/Navigate to the project
```bash
cd neva_mobile
```

### 2. Install dependencies
```bash
flutter pub get
```

### 3. Run the app
```bash
# For iOS
flutter run -d macos

# For Android
flutter run -d android

# For Web (development)
flutter run -d chrome
```

## 📁 Project Structure

```
neva_mobile/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── theme/
│   │   └── app_theme.dart          # Design system
│   ├── models/
│   │   ├── user_model.dart         # User data
│   │   └── assessment_model.dart   # Assessment results
│   ├── providers/
│   │   └── auth_provider.dart      # State management
│   └── screens/
│       ├── welcome_screen.dart      # Welcome/Sign-in
│       ├── signup_screen.dart       # Phone/Email signup
│       ├── profile_setup_screen.dart # Name entry
│       ├── splash_screen.dart       # Greeting screen
│       ├── questionnaire_screen.dart # Health questions
│       ├── camera_screen.dart       # Strip scanning
│       ├── results_screen.dart      # Assessment results
│       ├── explanation_screen.dart  # Personalized advice
│       └── dashboard_screen.dart    # User dashboard
├── pubspec.yaml                     # Dependencies
└── README.md                        # This file
```

## 🎨 Design Features

- ✅ Light theme with cream/white gradient backgrounds
- ✅ Clean white cards with subtle borders
- ✅ Proper icons instead of emojis
- ✅ Smooth animations and transitions
- ✅ Responsive mobile-first design
- ✅ Back navigation on all screens

## 📦 Dependencies

### Core
- `flutter` - Framework
- `get` - Navigation & state management
- `provider` - State management

### UI
- `fl_chart` - Charts (for trajectory graph)
- `shimmer` - Shimmer loading effects
- `cupertino_icons` - iOS-style icons

### Utilities
- `image_picker` - Camera/gallery access
- `camera` - Camera functionality

## 🚀 Production Build

### iOS
```bash
flutter build ios --release
```

### Android
```bash
flutter build apk --release
flutter build appbundle --release
```

### Web
```bash
flutter build web --release
```

## 📚 Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [Dart Documentation](https://dart.dev/guides)
- [Get Package](https://pub.dev/packages/get)
- [Provider Documentation](https://pub.dev/packages/provider)

## 📄 License

Proprietary - Neva Health
