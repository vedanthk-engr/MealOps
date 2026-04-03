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
  bool _obscurePass = true;
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _regNoCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    ref.read(loginStateProvider.notifier).login(
          _regNoCtrl.text.trim(),
          _passCtrl.text,
        );
  }

  @override
  Widget build(BuildContext context) {
    final loginState = ref.watch(loginStateProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Organic background blobs
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
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  const SizedBox(height: 48),
                  // VIT Branding
                  _VITBranding(),
                  const SizedBox(height: 40),
                  // Login Card
                  _LoginCard(
                    formKey: _formKey,
                    regNoCtrl: _regNoCtrl,
                    passCtrl: _passCtrl,
                    obscurePass: _obscurePass,
                    onToggleObscure: () =>
                        setState(() => _obscurePass = !_obscurePass),
                    onSubmit: loginState.isLoading ? null : _submit,
                    isLoading: loginState.isLoading,
                  ),
                  const SizedBox(height: 20),
                  // Status cards
                  if (loginState.isLoading) _LoadingCard(loginState.loadingMessage),
                  if (loginState.error != null && !loginState.isLoading)
                    _ErrorCard(
                      message: loginState.error!,
                      type: loginState.errorType ?? 'invalid_credentials',
                    ),
                  const SizedBox(height: 48),
                  // Footer
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

class _VITBranding extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // VIT Logo placeholder (rounded square)
        Container(
          padding: const EdgeInsets.all(20),
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
        const SizedBox(height: 24),
        Text(
          'Smart Mess',
          style: GoogleFonts.manrope(
            fontSize: 48,
            fontWeight: FontWeight.w800,
            color: AppColors.primary,
            height: 1.0,
            letterSpacing: -1,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Curating your nutritional journey',
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: AppColors.onSurfaceVariant,
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
            // Reg No field
            _InputLabel(icon: Icons.badge_outlined, label: 'Registration Number'),
            const SizedBox(height: 8),
            TextFormField(
              controller: regNoCtrl,
              textCapitalization: TextCapitalization.characters,
              decoration: const InputDecoration(
                hintText: '21BCE0452',
                hintStyle: TextStyle(color: Color(0xFF9E9E9E)),
              ),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 20),
            // Password field
            _InputLabel(icon: Icons.lock_outline_rounded, label: 'Password'),
            const SizedBox(height: 8),
            TextFormField(
              controller: passCtrl,
              obscureText: obscurePass,
              decoration: InputDecoration(
                hintText: '••••••••',
                hintStyle: const TextStyle(color: Color(0xFF9E9E9E)),
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
            // Login Button
            AnimatedScale(
              scale: isLoading ? 0.96 : 1.0,
              duration: const Duration(milliseconds: 150),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: onSubmit,
                  icon: isLoading
                      ? SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            color: AppColors.onPrimary,
                            strokeWidth: 2.5,
                          ),
                        )
                      : const Icon(Icons.login_rounded, size: 20),
                  label: Text(isLoading ? 'Connecting...' : 'Login with VTOP'),
                ),
              ),
            ),
          ],
        ),
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

class _LoadingCard extends StatelessWidget {
  final String message;
  const _LoadingCard(this.message);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.5),
        border: Border.all(color: AppColors.primary.withOpacity(0.15)),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(
              strokeWidth: 2.5,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  message,
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
                Text(
                  'Connecting securely...',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: AppColors.onSurfaceVariant,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ErrorCard extends StatelessWidget {
  final String message;
  final String type;
  const _ErrorCard({required this.message, required this.type});

  @override
  Widget build(BuildContext context) {
    final isCredError = type == 'invalid_credentials';
    final color = isCredError ? AppColors.tertiary : AppColors.secondary;
    final bgColor = isCredError
        ? AppColors.tertiaryContainer.withOpacity(0.2)
        : AppColors.secondaryContainer.withOpacity(0.3);
    final icon = isCredError ? Icons.error_rounded : Icons.warning_amber_rounded;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        border: Border.all(color: color.withOpacity(0.3)),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isCredError ? 'Invalid Credentials' : 'Captcha Failure',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: color,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  message,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: AppColors.onBackground.withOpacity(0.7),
                    height: 1.4,
                  ),
                ),
              ],
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
        Text.rich(
          TextSpan(
            text: 'Forgot password? ',
            style: GoogleFonts.inter(
                fontSize: 13, color: AppColors.onSurfaceVariant),
            children: [
              TextSpan(
                text: 'Reset via VTOP',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _FooterBadge('Secure SSL'),
            _Dot(),
            _FooterBadge('Privacy First'),
            _Dot(),
            _FooterBadge('VIT Authorized'),
          ],
        ),
      ],
    );
  }
}

class _FooterBadge extends StatelessWidget {
  final String text;
  const _FooterBadge(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: GoogleFonts.inter(
        fontSize: 10,
        fontWeight: FontWeight.w700,
        color: AppColors.outline,
        letterSpacing: 0.8,
      ),
    );
  }
}

class _Dot extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Container(
        width: 4,
        height: 4,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: AppColors.outlineVariant,
        ),
      ),
    );
  }
}
