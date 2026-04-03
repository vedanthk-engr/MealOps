import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../core/theme.dart';
import '../models/dish.dart';
import '../models/meal_log.dart';
import '../providers/auth_provider.dart';
import '../providers/menu_provider.dart';
import '../services/meal_service.dart';
import '../widgets/app_bar.dart';
import '../widgets/shimmer_card.dart';

class MealLogScreen extends ConsumerStatefulWidget {
  const MealLogScreen({super.key});

  @override
  ConsumerState<MealLogScreen> createState() => _MealLogScreenState();
}

class _MealLogScreenState extends ConsumerState<MealLogScreen> {
  final Map<String, _DishLogEntry> _logEntries = {};
  bool _submitting = false;

  void _setStatus(String dishId, String dishName, MealStatus status) {
    setState(() {
      _logEntries[dishId] = (_logEntries[dishId] ?? _DishLogEntry(dishName: dishName))
          .copyWith(status: status);
    });
  }

  void _setEmoji(String dishId, String emoji) {
    setState(() {
      final e = _logEntries[dishId];
      if (e != null) _logEntries[dishId] = e.copyWith(emoji: emoji);
    });
  }

  void _setComment(String dishId, String comment) {
    final e = _logEntries[dishId];
    if (e != null) _logEntries[dishId] = e.copyWith(comment: comment);
  }

  Future<void> _submit() async {
    if (_submitting) return;
    setState(() => _submitting = true);
    try {
      final log = MealLog(
        date: DateFormat('yyyy-MM-dd').format(DateTime.now()),
        mealType: 'all',
        logs: _logEntries.entries
            .map((entry) => MealLogEntry(
                  dishId: entry.key,
                  dishName: entry.value.dishName,
                  status: entry.value.status,
                  emoji: entry.value.emoji,
                  comment: entry.value.comment,
                ))
            .toList(),
      );
      await MealService.logMeal(log);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Meal log submitted!'),
            backgroundColor: AppColors.primary,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to submit: ${e.toString()}'),
            backgroundColor: AppColors.tertiary,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);
    final user = authState.value;
    final menuAsync = ref.watch(todayMenuProvider);
    final today = DateFormat('EEEE, MMM d').format(DateTime.now());

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: SmartMessAppBar(initials: user?.initials ?? 'SM'),
      body: menuAsync.when(
        loading: () => Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: List.generate(
                4, (_) => const Padding(padding: EdgeInsets.only(bottom: 16), child: ShimmerCard(height: 80))),
          ),
        ),
        error: (e, _) => Center(
          child: Text('Unable to load menu: $e',
              style: const TextStyle(color: AppColors.onSurfaceVariant)),
        ),
        data: (menu) => _MealLogBody(
          menu: menu,
          today: today,
          logEntries: _logEntries,
          onSetStatus: _setStatus,
          onSetEmoji: _setEmoji,
          onSetComment: _setComment,
          onSubmit: _submit,
          submitting: _submitting,
        ),
      ),
    );
  }
}

class _MealLogBody extends StatelessWidget {
  final DayMenu menu;
  final String today;
  final Map<String, _DishLogEntry> logEntries;
  final Function(String, String, MealStatus) onSetStatus;
  final Function(String, String) onSetEmoji;
  final Function(String, String) onSetComment;
  final VoidCallback onSubmit;
  final bool submitting;

  const _MealLogBody({
    required this.menu,
    required this.today,
    required this.logEntries,
    required this.onSetStatus,
    required this.onSetEmoji,
    required this.onSetComment,
    required this.onSubmit,
    required this.submitting,
  });

  @override
  Widget build(BuildContext context) {
    final demoBreakfast = menu.breakfast.isEmpty
        ? [_demoDish('b1', 'Oatmeal with Berries'), _demoDish('b2', 'Idli Sambar')]
        : menu.breakfast;
    final demoLunch = menu.lunch.isEmpty
        ? [_demoDish('l1', 'Grilled Chicken Bowl'), _demoDish('l2', 'Seasonal Garden Salad')]
        : menu.lunch;
    final demoDinner = menu.dinner.isEmpty
        ? [_demoDish('d1', 'Steamed Fish & Asparagus')]
        : menu.dinner;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),
          Text('Daily Meal Log',
              style: GoogleFonts.manrope(
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                  color: AppColors.onBackground,
                  letterSpacing: -0.5)),
          const SizedBox(height: 4),
          Text('$today • Track your nutrition journey',
              style: GoogleFonts.inter(
                  fontSize: 13,
                  color: AppColors.onSurfaceVariant,
                  fontWeight: FontWeight.w500)),
          const SizedBox(height: 28),
          _MealSection(
            icon: Icons.light_mode_rounded,
            iconColor: AppColors.secondary,
            title: 'Breakfast',
            dishes: demoBreakfast,
            logEntries: logEntries,
            onSetStatus: onSetStatus,
            onSetEmoji: onSetEmoji,
            onSetComment: onSetComment,
          ),
          const SizedBox(height: 24),
          _MealSection(
            icon: Icons.wb_sunny_rounded,
            iconColor: AppColors.primary,
            title: 'Lunch',
            dishes: demoLunch,
            logEntries: logEntries,
            onSetStatus: onSetStatus,
            onSetEmoji: onSetEmoji,
            onSetComment: onSetComment,
          ),
          const SizedBox(height: 24),
          _MealSection(
            icon: Icons.dark_mode_rounded,
            iconColor: AppColors.tertiary,
            title: 'Dinner',
            dishes: demoDinner,
            logEntries: logEntries,
            onSetStatus: onSetStatus,
            onSetEmoji: onSetEmoji,
            onSetComment: onSetComment,
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: onSubmit,
              icon: submitting
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white))
                  : const Icon(Icons.cloud_upload_rounded, size: 20),
              label: Text(submitting ? 'Submitting...' : 'Submit Daily Log'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: const StadiumBorder(),
                textStyle: GoogleFonts.manrope(
                    fontSize: 16, fontWeight: FontWeight.w800),
              ),
            ),
          ),
          Center(
            child: Text('POST /api/meals/log',
                style: GoogleFonts.inter(
                    fontSize: 10,
                    color: AppColors.onSurfaceVariant,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.5)),
          ),
          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Dish _demoDish(String id, String name) => Dish(
      id: id,
      name: name,
      calories: 350,
      protein: 14,
      carbs: 45,
      fat: 12);
}

class _MealSection extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final List<Dish> dishes;
  final Map<String, _DishLogEntry> logEntries;
  final Function(String, String, MealStatus) onSetStatus;
  final Function(String, String) onSetEmoji;
  final Function(String, String) onSetComment;

  const _MealSection({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.dishes,
    required this.logEntries,
    required this.onSetStatus,
    required this.onSetEmoji,
    required this.onSetComment,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, color: iconColor, size: 22),
            const SizedBox(width: 10),
            Text(title,
                style: GoogleFonts.manrope(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: AppColors.onBackground)),
          ],
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.surfaceContainerLow,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                  color: AppColors.onBackground.withOpacity(0.03),
                  blurRadius: 16)
            ],
          ),
          child: Column(
            children: dishes
                .map((d) => _DishRow(
                      dish: d,
                      entry: logEntries[d.id],
                      onSetStatus: (s) => onSetStatus(d.id, d.name, s),
                      onSetEmoji: (e) => onSetEmoji(d.id, e),
                      onSetComment: (c) => onSetComment(d.id, c),
                    ))
                .toList(),
          ),
        ),
      ],
    );
  }
}

class _DishRow extends StatelessWidget {
  final Dish dish;
  final _DishLogEntry? entry;
  final ValueChanged<MealStatus> onSetStatus;
  final ValueChanged<String> onSetEmoji;
  final ValueChanged<String> onSetComment;

  const _DishRow({
    required this.dish,
    required this.entry,
    required this.onSetStatus,
    required this.onSetEmoji,
    required this.onSetComment,
  });

  @override
  Widget build(BuildContext context) {
    final status = entry?.status;
    final selectedEmoji = entry?.emoji;
    final showFeedback = status != null;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  dish.name,
                  style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.onBackground),
                ),
              ),
              _ToggleGroup(
                  status: status,
                  onAte: () => onSetStatus(MealStatus.ate),
                  onHalf: () => onSetStatus(MealStatus.ateHalf),
                  onSkip: () => onSetStatus(MealStatus.skipped)),
            ],
          ),
          if (showFeedback) ...[
            const SizedBox(height: 12),
            Divider(color: AppColors.outlineVariant.withOpacity(0.3), height: 1),
            const SizedBox(height: 12),
            // Emoji row
            Container(
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerLow,
                borderRadius: BorderRadius.circular(999),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: ['😍', '😊', '😐', '😞'].map((e) {
                  final isSelected = selectedEmoji == e;
                  return GestureDetector(
                    onTap: () => onSetEmoji(e),
                    child: AnimatedScale(
                      scale: isSelected ? 1.3 : 1.0,
                      duration: const Duration(milliseconds: 150),
                      child: Text(e,
                          style: TextStyle(
                              fontSize: 24,
                              color: isSelected ? null : null)),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              onChanged: onSetComment,
              decoration: InputDecoration(
                hintText: 'Optional notes about this dish...',
                hintStyle: GoogleFonts.inter(
                    fontSize: 13, color: AppColors.outlineVariant),
                filled: true,
                fillColor: Colors.transparent,
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(horizontal: 4),
              ),
              style: GoogleFonts.inter(
                  fontSize: 13, color: AppColors.onSurfaceVariant),
            ),
          ],
        ],
      ),
    );
  }
}

class _ToggleGroup extends StatelessWidget {
  final MealStatus? status;
  final VoidCallback onAte;
  final VoidCallback onHalf;
  final VoidCallback onSkip;

  const _ToggleGroup({
    required this.status,
    required this.onAte,
    required this.onHalf,
    required this.onSkip,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        children: [
          _ToggleBtn(
            icon: Icons.check_rounded,
            isActive: status == MealStatus.ate,
            activeColor: AppColors.primary,
            onTap: onAte,
          ),
          const SizedBox(width: 4),
          _ToggleBtn(
            icon: Icons.circle_outlined,
            isActive: status == MealStatus.ateHalf,
            activeColor: AppColors.secondary,
            onTap: onHalf,
          ),
          const SizedBox(width: 4),
          _ToggleBtn(
            icon: Icons.close_rounded,
            isActive: status == MealStatus.skipped,
            activeColor: AppColors.outlineVariant,
            onTap: onSkip,
          ),
        ],
      ),
    );
  }
}

class _ToggleBtn extends StatelessWidget {
  final IconData icon;
  final bool isActive;
  final Color activeColor;
  final VoidCallback onTap;

  const _ToggleBtn({
    required this.icon,
    required this.isActive,
    required this.activeColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: isActive ? activeColor : Colors.transparent,
          shape: BoxShape.circle,
          boxShadow: isActive
              ? [
                  BoxShadow(
                      color: activeColor.withOpacity(0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 3))
                ]
              : [],
        ),
        child: Icon(icon,
            color: isActive ? Colors.white : AppColors.onSurfaceVariant,
            size: 18),
      ),
    );
  }
}

class _DishLogEntry {
  final String dishName;
  final MealStatus status;
  final String? emoji;
  final String? comment;

  const _DishLogEntry({
    required this.dishName,
    this.status = MealStatus.ate,
    this.emoji,
    this.comment,
  });

  _DishLogEntry copyWith({
    MealStatus? status,
    String? emoji,
    String? comment,
  }) =>
      _DishLogEntry(
        dishName: dishName,
        status: status ?? this.status,
        emoji: emoji ?? this.emoji,
        comment: comment ?? this.comment,
      );
}
