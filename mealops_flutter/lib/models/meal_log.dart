enum MealStatus { ate, ateHalf, skipped }

class MealLogEntry {
  final String dishId;
  final String dishName;
  final MealStatus status;
  final String? emoji;
  final String? comment;

  const MealLogEntry({
    required this.dishId,
    required this.dishName,
    required this.status,
    this.emoji,
    this.comment,
  });

  Map<String, dynamic> toJson() => {
        'dishId': dishId,
        'status': status.name,
        'emoji': emoji,
        'comment': comment,
      };
}

class MealLog {
  final String date;
  final String mealType;
  final List<MealLogEntry> logs;

  const MealLog({
    required this.date,
    required this.mealType,
    required this.logs,
  });

  Map<String, dynamic> toJson() => {
        'date': date,
        'mealType': mealType,
        'logs': logs.map((e) => e.toJson()).toList(),
      };
}

class MealHistoryItem {
  final String name;
  final String? imageUrl;
  final int calories;
  final double protein;
  final double carbs;
  final String mealType;
  final String location;
  final DateTime time;

  const MealHistoryItem({
    required this.name,
    this.imageUrl,
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.mealType,
    required this.location,
    required this.time,
  });

  factory MealHistoryItem.fromJson(Map<String, dynamic> json) =>
      MealHistoryItem(
        name: json['name'] as String? ?? '',
        imageUrl: json['imageUrl'] as String?,
        calories: (json['calories'] as num?)?.toInt() ?? 0,
        protein: (json['protein'] as num?)?.toDouble() ?? 0,
        carbs: (json['carbs'] as num?)?.toDouble() ?? 0,
        mealType: json['mealType'] as String? ?? '',
        location: json['location'] as String? ?? 'Hostel Mess',
        time: DateTime.tryParse(json['time'] as String? ?? '') ?? DateTime.now(),
      );
}
