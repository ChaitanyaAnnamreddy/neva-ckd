import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../theme/app_theme.dart';
import 'splash_screen.dart';

class ProfileSetupScreen extends StatefulWidget {
  final String contactValue;
  final String method;

  const ProfileSetupScreen({
    Key? key,
    required this.contactValue,
    required this.method,
  }) : super(key: key);

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  late TextEditingController _nameController;
  String _error = '';

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _submit() {
    final name = _nameController.text.trim();

    if (name.isEmpty) {
      setState(() => _error = 'Please enter your name.');
      return;
    }

    setState(() => _error = '');
    Get.to(() => SplashScreen(userName: name));
  }

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
                // Header
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    GestureDetector(
                      onTap: () => Get.back(),
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppTheme.border,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Icon(Icons.arrow_back, color: AppTheme.textPrimary),
                      ),
                    ),
                    const SizedBox(height: 32),
                    Text(
                      "What's your name?",
                      style: Theme.of(context).textTheme.headlineLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'We\'ll use this to personalize your assessment.',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
                // Input
                Column(
                  children: [
                    TextField(
                      controller: _nameController,
                      decoration: InputDecoration(
                        hintText: 'Your name',
                      ),
                      autofocus: true,
                    ),
                    if (_error.isNotEmpty) ...[
                      const SizedBox(height: 14),
                      Text(
                        _error,
                        style: const TextStyle(color: AppTheme.danger, fontSize: 13),
                      ),
                    ],
                  ],
                ),
                // Buttons
                Column(
                  children: [
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _submit,
                        child: const Text('Continue →'),
                      ),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        onPressed: () => Get.back(),
                        child: const Text('Back'),
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
