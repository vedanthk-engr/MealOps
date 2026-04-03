import 'package:dio/dio.dart';
import 'api_client.dart';
import '../models/meal_log.dart';
import '../models/dish.dart';

class MealService {
  static final Dio _dio = ApiClient.createDio();

  static Future<void> logMeal(MealLog log) async {
    await _dio.post('/api/meals/log', data: log.toJson());
  }

  static Future<List<MealHistoryItem>> getHistory() async {
    final response = await _dio.get('/api/meals/history');
    final list = response.data as List? ?? [];
    return list
        .map((e) => MealHistoryItem.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
