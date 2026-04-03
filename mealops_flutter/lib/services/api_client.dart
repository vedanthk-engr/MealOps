import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiClient {
  static const String _tokenKey = 'jwt_token';
  static final _secureStorage = const FlutterSecureStorage();

  static Dio createDio() {
    final baseUrl = 'http://172.16.45.50:8000';
    final dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {'Content-Type': 'application/json'},
      ),
    );
    dio.interceptors.add(_AuthInterceptor(_secureStorage));
    return dio;
  }

  static Future<void> saveToken(String token) async {
    await _secureStorage.write(key: _tokenKey, value: token);
  }

  static Future<String?> getToken() async {
    return _secureStorage.read(key: _tokenKey);
  }

  static Future<void> clearToken() async {
    await _secureStorage.delete(key: _tokenKey);
  }
}

class _AuthInterceptor extends Interceptor {
  final FlutterSecureStorage _storage;

  _AuthInterceptor(this._storage);

  @override
  void onRequest(
      RequestOptions options, RequestInterceptorHandler handler) async {
    const tokenKey = 'jwt_token';
    final token = await _storage.read(key: tokenKey);
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // Pass through, let individual callers handle
    handler.next(err);
  }
}
