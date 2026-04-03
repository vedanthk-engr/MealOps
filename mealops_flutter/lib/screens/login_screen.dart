import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';
import '../providers/auth_provider.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _regNoCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _captchaCtrl = TextEditingController();
  bool _obscurePass = true;
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _regNoCtrl.dispose();
    _passCtrl.dispose();
    _captchaCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    ref.read(loginStateProvider.notifier).fetchCaptchaAndProceed();
  }

  void _submitFinalLogin() {
    if (_captchaCtrl.text.isEmpty) return;
    ref.read(loginStateProvider.notifier).login(
          regNo: _regNoCtrl.text.trim(),
          password: _passCtrl.text,
          solution: _captchaCtrl.text,
        );
  }

  @override
  Widget build(BuildContext context) {
    final loginState = ref.watch(loginStateProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          _BackgroundBlobs(),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  const SizedBox(height: 48),
                  _VITBranding(),
                  const SizedBox(height: 40),
                  
                  // Conditional UI steps
                  if (loginState.step == LoginStep.idle || 
                      loginState.step == LoginStep.fetchingCaptcha)
                    _LoginCard(
                      formKey: _formKey,
                      regNoCtrl: _regNoCtrl,
                      passCtrl: _passCtrl,
                      obscurePass: _obscurePass,
                      onToggleObscure: () => setState(() => _obscurePass = !_obscurePass),
                      onSubmit: loginState.isLoading ? null : _submit,
                      isLoading: loginState.step == LoginStep.fetchingCaptcha,
                    ),

                  if (loginState.step == LoginStep.solvingCaptcha || 
                      loginState.step == LoginStep.loggingIn)
                    _CaptchaCard(
                      captchaCtrl: _captchaCtrl,
                      captchaB64: loginState.captchaData?['captcha_b64'],
                      onRefresh: () => ref.read(loginStateProvider.notifier).fetchCaptchaAndProceed(),
                      onBack: () => ref.read(loginStateProvider.notifier).resetFlow(),
                      onSubmit: loginState.step == LoginStep.loggingIn ? null : _submitFinalLogin,
                      isLoading: loginState.step == LoginStep.loggingIn,
                    ),

                  const SizedBox(height: 20),
                  
                  // Status/Error Messages
                  if (loginState.error != null)
                    _ErrorCard(
                      message: loginState.error!,
                      type: loginState.errorType ?? 'error',
                    ),
                    
                  const SizedBox(height: 48),
                  _Footer(),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BackgroundBlobs extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned(
          top: -80,
          left: -80,
          child: Container(
            width: 300,
            height: 300,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.primary.withOpacity(0.05),
            ),
          ),
        ),
        Positioned(
          top: MediaQuery.of(context).size.height * 0.4,
          right: -120,
          child: Container(
            width: 380,
            height: 380,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.secondary.withOpacity(0.04),
            ),
          ),
        ),
      ],
    );
  }
}

class _VITBranding extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: AppColors.onBackground.withOpacity(0.06),
                blurRadius: 40,
                offset: const Offset(0, 20),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1E3A8A), Color(0xFF3B82F6)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Center(
                  child: Text(
                    'VIT',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'VIT Chennai',
                    style: GoogleFonts.manrope(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: AppColors.onBackground,
                    ),
                  ),
                  Text(
                    'Vellore Institute of Technology',
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.w500,
                      color: AppColors.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Text(
          'MealOps',
          style: GoogleFonts.manrope(
            fontSize: 42,
            fontWeight: FontWeight.w800,
            color: AppColors.primary,
            letterSpacing: -1,
          ),
        ),
      ],
    );
  }
}

class _LoginCard extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final TextEditingController regNoCtrl;
  final TextEditingController passCtrl;
  final bool obscurePass;
  final VoidCallback onToggleObscure;
  final VoidCallback? onSubmit;
  final bool isLoading;

  const _LoginCard({
    required this.formKey,
    required this.regNoCtrl,
    required this.passCtrl,
    required this.obscurePass,
    required this.onToggleObscure,
    required this.onSubmit,
    required this.isLoading,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppColors.onBackground.withOpacity(0.04),
            blurRadius: 40,
            offset: const Offset(0, 20),
          ),
        ],
        border: Border.all(color: Colors.white.withOpacity(0.5)),
      ),
      child: Form(
        key: formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _InputLabel(icon: Icons.badge_outlined, label: 'Registration Number'),
            const SizedBox(height: 8),
            TextFormField(
              controller: regNoCtrl,
              textCapitalization: TextCapitalization.characters,
              decoration: const InputDecoration(hintText: '21BCE0452'),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 20),
            _InputLabel(icon: Icons.lock_outline_rounded, label: 'Password'),
            const SizedBox(height: 8),
            TextFormField(
              controller: passCtrl,
              obscureText: obscurePass,
              decoration: InputDecoration(
                hintText: '••••••••',
                suffixIcon: IconButton(
                  icon: Icon(
                    obscurePass ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                    color: AppColors.onSurfaceVariant,
                    size: 20,
                  ),
                  onPressed: onToggleObscure,
                ),
              ),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 28),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: onSubmit,
                icon: isLoading
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
                      )
                    : const Icon(Icons.arrow_forward_rounded, size: 20),
                label: Text(isLoading ? 'Connecting...' : 'Continue to Captcha'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CaptchaCard extends StatelessWidget {
  final TextEditingController captchaCtrl;
  final String? captchaB64;
  final VoidCallback onRefresh;
  final VoidCallback onBack;
  final VoidCallback? onSubmit;
  final bool isLoading;

  const _CaptchaCard({
    required this.captchaCtrl,
    required this.captchaB64,
    required this.onRefresh,
    required this.onBack,
    required this.onSubmit,
    required this.isLoading,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppColors.onBackground.withOpacity(0.04),
            blurRadius: 40,
            offset: const Offset(0, 20),
          ),
        ],
        border: Border.all(color: AppColors.primary.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          const Text(
            'Security Verification',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
          ),
          const SizedBox(height: 20),
          if (captchaB64 != null)
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Image.memory(
                base64Decode(captchaB64!),
                height: 60,
                width: 180,
                fit: BoxFit.contain,
              ),
            ),
          TextButton.icon(
            onPressed: onRefresh,
            icon: const Icon(Icons.refresh_rounded, size: 14),
            label: const Text('Refresh Image', style: TextStyle(fontSize: 12)),
          ),
          const SizedBox(height: 16),
          _InputLabel(icon: Icons.spellcheck_rounded, label: 'Captcha Code'),
          const SizedBox(height: 8),
          TextField(
            controller: captchaCtrl,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              letterSpacing: 8,
            ),
            decoration: const InputDecoration(
              hintText: 'ABCD...',
              hintStyle: TextStyle(fontSize: 16, letterSpacing: 1),
            ),
          ),
          const SizedBox(height: 28),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: onBack,
                  child: const Text('Back'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  onPressed: onSubmit,
                  child: isLoading
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
                        )
                      : const Text('Login with VTOP'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _InputLabel extends StatelessWidget {
  final IconData icon;
  final String label;
  const _InputLabel({required this.icon, required this.label});
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.onSurfaceVariant),
        const SizedBox(width: 6),
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppColors.onBackground,
          ),
        ),
      ],
    );
  }
}

class _ErrorCard extends StatelessWidget {
  final String message;
  final String type;
  const _ErrorCard({required this.message, required this.type});

  @override
  Widget build(BuildContext context) {
    final color = AppColors.tertiary;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        border: Border.all(color: color.withOpacity(0.3)),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Icon(Icons.error_outline_rounded, color: color, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              style: GoogleFonts.inter(fontSize: 12, color: color, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}

class _Footer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Text('Forgot password? Reset via VTOP', style: TextStyle(fontSize: 12)),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Text('SECURE SSL', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 1)),
            SizedBox(width: 20),
            Text('VIT AUTHORIZED', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 1)),
          ],
        ),
      ],
    );
  }
}
