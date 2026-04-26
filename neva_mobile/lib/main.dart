import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'screens/welcome_screen.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const NevaApp());
}

class NevaApp extends StatelessWidget {
  const NevaApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: GetMaterialApp(
        title: 'Neva - Kidney Health',
        theme: AppTheme.lightTheme,
        home: const WelcomeScreen(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
