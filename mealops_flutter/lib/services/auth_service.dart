import 'package:dio/dio.dart';
import 'api_client.dart';
import '../models/user.dart';

class AuthService {
  static final Dio _dio = ApiClient.createDio();

  static Future<({String token, User user})> vtopLogin({
    required String regNo,
    required String password,
  }) async {
    final response = await _dio.post('/api/auth/vtop-login', data: {
      'regNo': regNo,
      'password': password,
    });

    final data = response.data as Map<String, dynamic>;
    final token = data['token'] as String;
    final user = User.fromJson(data['user'] as Map<String, dynamic>);

    await ApiClient.saveToken(token);
    return (token: token, user: user);
  }
}
