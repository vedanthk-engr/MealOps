import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../core/theme.dart';
import '../models/dish.dart';
import '../providers/auth_provider.dart';
import '../providers/menu_provider.dart';
import '../services/preorder_service.dart';
import '../widgets/app_bar.dart';
import '../widgets/shimmer_card.dart';

class PreOrderScreen extends ConsumerStatefulWidget {
  const PreOrderScreen({super.key});

  @override
  ConsumerState<PreOrderScreen> createState() => _PreOrderScreenState();
}

class _PreOrderScreenState extends ConsumerState<PreOrderScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabCtrl;
  final Set<String> _selectedDishIds = {};
  bool _submitting = false;
  Timer? _countdownTimer;
  Duration _remaining = const Duration(hours: 4, minutes: 12, seconds: 55);

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 2, vsync: this);
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      setState(() {
        if (_remaining.inSeconds > 0) {
          _remaining = _remaining - const Duration(seconds: 1);
        } else {
          _countdownTimer?.cancel();
        }
      });
    });
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    _countdownTimer?.cancel();
    super.dispose();
  }

  void _toggleDish(String id) {
    setState(() {
      if (_selectedDishIds.contains(id)) {
        _selectedDishIds.remove(id);
      } else {
        _selectedDishIds.add(id);
      }
    });
  }

  Future<void> _confirmOrder() async {
    if (_submitting || _selectedDishIds.isEmpty) return;
    setState(() => _submitting = true);
    try {
      await PreOrderService.submitPreOrder(_selectedDishIds.toList());
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Pre-order confirmed!'),
            backgroundColor: AppColors.primary,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Failed: $e'),
              backgroundColor: AppColors.tertiary),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  String _formatDuration(Duration d) {
    final h = d.inHours.toString().padLeft(2, '0');
    final m = (d.inMinutes % 60).toString().padLeft(2, '0');
    final s = (d.inSeconds % 60).toString().padLeft(2, '0');
    return '$h:$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);
    final user = authState.value;
    final menuAsync = ref.watch(tomorrowMenuProvider);
    final tomorrow = DateFormat('MMM d, yyyy')
        .format(DateTime.now().add(const Duration(days: 1)));

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: SmartMessAppBar(initials: user?.initials ?? 'SM'),
      body: menuAsync.when(
        loading: () => const Center(
            child: CircularProgressIndicator(color: AppColors.primary)),
        error: (_, __) => _PreOrderBody(
          menu: _demoMenu(),
          tomorrow: tomorrow,
          selectedIds: _selectedDishIds,
          onToggle: _toggleDish,
          tabController: _tabCtrl,
          countdown: _formatDuration(_remaining),
        ),
        data: (menu) => _PreOrderBody(
          menu: menu,
          tomorrow: tomorrow,
          selectedIds: _selectedDishIds,
          onToggle: _toggleDish,
          tabController: _tabCtrl,
          countdown: _formatDuration(_remaining),
        ),
      ),
      bottomSheet: _StickyConfirmButton(
        selectedCount: _selectedDishIds.length,
        onConfirm: _confirmOrder,
        submitting: _submitting,
      ),
    );
  }

  DayMenu _demoMenu() => DayMenu(
        breakfast: [
          Dish(id: 'bp1', name: 'Multigrain Pancakes', calories: 420, protein: 14, carbs: 56, fat: 12, description: 'With wild berries & honey'),
          Dish(id: 'bp2', name: 'Steel-cut Oatmeal', calories: 310, protein: 10, carbs: 48, fat: 8, description: 'Almonds & Chia seeds'),
        ],
        lunch: [
          Dish(id: 'lp1', name: 'Grilled Chicken Salad', calories: 480, protein: 38, carbs: 22, fat: 16, description: 'Garden fresh greens'),
        ],
        dinner: [
          Dish(id: 'dp1', name: 'Dal Tadka & Roti', calories: 380, protein: 18, carbs: 58, fat: 10, description: 'Tempered lentils'),
          Dish(id: 'dp2', name: 'Palak Paneer', calories: 340, protein: 16, carbs: 20, fat: 22, description: 'Cottage cheese & spinach'),
        ],
      );
}

class _PreOrderBody extends StatelessWidget {
  final DayMenu menu;
  final String tomorrow;
  final Set<String> selectedIds;
  final ValueChanged<String> onToggle;
  final TabController tabController;
  final String countdown;

  const _PreOrderBody({
    required this.menu,
    required this.tomorrow,
    required this.selectedIds,
    required this.onToggle,
    required this.tabController,
    required this.countdown,
  });

  int get _totalCalories => [
        ...menu.breakfast,
        ...menu.lunch,
        ...menu.dinner,
      ]
          .where((d) => selectedIds.contains(d.id))
          .fold(0, (sum, d) => sum + d.calories);

  @override
  Widget build(BuildContext context) {
    final allDishes = [...menu.breakfast, ...menu.lunch, ...menu.dinner];

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 200),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Date + countdown
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Tomorrow's Menu",
                      style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: AppColors.onSurfaceVariant,
                          letterSpacing: 0.5)),
                  const SizedBox(height: 4),
                  Text(tomorrow,
                      style: GoogleFonts.manrope(
                          fontSize: 26,
                          fontWeight: FontWeight.w800,
                          color: AppColors.onBackground)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: AppColors.tertiaryContainer.withOpacity(0.25),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text('ORDERS CLOSE IN',
                        style: GoogleFonts.inter(
                            fontSize: 9,
                            fontWeight: FontWeight.w800,
                            color: AppColors.tertiary,
                            letterSpacing: 0.5)),
                    Text(countdown,
                        style: GoogleFonts.manrope(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: AppColors.tertiary)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          // Tab switcher
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLow,
              borderRadius: BorderRadius.circular(999),
            ),
            child: TabBar(
              controller: tabController,
              indicator: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(999),
              ),
              indicatorSize: TabBarIndicatorSize.tab,
              dividerColor: Colors.transparent,
              labelColor: Colors.white,
              unselectedLabelColor: AppColors.onSurfaceVariant,
              labelStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600),
              tabs: const [Tab(text: 'Regular'), Tab(text: 'Feast')],
            ),
          ),
          const SizedBox(height: 28),
          // Breakfast
          if (menu.breakfast.isNotEmpty) ...[
            _SectionHeader(icon: Icons.light_mode_rounded, iconBg: AppColors.secondaryContainer, title: 'Breakfast'),
            const SizedBox(height: 12),
            ...menu.breakfast.map((d) => Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: _PreOrderDishCard(
                    dish: d,
                    isSelected: selectedIds.contains(d.id),
                    onToggle: () => onToggle(d.id),
                  ),
                )),
          ],
          // Lunch
          if (menu.lunch.isNotEmpty) ...[
            const SizedBox(height: 8),
            _SectionHeader(icon: Icons.wb_sunny_rounded, iconBg: AppColors.primaryContainer.withOpacity(0.4), title: 'Lunch'),
            const SizedBox(height: 12),
            ...menu.lunch.map((d) => Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: _PreOrderDishCard(
                    dish: d,
                    isSelected: selectedIds.contains(d.id),
                    onToggle: () => onToggle(d.id),
                  ),
                )),
          ],
          // Dinner
          if (menu.dinner.isNotEmpty) ...[
            const SizedBox(height: 8),
            _SectionHeader(icon: Icons.dark_mode_rounded, iconBg: AppColors.tertiaryContainer.withOpacity(0.3), title: 'Dinner'),
            const SizedBox(height: 12),
            ...menu.dinner.map((d) => Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: _PreOrderDishCard(
                    dish: d,
                    isSelected: selectedIds.contains(d.id),
                    onToggle: () => onToggle(d.id),
                  ),
                )),
          ],
          const SizedBox(height: 20),
          // Summary card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                    color: AppColors.primary.withOpacity(0.25),
                    blurRadius: 20)
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('SELECTED SUMMARY',
                      style: GoogleFonts.inter(
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                          color: Colors.white.withOpacity(0.7),
                          letterSpacing: 0.5)),
                  const SizedBox(height: 4),
                  Text('${selectedIds.length} Meal${selectedIds.length != 1 ? 's' : ''} Selected',
                      style: GoogleFonts.manrope(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: Colors.white)),
                ]),
                Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  Text('EST. CALORIES',
                      style: GoogleFonts.inter(
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                          color: Colors.white.withOpacity(0.7),
                          letterSpacing: 0.5)),
                  const SizedBox(height: 4),
                  Text('${_totalCalories} kcal',
                      style: GoogleFonts.manrope(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: Colors.white)),
                ]),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final IconData icon;
  final Color iconBg;
  final String title;
  const _SectionHeader({required this.icon, required this.iconBg, required this.title});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(color: iconBg, borderRadius: BorderRadius.circular(14)),
          child: Icon(icon, color: AppColors.onBackground, size: 22),
        ),
        const SizedBox(width: 12),
        Text(title, style: GoogleFonts.manrope(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.onBackground)),
        const SizedBox(width: 14),
        Expanded(child: Container(height: 2, color: AppColors.surfaceContainerHighest, margin: const EdgeInsets.only(top: 2))),
      ],
    );
  }
}

class _PreOrderDishCard extends StatelessWidget {
  final Dish dish;
  final bool isSelected;
  final VoidCallback onToggle;
  const _PreOrderDishCard({required this.dish, required this.isSelected, required this.onToggle});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: AppColors.onBackground.withOpacity(0.04), blurRadius: 20)],
      ),
      child: Row(
        children: [
          // Dish image placeholder
          Container(
            width: 90,
            height: 90,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              color: AppColors.surfaceContainerHigh,
              gradient: const LinearGradient(
                colors: [AppColors.primaryContainer, Color(0xFFE8F5E9)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: const Icon(Icons.restaurant_rounded, color: AppColors.primary, size: 36),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(dish.name,
                              style: GoogleFonts.manrope(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.onBackground)),
                          if (dish.description != null) ...[
                            const SizedBox(height: 3),
                            Text(dish.description!,
                                style: GoogleFonts.inter(fontSize: 12, color: AppColors.onSurfaceVariant)),
                          ],
                        ],
                      ),
                    ),
                    Switch(
                      value: isSelected,
                      onChanged: (_) => onToggle(),
                      activeColor: AppColors.primary,
                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    _InfoBadge(label: '${dish.calories} kcal', color: AppColors.primary, bg: AppColors.primaryContainer.withOpacity(0.3)),
                    const SizedBox(width: 8),
                    _InfoBadge(label: 'P: ${dish.protein}g', color: AppColors.onSurfaceVariant, bg: AppColors.surfaceContainerHigh),
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

class _InfoBadge extends StatelessWidget {
  final String label;
  final Color color;
  final Color bg;
  const _InfoBadge({required this.label, required this.color, required this.bg});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
      child: Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: color, letterSpacing: 0.3)),
    );
  }
}

class _StickyConfirmButton extends StatelessWidget {
  final int selectedCount;
  final VoidCallback onConfirm;
  final bool submitting;

  const _StickyConfirmButton({required this.selectedCount, required this.onConfirm, required this.submitting});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.background,
      padding: EdgeInsets.only(
          left: 20, right: 20, bottom: MediaQuery.of(context).padding.bottom + 16, top: 12),
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: selectedCount > 0 ? onConfirm : null,
          icon: submitting
              ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
              : const Icon(Icons.arrow_forward_rounded, size: 20),
          label: Text(submitting ? 'Confirming...' : 'Confirm Pre-Order'),
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 18),
            shape: const StadiumBorder(),
            textStyle: GoogleFonts.manrope(fontSize: 16, fontWeight: FontWeight.w800),
          ),
        ),
      ),
    );
  }
}
