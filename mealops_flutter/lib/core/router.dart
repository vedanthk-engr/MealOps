import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../screens/login_screen.dart';
import '../screens/home_screen.dart';
import '../screens/meal_log_screen.dart';
import '../screens/scan_screen.dart';
import '../screens/preorder_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/nutrition_dashboard_screen.dart';
import '../screens/nutrition_detail_screen.dart';
import '../widgets/bottom_nav_shell.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/home',
    redirect: (context, state) {
      final isLoggedIn = authState.value != null;
      final isOnLogin = state.matchedLocation == '/login';

      if (!isLoggedIn && !isOnLogin) return '/login';
      if (isLoggedIn && isOnLogin) return '/home';
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        name: 'login',
        pageBuilder: (ctx, state) =>
            const NoTransitionPage(child: LoginScreen()),
      ),
      ShellRoute(
        builder: (ctx, state, child) => BottomNavShell(child: child),
        routes: [
          GoRoute(
            path: '/home',
            name: 'home',
            pageBuilder: (ctx, state) =>
                const NoTransitionPage(child: HomeScreen()),
          ),
          GoRoute(
            path: '/history',
            name: 'history',
            pageBuilder: (ctx, state) =>
                const NoTransitionPage(child: MealLogScreen()),
          ),
          GoRoute(
            path: '/scan',
            name: 'scan',
            pageBuilder: (ctx, state) =>
                const NoTransitionPage(child: ScanScreen()),
          ),
          GoRoute(
            path: '/preorder',
            name: 'preorder',
            pageBuilder: (ctx, state) =>
                const NoTransitionPage(child: PreOrderScreen()),
          ),
          GoRoute(
            path: '/profile',
            name: 'profile',
            pageBuilder: (ctx, state) =>
                const NoTransitionPage(child: ProfileScreen()),
          ),
        ],
      ),
      GoRoute(
        path: '/nutrition-dashboard',
        name: 'nutritionDashboard',
        pageBuilder: (ctx, state) => MaterialPage(
          child: NutritionDashboardScreen(),
        ),
      ),
      GoRoute(
        path: '/nutrition-detail',
        name: 'nutritionDetail',
        pageBuilder: (ctx, state) {
          final extra = state.extra as Map<String, dynamic>? ?? {};
          return MaterialPage(child: NutritionDetailScreen(data: extra));
        },
      ),
    ],
    errorBuilder: (ctx, state) => Scaffold(
      body: Center(child: Text('Page not found: ${state.error}')),
    ),
  );
});
