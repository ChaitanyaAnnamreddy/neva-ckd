import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../theme/app_theme.dart';
import 'profile_setup_screen.dart';

class SignupScreen extends StatefulWidget {
  final String method; // 'phone' or 'email'

  const SignupScreen({Key? key, required this.method}) : super(key: key);

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  late TextEditingController _controller;
  String _error = '';

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submit() {
    final value = _controller.text.trim();

    if (value.isEmpty) {
      setState(() => _error = 'Please enter your details.');
      return;
    }

    if (widget.method == 'email' && !value.contains('@')) {
      setState(() => _error = 'Enter a valid email address.');
      return;
    }

    if (widget.method == 'phone' && value.replaceAll(RegExp(r'[^0-9]'), '').length < 6) {
      setState(() => _error = 'Enter a valid phone number.');
      return;
    }

    setState(() => _error = '');
    // Navigate to OTP verification
    Get.to(() => ProfileSetupScreen(contactValue: value, method: widget.method));
  }

  @override
  Widget build(BuildContext context) {
    final isPhone = widget.method == 'phone';
    final label = isPhone ? 'Phone number' : 'Email address';
    final placeholder = isPhone ? '+91 98765 43210' : 'you@example.com';

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              const Color(0xFFEFF6FF),
              const Color(0xFFF8FAFC),
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
                      'Sign up',
                      style: Theme.of(context).textTheme.headlineLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Enter your ${label.toLowerCase()} to receive your verification code.',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
                // Input Fields
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(label, style: Theme.of(context).textTheme.labelSmall),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _controller,
                      keyboardType: isPhone ? TextInputType.phone : TextInputType.emailAddress,
                      decoration: InputDecoration(
                        hintText: placeholder,
                      ),
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
                        child: const Text('Send code'),
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
