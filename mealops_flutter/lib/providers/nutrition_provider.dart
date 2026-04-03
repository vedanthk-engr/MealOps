import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/nutrition_summary.dart';
import '../services/nutrition_service.dart';
import 'auth_provider.dart';

final nutritionSummaryProvider = FutureProvider<NutritionSummary>((ref) async {
  final authState = ref.watch(authStateProvider);
  final user = authState.value;
  if (user == null) return NutritionSummary.demo();
  try {
    return await NutritionService.getSummary(user.regNo);
  } catch (_) {
    return NutritionSummary.demo();
  }
});
