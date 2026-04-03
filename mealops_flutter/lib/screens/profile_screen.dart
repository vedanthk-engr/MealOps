import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';
import '../providers/auth_provider.dart';
import '../services/api_client.dart';
import '../widgets/app_bar.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final user = authState.value;

    final name = user?.name ?? 'Student User';
    final regNo = user?.regNo ?? '21BCE0XXX';
    final branch = user?.branch ?? 'B.Tech Computer Science';
    final hostelBlock = user?.hostelBlock ?? 'Block-B';
    final roomNo = user?.roomNo ?? '402';
    final messType = user?.messType ?? 'Veg Mess';
    final initials = user?.initials ?? 'SM';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: SmartMessAppBar(initials: initials),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          children: [
            const SizedBox(height: 32),
            // Avatar
            _ProfileAvatar(initials: initials),
            const SizedBox(height: 16),
            Text(name,
                style: GoogleFonts.manrope(
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    color: AppColors.onBackground)),
            const SizedBox(height: 4),
            Text(branch,
                style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: AppColors.onSurfaceVariant)),
            const SizedBox(height: 32),
            // Details bento grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.6,
              children: [
                _InfoCard(icon: Icons.badge_outlined, iconColor: AppColors.secondary, label: 'Reg No', value: regNo),
                _InfoCard(icon: Icons.account_tree_outlined, iconColor: AppColors.primary, label: 'Branch', value: branch.split(' ').take(2).join(' ')),
                _InfoCard(icon: Icons.apartment_rounded, iconColor: AppColors.tertiary, label: 'Hostel Block', value: '$hostelBlock, Rm $roomNo'),
                _InfoCard(icon: Icons.restaurant_rounded, iconColor: AppColors.primary, label: 'Mess Type', value: messType),
              ],
            ),
            const SizedBox(height: 28),
            // Utility buttons
            _UtilityButton(
              icon: Icons.settings_outlined,
              title: 'Preferences',
              subtitle: 'Manage dietary restrictions',
              onTap: () {},
            ),
            const SizedBox(height: 12),
            _UtilityButton(
              icon: Icons.history_rounded,
              title: 'Meal History',
              subtitle: 'View past 30 days attendance',
              onTap: () => context.go('/history'),
            ),
            const SizedBox(height: 12),
            _UtilityButton(
              icon: Icons.bar_chart_rounded,
              title: 'Nutrition Dashboard',
              subtitle: 'Detailed analytics & trends',
              onTap: () => context.push('/nutrition-dashboard'),
            ),
            const SizedBox(height: 40),
            // Logout
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () async {
                  await ApiClient.clearToken();
                  ref.read(authStateProvider.notifier).state =
                      const AsyncValue.data(null);
                },
                child: const Text('Logout'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.tertiary,
                  foregroundColor: AppColors.onTertiary,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: const StadiumBorder(),
                  textStyle: GoogleFonts.manrope(fontSize: 16, fontWeight: FontWeight.w800),
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text('APP VERSION',
                style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.onSurfaceVariant, letterSpacing: 0.8)),
            const SizedBox(height: 4),
            Text('v2.4.1 (Stable Build)',
                style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.outline)),
            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }
}

class _ProfileAvatar extends StatelessWidget {
  final String initials;
  const _ProfileAvatar({required this.initials});

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.bottomRight,
      children: [
        Container(
          width: 120,
          height: 120,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            gradient: const LinearGradient(
              colors: [AppColors.primary, AppColors.primaryContainer],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            boxShadow: [
              BoxShadow(
                  color: AppColors.primary.withOpacity(0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 8))
            ],
          ),
          child: Center(
            child: Text(initials,
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 40,
                    fontWeight: FontWeight.w800)),
          ),
        ),
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: AppColors.surfaceContainerLowest,
            shape: BoxShape.circle,
            boxShadow: [BoxShadow(color: AppColors.outlineVariant.withOpacity(0.15), blurRadius: 8)],
          ),
          child: const Icon(Icons.verified_user_rounded, color: AppColors.primary, size: 18),
        ),
      ],
    );
  }
}

class _InfoCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String label;
  final String value;

  const _InfoCard({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.value,
  });

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
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, color: iconColor, size: 18),
              const SizedBox(width: 6),
              Text(label.toUpperCase(),
                  style: GoogleFonts.inter(
                      fontSize: 9,
                      fontWeight: FontWeight.w700,
                      color: AppColors.onSurfaceVariant,
                      letterSpacing: 0.5)),
            ],
          ),
          const SizedBox(height: 8),
          Text(value,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.manrope(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: AppColors.onBackground)),
        ],
      ),
    );
  }
}

class _UtilityButton extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _UtilityButton({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerLowest,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: AppColors.onBackground, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: GoogleFonts.manrope(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppColors.onBackground)),
                  Text(subtitle,
                      style: GoogleFonts.inter(
                          fontSize: 11, color: AppColors.onSurfaceVariant)),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded,
                color: AppColors.onSurfaceVariant),
          ],
        ),
      ),
    );
  }
}
