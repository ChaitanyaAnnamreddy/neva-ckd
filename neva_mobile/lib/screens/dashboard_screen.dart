import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../theme/app_theme.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _waterIntake = 5;
  final int _maxWater = 8;

  @override
  Widget build(BuildContext context) {
    const riskLevel = 'low';
    const riskColor = AppTheme.success;
    const streak = 3;

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
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Good morning',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Your Dashboard',
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 32),
                // Streak Card
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
                  child: Row(
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'CURRENT STREAK',
                            style: Theme.of(context).textTheme.labelSmall,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '$streak days',
                            style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                              color: AppTheme.secondary,
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          color: const Color(0xFFFED7AA),
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: const Icon(
                          Icons.local_fire_department,
                          color: AppTheme.secondary,
                          size: 32,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                // Last Screening
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: riskColor.withOpacity(0.2),
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 16,
                      ),
                    ],
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'LAST SCREENING',
                            style: Theme.of(context).textTheme.labelSmall,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Low Risk',
                            style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                              color: riskColor,
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      Icon(
                        Icons.check_circle,
                        color: riskColor,
                        size: 40,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                // Hydration Tracker
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
                          Text(
                            'Hydration today',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          Text(
                            '$_waterIntake/$_maxWater glasses',
                            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              color: AppTheme.primary,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 4,
                          crossAxisSpacing: 8,
                          mainAxisSpacing: 8,
                        ),
                        itemCount: _maxWater,
                        itemBuilder: (context, index) {
                          final isFilled = index < _waterIntake;
                          return GestureDetector(
                            onTap: () {
                              setState(() {
                                _waterIntake = index + 1;
                              });
                            },
                            child: Container(
                              decoration: BoxDecoration(
                                color: isFilled ? const Color(0xFF06B6D4) : const Color(0xFFF3F4F6),
                                borderRadius: BorderRadius.circular(10),
                                boxShadow: isFilled
                                    ? [
                                  BoxShadow(
                                    color: const Color(0xFF06B6D4).withOpacity(0.2),
                                    blurRadius: 8,
                                  ),
                                ]
                                    : [],
                              ),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 16),
                      Text(
                        _waterIntake >= 6
                            ? '✓ Great hydration! Keep it up.'
                            : _waterIntake >= 4
                                ? 'Keep going — aim for 6–8 glasses.'
                                : 'Drink more water — kidneys need it.',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                // Achievements
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Achievements',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 16),
                    GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 1,
                      children: [
                        _buildBadge('💧', 'First Screen', true),
                        _buildBadge('🔥', '3-Day Streak', true),
                        _buildBadge('💪', 'Hydration Pro', false),
                        _buildBadge('⭐', '30-Day Check', false),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 32),
                // Retake Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {},
                    child: const Text('Retake Screening'),
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

  Widget _buildBadge(String emoji, String label, bool earned) {
    return Container(
      decoration: BoxDecoration(
        color: earned ? const Color(0xFFE0E7FF) : const Color(0xFFF3F4F6),
        border: Border.all(
          color: earned ? AppTheme.primary : AppTheme.border,
          width: earned ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(emoji, style: const TextStyle(fontSize: 28)),
          const SizedBox(height: 8),
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontWeight: earned ? FontWeight.w600 : FontWeight.w500,
              color: earned ? AppTheme.textPrimary : AppTheme.textMuted,
            ),
          ),
        ],
      ),
    );
  }
}
