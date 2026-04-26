class UserModel {
  final String uid;
  final String firstName;
  final String email;
  final String? age;
  final bool? hasConditions;
  final DateTime createdAt;

  UserModel({
    required this.uid,
    required this.firstName,
    required this.email,
    this.age,
    this.hasConditions,
    required this.createdAt,
  });

  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      uid: map['uid'] ?? '',
      firstName: map['firstName'] ?? 'User',
      email: map['email'] ?? '',
      age: map['age'],
      hasConditions: map['hasConditions'],
      createdAt: map['createdAt']?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'firstName': firstName,
      'email': email,
      'age': age,
      'hasConditions': hasConditions,
      'createdAt': createdAt,
    };
  }
}
