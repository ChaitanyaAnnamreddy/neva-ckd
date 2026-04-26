import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../theme/app_theme.dart';
import 'camera_screen.dart';

class QuestionnaireScreen extends StatefulWidget {
  const QuestionnaireScreen({Key? key}) : super(key: key);

  @override
  State<QuestionnaireScreen> createState() => _QuestionnaireScreenState();
}

class _QuestionnaireScreenState extends State<QuestionnaireScreen> {
  int _currentStep = 0;
  Map<String, dynamic> _answers = {};

  final List<Map<String, dynamic>> _questions = [
    {
      'id': 'age',
      'label': 'Age group',
      'type': 'select',
      'options': ['18–29', '30–44', '45–59', '60+'],
    },
    {
      'id': 'conditions',
      'label': 'Any health conditions?',
      'type': 'checkbox',
      'options': ['Diabetes', 'High Blood Pressure', 'Kidney Issues'],
    },
    {
      'id': 'water',
      'label': 'Daily water intake',
      'type': 'select',
      'options': ['<1L', '1–2L', '2–3L', '3L+'],
    },
    {
      'id': 'exercise',
      'label': 'Exercise frequency',
      'type': 'select',
      'options': ['Rarely', '1–2 times/week', 'Regularly'],
    },
    {
      'id': 'medication',
      'label': 'Take any medications?',
      'type': 'yesno',
    },
  ];

  void _nextQuestion() {
    if (_currentStep < _questions.length - 1) {
      setState(() => _currentStep++);
    } else {
      // Move to camera screen
      Get.to(() => CameraScreen(answers: _answers));
    }
  }

  void _previousQuestion() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    }
  }

  @override
  Widget build(BuildContext context) {
    final question = _questions[_currentStep];
    final progress = (_currentStep + 1) / _questions.length;

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
                      onTap: _previousQuestion,
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
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF3CD),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        'Step ${_currentStep + 1}/${_questions.length}',
                        style: const TextStyle(
                          color: Color(0xFF92400E),
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                // Progress bar
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 4,
                    backgroundColor: AppTheme.border,
                    valueColor: AlwaysStoppedAnimation(AppTheme.primary),
                  ),
                ),
                const SizedBox(height: 40),
                // Question
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        question['label'],
                        style: Theme.of(context).textTheme.headlineMedium,
                      ),
                      const SizedBox(height: 32),
                      // Options
                      if (question['type'] == 'select')
                        Expanded(
                          child: ListView(
                            children: List.generate(
                              question['options'].length,
                              (index) {
                                final option = question['options'][index];
                                final isSelected = _answers[question['id']] == option;
                                return GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _answers[question['id']] = option;
                                    });
                                  },
                                  child: Container(
                                    margin: const EdgeInsets.only(bottom: 12),
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: isSelected ? const Color(0xFFE0E7FF) : Colors.white,
                                      border: Border.all(
                                        color: isSelected ? AppTheme.primary : AppTheme.border,
                                        width: isSelected ? 2 : 1,
                                      ),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      option,
                                      style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w500,
                                        color: isSelected ? AppTheme.primary : AppTheme.textPrimary,
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        )
                      else if (question['type'] == 'checkbox')
                        Expanded(
                          child: ListView(
                            children: List.generate(
                              question['options'].length,
                              (index) {
                                final option = question['options'][index];
                                final selected = (_answers[question['id']] as List<String>?)?.contains(option) ?? false;
                                return GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      final current = (_answers[question['id']] as List<String>?) ?? [];
                                      if (selected) {
                                        current.remove(option);
                                      } else {
                                        current.add(option);
                                      }
                                      _answers[question['id']] = current;
                                    });
                                  },
                                  child: Container(
                                    margin: const EdgeInsets.only(bottom: 12),
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: selected ? const Color(0xFFE0E7FF) : Colors.white,
                                      border: Border.all(
                                        color: selected ? AppTheme.primary : AppTheme.border,
                                        width: selected ? 2 : 1,
                                      ),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Row(
                                      children: [
                                        Checkbox(
                                          value: selected,
                                          onChanged: (_) {},
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          option,
                                          style: TextStyle(
                                            fontSize: 15,
                                            fontWeight: FontWeight.w500,
                                            color: selected ? AppTheme.primary : AppTheme.textPrimary,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        )
                      else if (question['type'] == 'yesno')
                        Row(
                          children: ['Yes', 'No'].map((option) {
                            final isSelected = _answers[question['id']] == option;
                            return Expanded(
                              child: GestureDetector(
                                onTap: () {
                                  setState(() {
                                    _answers[question['id']] = option;
                                  });
                                },
                                child: Container(
                                  margin: const EdgeInsets.symmetric(horizontal: 6),
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  decoration: BoxDecoration(
                                    color: isSelected ? const Color(0xFFE0E7FF) : Colors.white,
                                    border: Border.all(
                                      color: isSelected ? AppTheme.primary : AppTheme.border,
                                      width: isSelected ? 2 : 1,
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    option,
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w600,
                                      color: isSelected ? AppTheme.primary : AppTheme.textPrimary,
                                    ),
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                // Next Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _nextQuestion,
                    child: Text(
                      _currentStep == _questions.length - 1 ? 'Proceed to Scan →' : 'Next →',
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
