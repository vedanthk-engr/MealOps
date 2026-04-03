import 'package:dio/dio.dart';
import 'api_client.dart';
import '../models/user.dart';

class AuthService {
  static final Dio _dio = ApiClient.createDio();

  static Future<Map<String, dynamic>> getVtopCaptcha() async {
    final response = await _dio.get('/api/auth/vtop-captcha');
    return response.data as Map<String, dynamic>;
  }

  static Future<({String token, User user})> vtopLogin({
    required String regNo,
    required String password,
    String? captchaSolution,
    String? jsessionid,
    String? csrfToken,
    Map<String, dynamic>? cookies,
  }) async {
    final response = await _dio.post('/api/auth/vtop-login', data: {
      'regNo': regNo,
      'password': password,
      'captchaSolution': captchaSolution,
      'jsessionid': jsessionid,
      'csrfToken': csrfToken,
      'cookies': cookies,
    });

    final data = response.data as Map<String, dynamic>;
    final token = data['token'] as String;
    final user = User.fromJson(data['student'] as Map<String, dynamic>);

    await ApiClient.saveToken(token);
    return (token: token, user: user);
  }
}
