import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/dish.dart';
import '../services/menu_service.dart';

final todayMenuProvider = FutureProvider<DayMenu>((ref) async {
  return MenuService.getTodayMenu();
});

final tomorrowMenuProvider = FutureProvider<DayMenu>((ref) async {
  return MenuService.getTomorrowMenu();
});
