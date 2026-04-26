import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../theme/app_theme.dart';
import 'signup_screen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              const Color(0xFFF5F3FF),
              const Color(0xFFFAF8FF),
              Colors.white,
            ],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Logo
                Column(
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: const Color(0xFFE5E0FA),
                        borderRadius: BorderRadius.circular(40),
                      ),
                      child: const Icon(
                        Icons.favorite,
                        color: Color(0xFF4C3B9E),
                        size: 40,
                      ),
                    ),
                    const SizedBox(height: 32),
                    Text(
                      'Welcome to Neva',
                      style: Theme.of(context).textTheme.headlineLarge,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    const Text('👋', style: TextStyle(fontSize: 28)),
                    const SizedBox(height: 24),
                    Text(
                      "Let's get you started",
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: AppTheme.textMuted,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
                // Buttons
                Column(
                  children: [
                    // Google Button
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: () {
                          // Handle Google sign-in
                        },
                        icon: const Text('G', style: TextStyle(fontSize: 18)),
                        label: const Text('Continue with Google'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          side: const BorderSide(color: AppTheme.border),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Divider
                    Row(
                      children: [
                        Expanded(
                          child: Divider(
                            color: AppTheme.border,
                            thickness: 1,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          child: Text(
                            'OR',
                            style: Theme.of(context).textTheme.labelSmall,
                          ),
                        ),
                        Expanded(
                          child: Divider(
                            color: AppTheme.border,
                            thickness: 1,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Phone Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () => Get.to(() => const SignupScreen(method: 'phone')),
                        icon: const Icon(Icons.phone),
                        label: const Text('Continue with Phone'),
                      ),
                    ),
                    const SizedBox(height: 12),
                    // Email Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () => Get.to(() => const SignupScreen(method: 'email')),
                        icon: const Icon(Icons.email),
                        label: const Text('Continue with Email'),
                      ),
                    ),
                  ],
                ),
                // Security note
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.shield, color: AppTheme.success, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'Your data is private & secure',
                      style: Theme.of(context).textTheme.labelSmall,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
