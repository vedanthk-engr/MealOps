class Ingredient {
  final String name;
  final double percentage;
  final String? imageUrl;
  final double? weight;
  final List<String> macros;

  const Ingredient({
    required this.name,
    required this.percentage,
    this.imageUrl,
    this.weight,
    this.macros = const [],
  });

  factory Ingredient.fromJson(Map<String, dynamic> json) => Ingredient(
        name: json['name'] as String? ?? '',
        percentage: (json['percentage'] as num?)?.toDouble() ?? 0,
        imageUrl: json['imageUrl'] as String?,
        weight: (json['weight'] as num?)?.toDouble(),
        macros: List<String>.from(json['macros'] as List? ?? []),
      );
}

class Dish {
  final String id;
  final String name;
  final String? imageUrl;
  final int calories;
  final double protein;
  final double carbs;
  final double fat;
  final double? fiber;
  final bool isVeg;
  final String? description;
  final int? prepTime;
  final List<Ingredient> ingredients;

  const Dish({
    required this.id,
    required this.name,
    this.imageUrl,
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.fat,
    this.fiber,
    this.isVeg = true,
    this.description,
    this.prepTime,
    this.ingredients = const [],
  });

  factory Dish.fromJson(Map<String, dynamic> json) => Dish(
        id: json['id']?.toString() ?? json['_id']?.toString() ?? '',
        name: json['name'] as String? ?? '',
        imageUrl: json['imageUrl'] as String?,
        calories: (json['calories'] as num?)?.toInt() ?? 0,
        protein: (json['protein'] as num?)?.toDouble() ?? 0,
        carbs: (json['carbs'] as num?)?.toDouble() ?? 0,
        fat: (json['fat'] as num?)?.toDouble() ?? 0,
        fiber: (json['fiber'] as num?)?.toDouble(),
        isVeg: json['isVeg'] as bool? ?? true,
        description: json['description'] as String?,
        prepTime: (json['prepTime'] as num?)?.toInt(),
        ingredients: (json['ingredients'] as List? ?? [])
            .map((e) => Ingredient.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
}

class DayMenu {
  final List<Dish> breakfast;
  final List<Dish> lunch;
  final List<Dish> dinner;

  const DayMenu({
    required this.breakfast,
    required this.lunch,
    required this.dinner,
  });

  factory DayMenu.fromJson(Map<String, dynamic> json) => DayMenu(
        breakfast: (json['breakfast'] as List? ?? [])
            .map((e) => Dish.fromJson(e as Map<String, dynamic>))
            .toList(),
        lunch: (json['lunch'] as List? ?? [])
            .map((e) => Dish.fromJson(e as Map<String, dynamic>))
            .toList(),
        dinner: (json['dinner'] as List? ?? [])
            .map((e) => Dish.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
}
