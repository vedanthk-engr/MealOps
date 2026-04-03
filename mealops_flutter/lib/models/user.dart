class User {
  final String regNo;
  final String name;
  final String hostelBlock;
  final String roomNo;
  final String messType;
  final String branch;
  final String gender;
  final String programme;
  final String school;
  final String email;
  final String messCaterer;
  final String proctorEmail;

  const User({
    required this.regNo,
    required this.name,
    required this.hostelBlock,
    required this.roomNo,
    required this.messType,
    required this.branch,
    required this.gender,
    required this.programme,
    required this.school,
    required this.email,
    required this.messCaterer,
    required this.proctorEmail,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        regNo: json['regNo'] as String? ?? json['reg_no'] as String? ?? '',
        name: json['name'] as String? ?? '',
        hostelBlock: json['hostelBlock'] as String? ?? json['hostel_block'] as String? ?? '',
        roomNo: json['roomNo'] as String? ?? json['room_no'] as String? ?? '',
        messType: json['messType'] as String? ?? json['mess_type'] as String? ?? 'veg',
        branch: json['branch'] as String? ?? '',
        gender: json['gender'] as String? ?? '',
        programme: json['programme'] as String? ?? '',
        school: json['school'] as String? ?? '',
        email: json['email'] as String? ?? '',
        messCaterer: json['messCaterer'] as String? ?? json['mess_caterer'] as String? ?? '',
        proctorEmail: json['proctorEmail'] as String? ?? json['proctor_email'] as String? ?? '',
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
