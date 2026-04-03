import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';
import '../models/dish.dart';

class NutritionDetailScreen extends StatelessWidget {
  final Map<String, dynamic> data;

  const NutritionDetailScreen({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final name = data['name'] as String? ?? 'Food Item';
    final calories = data['calories'] as int? ?? 0;
    final protein = (data['protein'] as num?)?.toDouble() ?? 0;
    final carbs = (data['carbs'] as num?)?.toDouble() ?? 0;
    final fat = (data['fat'] as num?)?.toDouble() ?? 0;
    final fiber = (data['fiber'] as num?)?.toDouble() ?? 8;
    final imageUrl = data['imageUrl'] as String?;
    final List<Ingredient> ingredients = data['ingredients'] is List
        ? (data['ingredients'] as List)
            .map((e) => e is Ingredient
                ? e
                : Ingredient.fromJson(e as Map<String, dynamic>))
            .toList()
        : _demoIngredients();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background.withOpacity(0.9),
        leading: BackButton(color: AppColors.onBackground),
        title: Text('Nutrition Detail',
            style: GoogleFonts.manrope(
                fontWeight: FontWeight.w800, color: AppColors.onBackground)),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 24),
            // Petal chart
            Center(
              child: _PetalChart(
                imageUrl: imageUrl,
                ingredients: ingredients,
              ),
            ),
            const SizedBox(height: 24),
            // Food identity
            Center(
              child: Column(
                children: [
                  Text(name,
                      style: GoogleFonts.manrope(
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                          color: AppColors.onBackground,
                          letterSpacing: -0.5)),
                  const SizedBox(height: 4),
                  Text('$calories kcal',
                      style: GoogleFonts.inter(
                          fontSize: 14,
                          color: AppColors.onSurfaceVariant,
                          fontWeight: FontWeight.w500)),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Macro grid
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  _MacroQuickCell(label: 'Protein', value: '${protein.toStringAsFixed(0)}g', color: AppColors.primary),
                  _MacroQuickCell(label: 'Carbs', value: '${carbs.toStringAsFixed(0)}g', color: AppColors.secondary),
                  _MacroQuickCell(label: 'Fats', value: '${fat.toStringAsFixed(0)}g', color: AppColors.tertiary),
                  _MacroQuickCell(label: 'Fiber', value: '${fiber.toStringAsFixed(0)}g', color: const Color(0xFF00671A)),
                ],
              ),
            ),
            const SizedBox(height: 28),
            // Ingredients section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Main Ingredients',
                      style: GoogleFonts.manrope(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: AppColors.onBackground)),
                  Text('${ingredients.length} Total',
                      style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary)),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                children: ingredients
                    .map((i) => Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: _IngredientRow(ingredient: i),
                        ))
                    .toList(),
              ),
            ),
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('Log Meal to History'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: const StadiumBorder(),
                    textStyle: GoogleFonts.manrope(
                        fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  List<Ingredient> _demoIngredients() => [
        Ingredient(name: 'Organic Quinoa', percentage: 35, weight: 150),
        Ingredient(name: 'Fresh Avocado', percentage: 20, weight: 80),
        Ingredient(name: 'Curly Kale', percentage: 15, weight: 60),
        Ingredient(name: 'Chickpeas', percentage: 15, weight: 60),
        Ingredient(name: 'Cherry Tomatoes', percentage: 10, weight: 40),
        Ingredient(name: 'Lemon Dressing', percentage: 5, weight: 20),
      ];
}

class _PetalChart extends StatelessWidget {
  final String? imageUrl;
  final List<Ingredient> ingredients;

  const _PetalChart({required this.imageUrl, required this.ingredients});

  @override
  Widget build(BuildContext context) {
    const size = 280.0;
    final petals = ingredients.take(6).toList();

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Petal layer
          CustomPaint(
            size: const Size(size, size),
            painter: _PetalPainter(
              petalCount: petals.length,
              percentages: petals.map((p) => p.percentage / 100).toList(),
            ),
          ),
          // Center food image
          Container(
            width: 130,
            height: 130,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.surface, width: 8),
              boxShadow: [
                BoxShadow(
                    color: AppColors.onBackground.withOpacity(0.12),
                    blurRadius: 20)
              ],
            ),
            child: ClipOval(
              child: imageUrl != null
                  ? (imageUrl!.startsWith('assets/')
                      ? Image.asset(imageUrl!, fit: BoxFit.cover)
                      : Image.network(imageUrl!,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => _FoodIconPlaceholder()))
                  : _FoodIconPlaceholder(),
            ),
          ),
        ],
      ),
    );
  }
}

class _FoodIconPlaceholder extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.primaryContainer.withOpacity(0.4),
      child: const Icon(Icons.restaurant_rounded,
          color: AppColors.primary, size: 48),
    );
  }
}

class _PetalPainter extends CustomPainter {
  final int petalCount;
  final List<double> percentages;

  _PetalPainter({required this.petalCount, required this.percentages});

  @override
  void paint(Canvas canvas, Size size) {
    if (petalCount == 0) return;
    final center = Offset(size.width / 2, size.height / 2);
    final baseRadius = size.width / 2 - 10;
    final centerRadius = 65.0;
    final angleStep = (2 * pi) / petalCount;

    for (int i = 0; i < petalCount; i++) {
      final angle = -pi / 2 + i * angleStep;
      final petalLength = (baseRadius - centerRadius) * (percentages[i].clamp(0.1, 1.0));
      final petalRadius = 28.0;

      // Build petal path using bezier curves
      final tipX = center.dx + (centerRadius + petalLength) * cos(angle);
      final tipY = center.dy + (centerRadius + petalLength) * sin(angle);

      final leftAngle = angle - pi / 2;
      final rightAngle = angle + pi / 2;

      final baseLeft = Offset(
        center.dx + centerRadius * cos(angle) + petalRadius * cos(leftAngle),
        center.dy + centerRadius * sin(angle) + petalRadius * sin(leftAngle),
      );
      final baseRight = Offset(
        center.dx + centerRadius * cos(angle) + petalRadius * cos(rightAngle),
        center.dy + centerRadius * sin(angle) + petalRadius * sin(rightAngle),
      );

      final ctrlLen = petalLength * 0.6;
      final ctrl1 = Offset(
        baseLeft.dx + ctrlLen * cos(angle),
        baseLeft.dy + ctrlLen * sin(angle),
      );
      final ctrl2 = Offset(
        baseRight.dx + ctrlLen * cos(angle),
        baseRight.dy + ctrlLen * sin(angle),
      );

      final path = Path()
        ..moveTo(baseLeft.dx, baseLeft.dy)
        ..cubicTo(ctrl1.dx, ctrl1.dy, tipX - 2, tipY - 2, tipX, tipY)
        ..cubicTo(tipX + 2, tipY + 2, ctrl2.dx, ctrl2.dy, baseRight.dx, baseRight.dy)
        ..close();

      // Gradient fill
      final opacityVal = 0.5 + 0.4 * (percentages[i].clamp(0.1, 1.0));
      final paint = Paint()
        ..shader = RadialGradient(
          center: Alignment.center,
          colors: [
            AppColors.primaryContainer.withOpacity(opacityVal),
            AppColors.primary.withOpacity(opacityVal * 0.7),
          ],
        ).createShader(Rect.fromCenter(
            center: center, width: size.width, height: size.height))
        ..style = PaintingStyle.fill;

      canvas.drawPath(path, paint);
    }
  }

  @override
  bool shouldRepaint(covariant _PetalPainter oldDelegate) => true;
}

class _MacroQuickCell extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  const _MacroQuickCell({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLow,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
                color: AppColors.onBackground.withOpacity(0.03),
                blurRadius: 8)
          ],
        ),
        child: Column(
          children: [
            Text(label.toUpperCase(),
                style: GoogleFonts.inter(
                    fontSize: 8,
                    fontWeight: FontWeight.w700,
                    color: AppColors.onSurfaceVariant,
                    letterSpacing: 0.5)),
            const SizedBox(height: 4),
            Text(value,
                style: GoogleFonts.manrope(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: color)),
          ],
        ),
      ),
    );
  }
}

class _IngredientRow extends StatelessWidget {
  final Ingredient ingredient;
  const _IngredientRow({required this.ingredient});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.outlineVariant.withOpacity(0.15)),
        boxShadow: [
          BoxShadow(
              color: AppColors.onBackground.withOpacity(0.04),
              blurRadius: 12)
        ],
      ),
      child: Row(
        children: [
          // Ingredient image
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              color: AppColors.surfaceContainerHigh,
            ),
            child: ingredient.imageUrl != null
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.network(ingredient.imageUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) =>
                            const Icon(Icons.eco_rounded, color: AppColors.primary)))
                : const Icon(Icons.eco_rounded, color: AppColors.primary),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(ingredient.name,
                          style: GoogleFonts.manrope(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: AppColors.onBackground)),
                    ),
                    Text(
                      ingredient.weight != null
                          ? '${ingredient.weight!.toStringAsFixed(0)}g'
                          : '${ingredient.percentage.toStringAsFixed(0)}%',
                      style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: AppColors.onSurfaceVariant),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    _MacroBadge(icon: Icons.energy_savings_leaf_rounded, label: 'Fiber', color: AppColors.primary),
                    const SizedBox(width: 12),
                    _MacroBadge(icon: Icons.grain_rounded, label: 'Carbs', color: AppColors.secondary),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MacroBadge extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _MacroBadge({required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 13, color: color),
        const SizedBox(width: 3),
        Text(label.toUpperCase(),
            style: GoogleFonts.inter(
                fontSize: 9,
                fontWeight: FontWeight.w700,
                color: AppColors.onSurfaceVariant,
                letterSpacing: 0.3)),
      ],
    );
  }
}
