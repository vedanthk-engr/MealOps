import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../services/api_client.dart';

enum LoginStep { idle, verifying, solvingCaptcha, fetchingProfile, done }

class LoginState {
  final LoginStep step;
  final String? error;
  final String? errorType; // 'invalid_credentials' | 'captcha_failure'

  const LoginState({
    this.step = LoginStep.idle,
    this.error,
    this.errorType,
  });

  LoginState copyWith({LoginStep? step, String? error, String? errorType}) =>
      LoginState(
        step: step ?? this.step,
        error: error,
        errorType: errorType,
      );

  bool get isLoading =>
      step == LoginStep.verifying ||
      step == LoginStep.solvingCaptcha ||
      step == LoginStep.fetchingProfile;

  String get loadingMessage {
    switch (step) {
      case LoginStep.verifying:
        return 'Verifying with VTOP...';
      case LoginStep.solvingCaptcha:
        return 'Solving captcha...';
      case LoginStep.fetchingProfile:
        return 'Fetching profile...';
      default:
        return '';
    }
  }
}

// Auth state — the user object when logged in
final authStateProvider = StateProvider<AsyncValue<User?>>((ref) {
  return const AsyncValue.data(null);
});

// Login UI state
final loginStateProvider =
    StateNotifierProvider<LoginNotifier, LoginState>((ref) {
  return LoginNotifier(ref);
});

class LoginNotifier extends StateNotifier<LoginState> {
  final Ref _ref;

  LoginNotifier(this._ref) : super(const LoginState());

  Future<void> login(String regNo, String password) async {
    state = state.copyWith(step: LoginStep.verifying);

    try {
      await Future.delayed(const Duration(milliseconds: 600));
      state = state.copyWith(step: LoginStep.solvingCaptcha);

      await Future.delayed(const Duration(milliseconds: 700));
      state = state.copyWith(step: LoginStep.fetchingProfile);

      final result = await AuthService.vtopLogin(
        regNo: regNo,
        password: password,
      );

      state = state.copyWith(step: LoginStep.done);
      _ref.read(authStateProvider.notifier).state =
          AsyncValue.data(result.user);
    } on Exception catch (e) {
      final msg = e.toString().toLowerCase();
      if (msg.contains('captcha')) {
        state = LoginState(
          step: LoginStep.idle,
          error: 'Captcha verification failed. Please try again.',
          errorType: 'captcha_failure',
        );
      } else {
        state = LoginState(
          step: LoginStep.idle,
          error: 'Invalid credentials. Check your registration number and password.',
          errorType: 'invalid_credentials',
        );
      }
    }
  }

  void resetError() {
    state = const LoginState();
  }
}

// Check stored JWT on startup
final authInitProvider = FutureProvider<void>((ref) async {
  final token = await ApiClient.getToken();
  if (token != null && token.isNotEmpty) {
    try {
      if (!JwtDecoder.isExpired(token)) {
        final payload = JwtDecoder.decode(token);
        final user = User.fromJson(payload);
        ref.read(authStateProvider.notifier).state = AsyncValue.data(user);
      } else {
        await ApiClient.clearToken();
      }
    } catch (_) {
      await ApiClient.clearToken();
    }
  }
});
