import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'dart:async';
import '../theme/app_theme.dart';
import 'results_screen.dart';

class CameraScreen extends StatefulWidget {
  final Map<String, dynamic> answers;

  const CameraScreen({Key? key, required this.answers}) : super(key: key);

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  bool _isScanning = false;

  void _simulateScan() {
    setState(() => _isScanning = true);

    // Simulate scanning
    Timer(const Duration(seconds: 3), () {
      final stripData = {
        'protein': 'Neg',
        'glucose': 'Neg',
        'blood': 'Neg',
        'ph': '6',
        'pusCells': 'Neg',
        'sg': '1.015',
      };

      Get.to(
        () => ResultsScreen(
          answers: widget.answers,
          stripData: stripData,
        ),
      );
    });
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
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
            child: Column(
              children: [
                // Header
                Row(
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
                    const Spacer(),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('Scan Strip', style: Theme.of(context).textTheme.titleLarge),
                        const SizedBox(height: 4),
                        Text(
                          'Upload image',
                          style: Theme.of(context).textTheme.labelSmall,
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 40),
                // Content
                Expanded(
                  child: _isScanning
                      ? Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Analysing your sample',
                            style: Theme.of(context).textTheme.headlineMedium,
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'This will take a few secs. Please keep your phone steady',
                            style: Theme.of(context).textTheme.bodyMedium,
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 32),
                          SizedBox(
                            width: 200,
                            height: 200,
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                Container(
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFE0E7FF),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                ),
                                Icon(
                                  Icons.image,
                                  size: 80,
                                  color: AppTheme.primary,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 32),
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppTheme.border),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'CHECKING',
                                  style: Theme.of(context).textTheme.labelSmall,
                                ),
                                const SizedBox(height: 16),
                                _buildProgressItem('Protein detected', true),
                                const SizedBox(height: 12),
                                _buildProgressItem('Glucose checked', true),
                                const SizedBox(height: 12),
                                _buildProgressItem('Checking pH...', false),
                              ],
                            ),
                          ),
                        ],
                      )
                      : Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 280,
                            height: 280,
                            decoration: BoxDecoration(
                              color: const Color(0xFFE0E7FF),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: AppTheme.primary,
                                width: 2,
                                strokeAlign: BorderSide.strokeAlignOutside,
                              ),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.camera_alt,
                                  size: 64,
                                  color: AppTheme.primary,
                                ),
                                const SizedBox(height: 16),
                                Column(
                                  children: [
                                    Text(
                                      'Position strip here',
                                      style: Theme.of(context).textTheme.titleLarge,
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'Align strip in the scanner frame',
                                      style: Theme.of(context).textTheme.bodyMedium,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),
                          Text(
                            'Make sure the lighting is good and the strip is clearly visible for accurate results.',
                            style: Theme.of(context).textTheme.bodyMedium,
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                ),
                const SizedBox(height: 24),
                if (!_isScanning)
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _simulateScan,
                      icon: const Icon(Icons.camera_alt),
                      label: const Text('Open Camera'),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProgressItem(String label, bool completed) {
    return Row(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: const Color(0xFFE0E7FF),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(
            completed ? Icons.check : Icons.schedule,
            color: AppTheme.primary,
            size: 18,
          ),
        ),
        const SizedBox(width: 12),
        Text(
          label,
          style: TextStyle(
            color: AppTheme.primary,
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
