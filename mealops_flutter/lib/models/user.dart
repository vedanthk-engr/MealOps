class User {
  final String regNo;
  final String name;
  final String hostelBlock;
  final String roomNo;
  final String messType;
  final String branch;
  final String gender;

  const User({
    required this.regNo,
    required this.name,
    required this.hostelBlock,
    required this.roomNo,
    required this.messType,
    required this.branch,
    required this.gender,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        regNo: json['regNo'] as String? ?? '',
        name: json['name'] as String? ?? '',
        hostelBlock: json['hostelBlock'] as String? ?? '',
        roomNo: json['roomNo'] as String? ?? '',
        messType: json['messType'] as String? ?? 'veg',
        branch: json['branch'] as String? ?? '',
        gender: json['gender'] as String? ?? '',
      );

  String get initials {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : 'U';
  }

  bool get isVeg => messType.toLowerCase() == 'veg';
}
