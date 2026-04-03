import 'dart:io';
import 'package:dio/dio.dart';
import 'api_client.dart';

class ScanResult {
  final String foodName;
  final double confidence;
  final int calories;
  final double protein;
  final double carbs;
  final double fat;
  final double weightEstimate;
  final List<Map<String, dynamic>> ingredients;

  const ScanResult({
    required this.foodName,
    required this.confidence,
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.fat,
    required this.weightEstimate,
    required this.ingredients,
  });

  factory ScanResult.fromJson(Map<String, dynamic> json) {
    final nutrition = json['nutrition'] as Map<String, dynamic>? ?? {};
    return ScanResult(
      foodName: json['foodName'] as String? ?? 'Unknown Food',
      confidence: (json['confidence'] as num?)?.toDouble() ?? 0.0,
      calories: (nutrition['calories'] as num?)?.toInt() ?? 0,
      protein: (nutrition['protein'] as num?)?.toDouble() ?? 0,
      carbs: (nutrition['carbs'] as num?)?.toDouble() ?? 0,
      fat: (nutrition['fat'] as num?)?.toDouble() ?? 0,
      weightEstimate: (json['weightEstimate'] as num?)?.toDouble() ?? 100,
      ingredients:
          List<Map<String, dynamic>>.from(json['ingredients'] as List? ?? []),
    );
  }

  /// Demo fallback
  static ScanResult demo() => ScanResult(
        foodName: 'Grilled Salmon Bowl',
        confidence: 0.92,
        calories: 540,
        protein: 32,
        carbs: 45,
        fat: 14,
        weightEstimate: 340,
        ingredients: [
          {'name': 'Salmon', 'percentage': 40},
          {'name': 'Quinoa', 'percentage': 25},
          {'name': 'Greens', 'percentage': 20},
          {'name': 'Lemon', 'percentage': 15},
        ],
      );
}

class ScanService {
  static final Dio _dio = ApiClient.createDio();

  static Future<ScanResult> identify(File imageFile) async {
    final formData = FormData.fromMap({
      'image': await MultipartFile.fromFile(
        imageFile.path,
        filename: 'scan.jpg',
      ),
    });
    final response = await _dio.post(
      '/api/scan/identify',
      data: formData,
      options: Options(contentType: 'multipart/form-data'),
    );
    return ScanResult.fromJson(response.data as Map<String, dynamic>);
  }
}
