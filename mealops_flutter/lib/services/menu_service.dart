import 'package:dio/dio.dart';
import 'api_client.dart';
import '../models/dish.dart';

class MenuService {
  static final Dio _dio = ApiClient.createDio();

  static Future<DayMenu> getTodayMenu() async {
    final response = await _dio.get('/api/menu/today');
    return DayMenu.fromJson(response.data as Map<String, dynamic>);
  }

  static Future<List<DayMenu>> getWeekMenu() async {
    final response = await _dio.get('/api/menu/week');
    final list = response.data as List;
    return list.map((e) => DayMenu.fromJson(e as Map<String, dynamic>)).toList();
  }

  static Future<DayMenu> getTomorrowMenu() async {
    final response = await _dio.get('/api/preorders/tomorrow');
    return DayMenu.fromJson(response.data as Map<String, dynamic>);
  }
}
