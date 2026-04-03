import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../core/theme.dart';
import '../models/nutrition_summary.dart';
import '../providers/auth_provider.dart';
import '../widgets/app_bar.dart';

class NutritionDashboardScreen extends ConsumerWidget {
  const NutritionDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final user = authState.value;
    final nutrition = NutritionSummary.demo();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: SmartMessAppBar(initials: user?.initials ?? 'SM'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 24),
            _CalorieRingHero(nutrition: nutrition),
            const SizedBox(height: 20),
            _MacroPillRow(nutrition: nutrition),
            const SizedBox(height: 24),
            _StreakCard(streak: nutrition.streak),
            const SizedBox(height: 24),
            _WeeklyChart(weeklyData: nutrition.weeklyData),
            const SizedBox(height: 28),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Recent Meals',
                    style: GoogleFonts.manrope(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: AppColors.onBackground)),
                TextButton(
                  onPressed: () {},
                  child: Text('See All',
                      style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ..._demoMeals().map((m) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _MealHistoryCard(item: m),
                )),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  static List<_DemoMealItem> _demoMeals() => [
        const _DemoMealItem(name: 'Buddha Bowl', calories: 540, protein: 24, carbs: 62, time: '12:30 PM', mealType: 'Lunch'),
        const _DemoMealItem(name: 'Avocado Toast', calories: 320, protein: 12, carbs: 28, time: '08:15 AM', mealType: 'Breakfast'),
        const _DemoMealItem(name: 'Protein Smoothie', calories: 210, protein: 25, carbs: 15, time: 'Yesterday', mealType: 'Snack'),
      ];
}

class _CalorieRingHero extends StatelessWidget {
  final NutritionSummary nutrition;
  const _CalorieRingHero({required this.nutrition});

  @override
  Widget build(BuildContext context) {
    const ringSize = 280.0;

    return Center(
      child: SizedBox(
        width: ringSize,
        height: ringSize,
        child: CustomPaint(
          painter: _CircularRingPainter(
            progress: nutrition.calorieProgress,
            strokeWidth: 18,
          ),
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('REMAINING',
                    style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: AppColors.onSurfaceVariant,
                        letterSpacing: 0.8)),
                const SizedBox(height: 4),
                Text(
                  NumberFormat('#,###').format(nutrition.remainingCalories),
                  style: GoogleFonts.manrope(
                      fontSize: 48,
                      fontWeight: FontWeight.w800,
                      color: AppColors.onBackground),
                ),
                Text(
                  'kcal of ${NumberFormat('#,###').format(nutrition.dailyGoal)}',
                  style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: AppColors.onSurfaceVariant),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _CircularRingPainter extends CustomPainter {
  final double progress;
  final double strokeWidth;
  _CircularRingPainter({required this.progress, required this.strokeWidth});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - strokeWidth;
    const startAngle = -3.14159 / 2;

    final trackPaint = Paint()
      ..color = AppColors.surfaceContainerHighest
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final arcPaint = Paint()
      ..shader = SweepGradient(
        startAngle: startAngle,
        endAngle: startAngle + 3.14159 * 2,
        colors: const [AppColors.primary, Color(0xFF91F78E)],
        stops: const [0.0, 1.0],
      ).createShader(Rect.fromCircle(center: center, radius: radius))
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawCircle(center, radius, trackPaint);
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      3.14159 * 2 * progress.clamp(0.0, 1.0),
      false,
      arcPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _CircularRingPainter old) => old.progress != progress;
}

class _MacroPillRow extends StatelessWidget {
  final NutritionSummary nutrition;
  const _MacroPillRow({required this.nutrition});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _MacroPill(
            label: 'Protein',
            value: '${nutrition.protein.toStringAsFixed(0)}g',
            progress: nutrition.protein / nutrition.proteinGoal,
            color: AppColors.secondary,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _MacroPill(
            label: 'Carbs',
            value: '${nutrition.carbs.toStringAsFixed(0)}g',
            progress: nutrition.carbs / nutrition.carbsGoal,
            color: AppColors.primary,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _MacroPill(
            label: 'Fat',
            value: '${nutrition.fat.toStringAsFixed(0)}g',
            progress: nutrition.fat / nutrition.fatGoal,
            color: AppColors.tertiary,
          ),
        ),
      ],
    );
  }
}

class _MacroPill extends StatelessWidget {
  final String label;
  final String value;
  final double progress;
  final Color color;
  const _MacroPill({required this.label, required this.value, required this.progress, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: AppColors.onBackground.withOpacity(0.03), blurRadius: 10)],
      ),
      child: Column(
        children: [
          Text(label.toUpperCase(),
              style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: color, letterSpacing: 0.5)),
          const SizedBox(height: 6),
          Text(value,
              style: GoogleFonts.manrope(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.onBackground)),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              value: progress.clamp(0.0, 1.0),
              minHeight: 4,
              backgroundColor: AppColors.surfaceContainerHighest,
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
          ),
        ],
      ),
    );
  }
}

class _StreakCard extends StatelessWidget {
  final int streak;
  const _StreakCard({required this.streak});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.25), blurRadius: 20, offset: const Offset(0, 8))],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Consistent Eating',
                    style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.primaryContainer)),
                const SizedBox(height: 4),
                Text('$streak Day Streak!',
                    style: GoogleFonts.manrope(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                const SizedBox(height: 4),
                Text("Keep it up, you're hitting your targets.",
                    style: GoogleFonts.inter(fontSize: 11, color: Colors.white.withOpacity(0.75))),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), shape: BoxShape.circle),
            child: const Icon(Icons.local_fire_department_rounded, color: Colors.white, size: 36),
          ),
        ],
      ),
    );
  }
}

class _WeeklyChart extends StatelessWidget {
  final List<WeeklyData> weeklyData;
  const _WeeklyChart({required this.weeklyData});

  @override
  Widget build(BuildContext context) {
    final today = DateTime.now().weekday; // 1=Mon, 7=Sun
    final days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    final data = weeklyData.isNotEmpty
        ? weeklyData
        : List.generate(7, (i) => WeeklyData(
            day: days[i],
            calories: [1260, 1785, 1995, 840, 1470, 1155, 630][i],
            goal: 2100));

    final todayIdx = (today - 1) % 7;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: AppColors.onBackground.withOpacity(0.03), blurRadius: 12)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Weekly Summary',
                  style: GoogleFonts.manrope(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.onBackground)),
              Text('Past 7 Days',
                  style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primary)),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 160,
            child: BarChart(
              BarChartData(
                alignment: BarChartAlignment.spaceAround,
                maxY: 2500,
                minY: 0,
                barTouchData: BarTouchData(enabled: false),
                titlesData: FlTitlesData(
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (value, _) {
                        final idx = value.toInt();
                        if (idx < 0 || idx >= data.length) return const SizedBox();
                        return Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            data[idx].day,
                            style: GoogleFonts.inter(
                              fontSize: 9,
                              fontWeight: FontWeight.w700,
                              color: idx == todayIdx ? AppColors.primary : AppColors.onSurfaceVariant,
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                ),
                gridData: const FlGridData(show: false),
                borderData: FlBorderData(show: false),
                barGroups: List.generate(data.length, (i) {
                  final isToday = i == todayIdx;
                  return BarChartGroupData(
                    x: i,
                    barRods: [
                      BarChartRodData(
                        toY: data[i].calories.toDouble(),
                        width: 20,
                        borderRadius: BorderRadius.circular(6),
                        gradient: isToday
                            ? const LinearGradient(
                                colors: [AppColors.primary, Color(0xFF91F78E)],
                                begin: Alignment.bottomCenter,
                                end: Alignment.topCenter,
                              )
                            : const LinearGradient(
                                colors: [Color(0xFFFFCE5D), Color(0xFFFFCE5D)],
                              ),
                        backDrawRodData: BackgroundBarChartRodData(
                          show: true,
                          toY: 2500,
                          color: AppColors.surfaceContainerHighest,
                        ),
                      ),
                    ],
                  );
                }),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _DemoMealItem {
  final String name;
  final int calories;
  final double protein;
  final double carbs;
  final String time;
  final String mealType;
  const _DemoMealItem({
    required this.name,
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.time,
    required this.mealType,
  });
}

class _MealHistoryCard extends StatelessWidget {
  final _DemoMealItem item;
  const _MealHistoryCard({required this.item});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: AppColors.onBackground.withOpacity(0.04), blurRadius: 12)],
      ),
      child: Row(
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              gradient: const LinearGradient(
                colors: [AppColors.primaryContainer, Color(0xFFE8F5E9)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: const Icon(Icons.restaurant_rounded, color: AppColors.primary, size: 30),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(item.name,
                        style: GoogleFonts.manrope(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.onBackground)),
                    Text(item.time,
                        style: GoogleFonts.inter(fontSize: 11, color: AppColors.onSurfaceVariant)),
                  ],
                ),
                const SizedBox(height: 3),
                Text('${item.mealType} • Hostel Mess',
                    style: GoogleFonts.inter(fontSize: 12, color: AppColors.onSurfaceVariant)),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Text('${item.calories} kcal',
                        style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primary)),
                    const SizedBox(width: 10),
                    Text('P: ${item.protein}g',
                        style: GoogleFonts.inter(fontSize: 11, color: AppColors.outline)),
                    const SizedBox(width: 10),
                    Text('C: ${item.carbs}g',
                        style: GoogleFonts.inter(fontSize: 11, color: AppColors.outline)),
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
