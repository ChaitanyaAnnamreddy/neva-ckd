import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../theme/app_theme.dart';
import 'explanation_screen.dart';

class ResultsScreen extends StatefulWidget {
  final Map<String, dynamic> answers;
  final Map<String, dynamic> stripData;

  const ResultsScreen({
    Key? key,
    required this.answers,
    required this.stripData,
  }) : super(key: key);

  @override
  State<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends State<ResultsScreen> with TickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  final String riskLevel = 'low'; // Would be calculated based on answers
  final int riskScore = 22;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    );
    _animation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _getRiskLabel() {
    switch (riskLevel) {
      case 'low':
        return 'Low Risk';
      case 'moderate':
        return 'Moderate Risk';
      case 'high':
        return 'High Risk';
      default:
        return 'Unknown';
    }
  }

  Color _getRiskColor() {
    switch (riskLevel) {
      case 'low':
        return AppTheme.success;
      case 'moderate':
        return AppTheme.warning;
      case 'high':
        return AppTheme.danger;
      default:
        return AppTheme.primary;
    }
  }

  @override
  Widget build(BuildContext context) {
    final riskColor = _getRiskColor();

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
            child: ListView(
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
                    const SizedBox(width: 12),
                    Text(
                      'Assessment Result',
                      style: Theme.of(context).textTheme.labelSmall,
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                // Risk Card
                Container(
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: riskColor.withOpacity(0.2), width: 1),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 16,
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Icon(
                        riskLevel == 'low'
                            ? Icons.check_circle
                            : riskLevel == 'moderate'
                                ? Icons.info
                                : Icons.warning_rounded,
                        color: riskColor,
                        size: 64,
                      ),
                      const SizedBox(height: 20),
                      Text(
                        _getRiskLabel(),
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          color: riskColor,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Kidney health risk assessment',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                // Risk Score
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
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'RISK SCORE',
                                style: Theme.of(context).textTheme.labelSmall,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                '$riskScore%',
                                style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                                  color: riskColor,
                                ),
                              ),
                            ],
                          ),
                          Column(
                            children: [
                              Text(
                                'ASSESSMENT RANGE',
                                style: Theme.of(context).textTheme.labelSmall,
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  Container(
                                    width: 32,
                                    height: 8,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFE0E7FF),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    width: 32,
                                    height: 8,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFFEF3C7),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    width: 32,
                                    height: 8,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFFEE2E2),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: ScaleTransition(
                          scale: _animation,
                          alignment: Alignment.centerLeft,
                          child: LinearProgressIndicator(
                            value: riskScore / 100,
                            minHeight: 12,
                            backgroundColor: const Color(0xFFF3F4F6),
                            valueColor: AlwaysStoppedAnimation(riskColor),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                // Contributing Factors
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Key contributing factors',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.border),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: riskColor.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Icon(
                              Icons.shield,
                              color: riskColor,
                              size: 16,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'Good kidney health indicators',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 32),
                // Next Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Get.to(() => const ExplanationScreen()),
                    child: const Text('See Personalised Advice →'),
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
