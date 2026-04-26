import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../theme/app_theme.dart';
import 'questionnaire_screen.dart';

class SplashScreen extends StatelessWidget {
  final String userName;

  const SplashScreen({Key? key, required this.userName}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              const Color(0xFFFAF8F6),
              const Color(0xFFF5F3F0),
              Colors.white,
            ],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Logo Section
                Column(
                  children: [
                    Container(
                      width: 140,
                      height: 140,
                      decoration: BoxDecoration(
                        color: const Color(0xFFE0E7FF),
                        borderRadius: BorderRadius.circular(70),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.primary.withOpacity(0.15),
                            blurRadius: 40,
                            spreadRadius: 12,
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.favorite,
                        color: AppTheme.primary,
                        size: 70,
                      ),
                    ),
                  ],
                ),
                // Greeting Section
                Column(
                  children: [
                    Text(
                      'Hi $userName, I\'m Neva AI',
                      style: Theme.of(context).textTheme.headlineMedium,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppTheme.border),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 16,
                            spreadRadius: 0,
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Text(
                            'Let\'s check your kidney health',
                            style: Theme.of(context).textTheme.bodyLarge,
                          ),
                          const SizedBox(height: 10),
                          Text(
                            'This will take less than 2 minutes.',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                // CTA Section
                Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppTheme.success.withOpacity(0.08),
                        border: Border.all(color: AppTheme.success.withOpacity(0.2)),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.shield, color: AppTheme.success, size: 16),
                          const SizedBox(width: 6),
                          Text(
                            'This is private and not a diagnosis',
                            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                              color: AppTheme.success,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 28),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () => Get.to(() => const QuestionnaireScreen()),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          backgroundColor: AppTheme.primary,
                        ),
                        child: const Text('Start Assessment →'),
                      ),
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
