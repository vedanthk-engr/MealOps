class WeeklyData {
  final String day;
  final int calories;
  final int goal;

  const WeeklyData({
    required this.day,
    required this.calories,
    required this.goal,
  });

  double get ratio => goal > 0 ? (calories / goal).clamp(0.0, 1.0) : 0;

  factory WeeklyData.fromJson(Map<String, dynamic> json) => WeeklyData(
        day: json['day'] as String? ?? '',
        calories: (json['calories'] as num?)?.toInt() ?? 0,
        goal: (json['goal'] as num?)?.toInt() ?? 2100,
      );
}

class NutritionSummary {
  final int consumedCalories;
  final int dailyGoal;
  final double protein;
  final double proteinGoal;
  final double carbs;
  final double carbsGoal;
  final double fat;
  final double fatGoal;
  final int streak;
  final List<WeeklyData> weeklyData;

  const NutritionSummary({
    required this.consumedCalories,
    required this.dailyGoal,
    required this.protein,
    required this.proteinGoal,
    required this.carbs,
    required this.carbsGoal,
    required this.fat,
    required this.fatGoal,
    required this.streak,
    required this.weeklyData,
  });

  int get remainingCalories => (dailyGoal - consumedCalories).clamp(0, dailyGoal);
  double get calorieProgress => dailyGoal > 0
      ? (consumedCalories / dailyGoal).clamp(0.0, 1.0)
      : 0.0;

  factory NutritionSummary.fromJson(Map<String, dynamic> json) =>
      NutritionSummary(
        consumedCalories: (json['consumedCalories'] as num?)?.toInt() ?? 0,
        dailyGoal: (json['dailyGoal'] as num?)?.toInt() ?? 2100,
        protein: (json['protein'] as num?)?.toDouble() ?? 0,
        proteinGoal: (json['proteinGoal'] as num?)?.toDouble() ?? 100,
        carbs: (json['carbs'] as num?)?.toDouble() ?? 0,
        carbsGoal: (json['carbsGoal'] as num?)?.toDouble() ?? 250,
        fat: (json['fat'] as num?)?.toDouble() ?? 0,
        fatGoal: (json['fatGoal'] as num?)?.toDouble() ?? 65,
        streak: (json['streak'] as num?)?.toInt() ?? 0,
        weeklyData: (json['weeklyData'] as List? ?? [])
            .map((e) => WeeklyData.fromJson(e as Map<String, dynamic>))
            .toList(),
      );

  /// Fallback demo data when API returns nothing
  static NutritionSummary demo() => NutritionSummary(
        consumedCalories: 860,
        dailyGoal: 2100,
        protein: 84,
        proteinGoal: 100,
        carbs: 142,
        carbsGoal: 250,
        fat: 38,
        fatGoal: 65,
        streak: 12,
        weeklyData: [
          WeeklyData(day: 'MON', calories: 1260, goal: 2100),
          WeeklyData(day: 'TUE', calories: 1785, goal: 2100),
          WeeklyData(day: 'WED', calories: 1995, goal: 2100),
          WeeklyData(day: 'THU', calories: 840, goal: 2100),
          WeeklyData(day: 'FRI', calories: 1470, goal: 2100),
          WeeklyData(day: 'SAT', calories: 1155, goal: 2100),
          WeeklyData(day: 'SUN', calories: 630, goal: 2100),
        ],
      );
}
