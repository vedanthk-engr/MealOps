import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../services/api_client.dart';

enum LoginStep { idle, loggingIn, done }

class LoginState {
  final LoginStep step;
  final String? error;
  final String? errorType; // 'invalid_credentials' | 'vtop_error'

  const LoginState({
    this.step = LoginStep.idle,
    this.error,
    this.errorType,
  });

  LoginState copyWith({
    LoginStep? step,
    String? error,
    String? errorType,
  }) =>
      LoginState(
        step: step ?? this.step,
        error: error,
        errorType: errorType,
      );

  bool get isLoading => step == LoginStep.loggingIn;

  String get loadingStatus => step == LoginStep.loggingIn ? 'Authenticating...' : '';
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

  Future<void> login({
    required String regNo,
    required String password,
  }) async {
    state = state.copyWith(step: LoginStep.loggingIn, error: null);

    try {
      final result = await AuthService.vtopLogin(
        regNo: regNo,
        password: password,
      );

      state = state.copyWith(step: LoginStep.done);
      _ref.read(authStateProvider.notifier).state =
          AsyncValue.data(result.user);
    } on Exception catch (e) {
      String msg = e.toString().toLowerCase();
      
      if (msg.contains('401') || msg.contains('invalid credentials')) {
         state = LoginState(
          step: LoginStep.idle,
          error: 'Invalid VTOP credentials. Please try again.',
          errorType: 'invalid_credentials',
        );
      } else {
         state = LoginState(
          step: LoginStep.idle,
          error: 'VTOP connection failed. Ensure the auth server is running.',
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
