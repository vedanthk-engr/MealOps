import 'package:dio/dio.dart';
import 'api_client.dart';
import '../models/nutrition_summary.dart';

class NutritionService {
  static final Dio _dio = ApiClient.createDio();

  static Future<NutritionSummary> getSummary(String regNo) async {
    final response = await _dio.get(
      '/api/nutrition/summary',
      queryParameters: {'userId': regNo},
    );
    return NutritionSummary.fromJson(response.data as Map<String, dynamic>);
  }
}
