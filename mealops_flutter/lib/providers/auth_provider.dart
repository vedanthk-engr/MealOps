import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../services/api_client.dart';

enum LoginStep { idle, fetchingCaptcha, solvingCaptcha, loggingIn, done }

class LoginState {
  final LoginStep step;
  final String? error;
  final String? errorType; // 'invalid_credentials' | 'captcha_failure'
  final Map<String, dynamic>? captchaData; // contains captcha_b64, JSESSIONID, CSRF

  const LoginState({
    this.step = LoginStep.idle,
    this.error,
    this.errorType,
    this.captchaData,
  });

  LoginState copyWith({
    LoginStep? step,
    String? error,
    String? errorType,
    Map<String, dynamic>? captchaData,
  }) =>
      LoginState(
        step: step ?? this.step,
        error: error,
        errorType: errorType,
        captchaData: captchaData ?? this.captchaData,
      );

  bool get isLoading =>
      step == LoginStep.fetchingCaptcha ||
      step == LoginStep.loggingIn;

  String get loadingStatus {
    switch (step) {
      case LoginStep.fetchingCaptcha:
        return 'Connecting to VTOP...';
      case LoginStep.loggingIn:
        return 'Authenticating...';
      default:
        return '';
    }
  }
}

// Auth state — current user
final authStateProvider = StateProvider<AsyncValue<User?>>((ref) {
  return const AsyncValue.data(null);
});

// Login notifier
final loginStateProvider =
    StateNotifierProvider<LoginNotifier, LoginState>((ref) {
  return LoginNotifier(ref);
});

class LoginNotifier extends StateNotifier<LoginState> {
  final Ref _ref;

  LoginNotifier(this._ref) : super(const LoginState());

  Future<void> fetchCaptchaAndProceed() async {
    state = state.copyWith(step: LoginStep.fetchingCaptcha, error: null);
    try {
      final captcha = await AuthService.getVtopCaptcha();
      state = state.copyWith(
        step: LoginStep.solvingCaptcha,
        captchaData: captcha,
      );
    } catch (e) {
      state = LoginState(
        step: LoginStep.idle,
        error: 'Failed to fetch captcha. Please try again.',
        errorType: 'connectivity_error',
      );
    }
  }

  Future<void> login({
    required String regNo,
    required String password,
    required String solution,
  }) async {
    final captcha = state.captchaData;
    if (captcha == null) return;

    state = state.copyWith(step: LoginStep.loggingIn, error: null);

    try {
      final result = await AuthService.vtopLogin(
        regNo: regNo,
        password: password,
        captchaSolution: solution,
        jsessionid: captcha['jsessionid'],
        csrfToken: captcha['csrf_token'],
        cookies: captcha['cookies'],
      );

      state = state.copyWith(step: LoginStep.done);
      _ref.read(authStateProvider.notifier).state =
          AsyncValue.data(result.user);
    } on Exception catch (e) {
      String msg = e.toString().toLowerCase();
      
      // Attempt to catch common errors
      if (msg.contains('400') || msg.contains('captcha')) {
         state = LoginState(
          step: LoginStep.idle,
          error: 'Captcha verification failed. Please try again.',
          errorType: 'captcha_failure',
        );
      } else if (msg.contains('401')) {
         state = LoginState(
          step: LoginStep.idle,
          error: 'Invalid credentials. Please check your reg number and password.',
          errorType: 'invalid_credentials',
        );
      } else {
         state = LoginState(
          step: LoginStep.idle,
          error: 'VTOP Authentication failed. Please check your connectivity.',
          errorType: 'vtop_error',
        );
      }
    }
  }

  void resetFlow() {
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
