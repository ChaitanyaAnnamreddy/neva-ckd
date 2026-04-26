class AssessmentResult {
  final String riskLevel; // 'low', 'moderate', 'high'
  final int riskScore; // 0-100
  final List<String> factors;
  final Map<String, dynamic> stripData;
  final Map<String, dynamic> answers;
  final DateTime createdAt;

  AssessmentResult({
    required this.riskLevel,
    required this.riskScore,
    required this.factors,
    required this.stripData,
    required this.answers,
    required this.createdAt,
  });

  factory AssessmentResult.fromMap(Map<String, dynamic> map) {
    return AssessmentResult(
      riskLevel: map['riskLevel'] ?? 'low',
      riskScore: map['riskScore'] ?? 0,
      factors: List<String>.from(map['factors'] ?? []),
      stripData: map['stripData'] ?? {},
      answers: map['answers'] ?? {},
      createdAt: map['createdAt']?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'riskLevel': riskLevel,
      'riskScore': riskScore,
      'factors': factors,
      'stripData': stripData,
      'answers': answers,
      'createdAt': createdAt,
    };
  }
}
