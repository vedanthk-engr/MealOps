import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../core/theme.dart';
import '../models/dish.dart';
import '../models/nutrition_summary.dart';
import '../providers/auth_provider.dart';
import '../providers/menu_provider.dart';
import '../providers/nutrition_provider.dart';
import '../widgets/app_bar.dart';
import '../widgets/shimmer_card.dart';
import 'nutrition_detail_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen>
    with SingleTickerProviderStateMixin {
  late TabController _menuTabCtrl;
  int _waterGlasses = 6;

  @override
  void initState() {
    super.initState();
    _menuTabCtrl = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _menuTabCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);
    final user = authState.value;
    final menuAsync = ref.watch(todayMenuProvider);
    final today = DateFormat('EEEE, d MMMM yyyy').format(DateTime.now());

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: SmartMessAppBar(initials: user?.initials ?? 'SM'),
      body: RefreshIndicator(
        color: AppColors.primary,
        backgroundColor: AppColors.surfaceContainerLowest,
        onRefresh: () async {
          ref.invalidate(todayMenuProvider);
          await Future.delayed(const Duration(milliseconds: 800));
        },
        child: CustomScrollView(
          slivers: [
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  const SizedBox(height: 24),
                  // Greeting
                  _GreetingSection(
                    name: user?.name.split(' ').first ?? 'Student',
                    date: today,
                    messType: user?.messType ?? 'Veg',
                  ),
                  const SizedBox(height: 24),
                  const SizedBox(height: 24),
                  // Nutrition ring + micro grid
                  ref.watch(nutritionSummaryProvider).when(
                    loading: () => const ShimmerHero(),
                    error: (_, __) => _NutritionHero(summary: NutritionSummary.demo()),
                    data: (summary) => _NutritionHero(summary: summary),
                  ),
                  const SizedBox(height: 28),
                  // Today's menu
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("Today's Menu",
                          style: Theme.of(context).textTheme.titleLarge),
                      TextButton(
                        onPressed: () => context.go('/preorder'),
                        child: Row(
                          children: [
                            Text('Full Week',
                                style: GoogleFonts.inter(
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 13)),
                            const Icon(Icons.chevron_right_rounded,
                                color: AppColors.primary, size: 18),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Tab bar
                  _MenuTabBar(controller: _menuTabCtrl),
                  const SizedBox(height: 16),
                  // Dish list
                  menuAsync.when(
                    loading: () => Column(
                      children: List.generate(
                          3, (_) => const Padding(
                                padding: EdgeInsets.only(bottom: 12),
                                child: ShimmerDishCard(),
                              )),
                    ),
                    error: (e, _) => _EmptyState(message: 'Menu unavailable'),
                    data: (menu) => _DishTabView(
                      controller: _menuTabCtrl,
                      menu: menu,
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Hydration card
                  _HydrationCard(
                    glassesLeft: _waterGlasses,
                    onAdd: () => setState(() {
                      if (_waterGlasses > 0) _waterGlasses--;
                    }),
                  ),
                  const SizedBox(height: 100),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GreetingSection extends StatelessWidget {
  final String name;
  final String date;
  final String messType;
  const _GreetingSection(
      {required this.name, required this.date, required this.messType});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text('Hello, $name',
                style: GoogleFonts.manrope(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppColors.onBackground,
                  letterSpacing: -0.5,
                )),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.primaryContainer.withOpacity(0.6),
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                messType.toUpperCase(),
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                  color: AppColors.onPrimaryContainer,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(date,
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: AppColors.onSurfaceVariant,
            )),
      ],
    );
  }
}

class _NutritionHero extends StatelessWidget {
  final NutritionSummary summary;
  const _NutritionHero({required this.summary});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Calorie ring
        Expanded(
          flex: 5,
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLowest,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: AppColors.onBackground.withOpacity(0.06),
                  blurRadius: 40,
                  offset: const Offset(0, 20),
                ),
              ],
            ),
            child: Column(
              children: [
                SizedBox(
                  width: 140,
                  height: 140,
                  child: CustomPaint(
                    painter: _NutritionRingPainter(
                      calorieProgress: summary.calorieProgress,
                      proteinProgress: (summary.protein / summary.proteinGoal).clamp(0.0, 1.0),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(NumberFormat('#,###').format(summary.remainingCalories),
                              style: GoogleFonts.manrope(
                                fontSize: 26,
                                fontWeight: FontWeight.w800,
                                color: AppColors.onBackground,
                              )),
                          Text('kcal left',
                              style: GoogleFonts.inter(
                                fontSize: 9,
                                fontWeight: FontWeight.w700,
                                color: AppColors.onSurfaceVariant,
                                letterSpacing: 0.8,
                              )),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _RingLegend(color: AppColors.primary, label: 'Energy'),
                    SizedBox(width: 16),
                    _RingLegend(color: AppColors.secondary, label: 'Protein'),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 12),
        // Macro micro grid
        Expanded(
          flex: 5,
          child: _MacroMicroGrid(summary: summary),
        ),
      ],
    );
  }
}

class _RingLegend extends StatelessWidget {
  final Color color;
  final String label;
  const _RingLegend({required this.color, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(label,
            style: GoogleFonts.inter(
              fontSize: 9,
              fontWeight: FontWeight.w700,
              color: AppColors.onSurfaceVariant,
            )),
      ],
    );
  }
}

class _NutritionRingPainter extends CustomPainter {
  final double calorieProgress;
  final double proteinProgress;

  _NutritionRingPainter({
    required this.calorieProgress,
    required this.proteinProgress,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final outerR = size.width / 2 - 8;
    final innerR = outerR - 20;

    final trackPaint = Paint()
      ..color = AppColors.surfaceContainerHighest
      ..style = PaintingStyle.stroke
      ..strokeWidth = 12
      ..strokeCap = StrokeCap.round;

    final outerGradient = SweepGradient(
      startAngle: -3.14159 / 2,
      endAngle: -3.14159 / 2 + 3.14159 * 2,
      colors: const [AppColors.primary, Color(0xFF91F78E)],
    ).createShader(Rect.fromCircle(center: center, radius: outerR));

    final outerPaint = Paint()
      ..shader = outerGradient
      ..style = PaintingStyle.stroke
      ..strokeWidth = 12
      ..strokeCap = StrokeCap.round;

    final innerPaint = Paint()
      ..color = AppColors.secondary
      ..style = PaintingStyle.stroke
      ..strokeWidth = 8
      ..strokeCap = StrokeCap.round;

    const startAngle = -3.14159 / 2;

    // Tracks
    canvas.drawCircle(center, outerR, trackPaint);
    canvas.drawCircle(center, innerR, trackPaint..color = AppColors.surfaceContainerHighest);

    // Calorie arc
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: outerR),
      startAngle,
      3.14159 * 2 * calorieProgress,
      false,
      outerPaint,
    );

    // Protein arc
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: innerR),
      startAngle,
      3.14159 * 2 * proteinProgress,
      false,
      innerPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _NutritionRingPainter oldDelegate) =>
      oldDelegate.calorieProgress != calorieProgress ||
      oldDelegate.proteinProgress != proteinProgress;
}

class _MacroMicroGrid extends StatelessWidget {
  final NutritionSummary summary;
  const _MacroMicroGrid({required this.summary});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(child: _MacroCell(icon: Icons.egg_outlined, color: AppColors.primary, value: '${summary.protein.toStringAsFixed(0)}g', label: 'Protein')),
            const SizedBox(width: 10),
            Expanded(child: _MacroCell(icon: Icons.grain_rounded, color: AppColors.secondary, value: '${summary.carbs.toStringAsFixed(0)}g', label: 'Carbs')),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(child: _MacroCell(icon: Icons.water_drop_rounded, color: AppColors.tertiary, value: '${summary.fat.toStringAsFixed(0)}g', label: 'Fats')),
            const SizedBox(width: 10),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.primaryContainer.withOpacity(0.25),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primary.withOpacity(0.1)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.bolt_rounded, color: AppColors.primary, size: 22),
                    const SizedBox(height: 4),
                    Text('${(summary.calorieProgress * 100).toStringAsFixed(0)}%', style: GoogleFonts.manrope(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.onBackground)),
                    Text('DAILY GOAL', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.onSurfaceVariant, letterSpacing: 0.5)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _MacroCell extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String value;
  final String label;
  const _MacroCell({required this.icon, required this.color, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 4),
          Text(value, style: GoogleFonts.manrope(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.onBackground)),
          Text(label.toUpperCase(), style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.onSurfaceVariant, letterSpacing: 0.5)),
        ],
      ),
    );
  }
}

class _MenuTabBar extends StatelessWidget {
  final TabController controller;
  const _MenuTabBar({required this.controller});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(6),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(999),
      ),
      child: TabBar(
        controller: controller,
        indicator: BoxDecoration(
          color: AppColors.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(999),
          boxShadow: [
            BoxShadow(
              color: AppColors.onBackground.withOpacity(0.04),
              blurRadius: 8,
            ),
          ],
        ),
        indicatorSize: TabBarIndicatorSize.tab,
        dividerColor: Colors.transparent,
        labelColor: AppColors.primary,
        unselectedLabelColor: AppColors.onSurfaceVariant,
        labelStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700),
        tabs: const [
          Tab(text: 'Breakfast'),
          Tab(text: 'Lunch'),
          Tab(text: 'Dinner'),
        ],
      ),
    );
  }
}

class _DishTabView extends StatelessWidget {
  final TabController controller;
  final DayMenu menu;
  const _DishTabView({required this.controller, required this.menu});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (ctx, _) {
        final dishes = controller.index == 0
            ? menu.breakfast
            : controller.index == 1
                ? menu.lunch
                : menu.dinner;

        if (dishes.isEmpty) {
          return _EmptyState(message: 'No dishes for this meal');
        }

        return Column(
          children: dishes
              .map((d) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _DishCard(dish: d),
                  ))
              .toList(),
        );
      },
    );
  }
}

class _DishCard extends StatelessWidget {
  final Dish dish;
  const _DishCard({required this.dish});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/nutrition-detail', extra: {
        'name': dish.name,
        'calories': dish.calories,
        'protein': dish.protein,
        'carbs': dish.carbs,
        'fat': dish.fat,
        'imageUrl': dish.imageUrl,
        'ingredients': dish.ingredients,
      }),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLow,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Row(
          children: [
            // Circular image
            ClipOval(
              child: Container(
                width: 80,
                height: 80,
                color: AppColors.surfaceContainerHighest,
                child: dish.imageUrl != null
                    ? (dish.imageUrl!.startsWith('assets/')
                        ? Image.asset(dish.imageUrl!, fit: BoxFit.cover)
                        : Image.network(dish.imageUrl!,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) =>
                                _DishIconPlaceholder()))
                    : _DishIconPlaceholder(),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(dish.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.manrope(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: AppColors.onBackground,
                            )),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceContainerHigh,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.timer_outlined, size: 11, color: AppColors.onSurfaceVariant),
                            const SizedBox(width: 3),
                            Text('${dish.prepTime ?? 15}m',
                                style: GoogleFonts.inter(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.onSurfaceVariant,
                                )),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  if (dish.description != null)
                    Text(dish.description!,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: AppColors.onSurfaceVariant,
                        )),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _MacroChip(
                          icon: Icons.restaurant_rounded,
                          color: AppColors.primary,
                          value: '${dish.calories} Kcal'),
                      const SizedBox(width: 12),
                      _MacroChip(
                          icon: Icons.fitness_center_rounded,
                          color: AppColors.secondary,
                          value: '${dish.protein}g Protein'),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DishIconPlaceholder extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.primaryContainer.withOpacity(0.3),
      child: const Icon(Icons.restaurant_rounded,
          color: AppColors.primary, size: 32),
    );
  }
}

class _MacroChip extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String value;
  const _MacroChip({required this.icon, required this.color, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 4),
        Text(value,
            style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: AppColors.onBackground)),
      ],
    );
  }
}

class _HydrationCard extends StatelessWidget {
  final int glassesLeft;
  final VoidCallback onAdd;
  const _HydrationCard({required this.glassesLeft, required this.onAdd});

  @override
  Widget build(BuildContext context) {
    const target = 14; // 14 glasses = 3.5L
    final filled = target - glassesLeft;
    final progress = filled / target;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.primaryContainer.withOpacity(0.6),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Stay Hydrated',
                      style: GoogleFonts.manrope(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: AppColors.onPrimaryContainer)),
                  Text('Target: 3.5 Liters',
                      style: GoogleFonts.inter(
                          fontSize: 12,
                          color: AppColors.onPrimaryContainer.withOpacity(0.7))),
                ],
              ),
              Text('${(filled * 0.25).toStringAsFixed(1)}L',
                  style: GoogleFonts.manrope(
                      fontSize: 30,
                      fontWeight: FontWeight.w800,
                      color: AppColors.onPrimaryContainer)),
            ],
          ),
          const SizedBox(height: 14),
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 10,
              backgroundColor: AppColors.onPrimaryContainer.withOpacity(0.15),
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('$glassesLeft glasses to go',
                  style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.onPrimaryContainer,
                      letterSpacing: 0.5)),
              GestureDetector(
                onTap: onAdd,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text('+ Add 250ml',
                      style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final String message;
  const _EmptyState({required this.message});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            const Icon(Icons.restaurant_menu_rounded,
                size: 48, color: AppColors.outlineVariant),
            const SizedBox(height: 12),
            Text(message,
                style: GoogleFonts.inter(
                    color: AppColors.onSurfaceVariant,
                    fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}
