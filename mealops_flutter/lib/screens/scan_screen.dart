import 'dart:io';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';
import '../services/scan_service.dart';
import '../widgets/app_bar.dart';

class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen>
    with WidgetsBindingObserver {
  CameraController? _controller;
  List<CameraDescription>? _cameras;
  bool _initialized = false;
  bool _scanning = false;
  double _zoomLevel = 1.0;
  double _minZoom = 1.0;
  double _maxZoom = 5.0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initCamera();
  }

  Future<void> _initCamera() async {
    try {
      _cameras = await availableCameras();
      if (_cameras != null && _cameras!.isNotEmpty) {
        _controller = CameraController(
          _cameras!.first,
          ResolutionPreset.high,
          enableAudio: false,
        );
        await _controller!.initialize();
        _minZoom = await _controller!.getMinZoomLevel();
        _maxZoom = await _controller!.getMaxZoomLevel();
        if (mounted) setState(() => _initialized = true);
      }
    } catch (e) {
      // Camera not available (emulator etc.) — show placeholder
      if (mounted) setState(() => _initialized = false);
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _controller?.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (_controller == null || !_controller!.value.isInitialized) return;
    if (state == AppLifecycleState.inactive) {
      _controller?.dispose();
    } else if (state == AppLifecycleState.resumed) {
      _initCamera();
    }
  }

  Future<void> _capture() async {
    if (_scanning) return;
    setState(() => _scanning = true);

    try {
      ScanResult? result;
      if (_controller != null && _controller!.value.isInitialized) {
        final file = await _controller!.takePicture();
        result = await ScanService.identify(File(file.path));
      } else {
        // Demo mode on emulator
        await Future.delayed(const Duration(seconds: 2));
        result = ScanResult.demo();
      }

      if (mounted) {
        setState(() => _scanning = false);
        _showResultSheet(result!);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _scanning = false);
        _showResultSheet(ScanResult.demo());
      }
    }
  }

  void _showResultSheet(ScanResult result) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => _ResultSheet(result: result),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      extendBodyBehindAppBar: true,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(72),
        child: SmartMessAppBar(),
      ),
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Camera preview
          if (_initialized && _controller != null)
            CameraPreview(_controller!)
          else
            Container(
              color: Colors.black87,
              child: const Center(
                child: Icon(Icons.camera_alt_outlined,
                    color: Colors.white54, size: 80),
              ),
            ),
          // Dark overlay
          Container(color: Colors.black.withOpacity(0.2)),
          // Scan frame
          Center(child: _ScanFrame()),
          // Scanning indicator
          if (_scanning)
            Container(
              color: Colors.black.withOpacity(0.5),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircularProgressIndicator(color: AppColors.primaryContainer),
                    const SizedBox(height: 16),
                    Text('Identifying food...',
                        style: GoogleFonts.manrope(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w700)),
                  ],
                ),
              ),
            ),
          // Bottom controls
          Positioned(
            bottom: 100,
            left: 0,
            right: 0,
            child: Column(
              children: [
                // Zoom slider
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 40),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Row(
                      children: [
                        Text('1x',
                            style: GoogleFonts.inter(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.w700)),
                        Expanded(
                          child: SliderTheme(
                            data: SliderTheme.of(context).copyWith(
                              activeTrackColor: AppColors.primaryContainer,
                              thumbColor: AppColors.primaryContainer,
                              inactiveTrackColor: Colors.white.withOpacity(0.3),
                              trackHeight: 2,
                            ),
                            child: Slider(
                              value: _zoomLevel,
                              min: _minZoom,
                              max: _maxZoom,
                              onChanged: (v) {
                                setState(() => _zoomLevel = v);
                                _controller?.setZoomLevel(v);
                              },
                            ),
                          ),
                        ),
                        Text('${_maxZoom.toStringAsFixed(0)}x',
                            style: GoogleFonts.inter(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.w700)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                // Capture button
                GestureDetector(
                  onTap: _capture,
                  child: Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                            color: Colors.black.withOpacity(0.3),
                            blurRadius: 16)
                      ],
                    ),
                    padding: const EdgeInsets.all(5),
                    child: Container(
                      decoration: const BoxDecoration(
                        color: Colors.black,
                        shape: BoxShape.circle,
                      ),
                    ),
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

class _ScanFrame extends StatefulWidget {
  @override
  State<_ScanFrame> createState() => _ScanFrameState();
}

class _ScanFrameState extends State<_ScanFrame>
    with SingleTickerProviderStateMixin {
  late AnimationController _animCtrl;
  late Animation<double> _scanLineAnim;

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);
    _scanLineAnim = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _animCtrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const size = 270.0;
    const bracketLen = 40.0;
    const bracketThick = 4.0;
    const bracketColor = Color(0xFF91F78E);

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        children: [
          // Brackets
          Positioned(top: 0, left: 0, child: _Bracket(at: _BracketPos.topLeft, len: bracketLen, thick: bracketThick, color: bracketColor)),
          Positioned(top: 0, right: 0, child: _Bracket(at: _BracketPos.topRight, len: bracketLen, thick: bracketThick, color: bracketColor)),
          Positioned(bottom: 0, left: 0, child: _Bracket(at: _BracketPos.bottomLeft, len: bracketLen, thick: bracketThick, color: bracketColor)),
          Positioned(bottom: 0, right: 0, child: _Bracket(at: _BracketPos.bottomRight, len: bracketLen, thick: bracketThick, color: bracketColor)),
          // Scan line
          AnimatedBuilder(
            animation: _scanLineAnim,
            builder: (_, __) => Positioned(
              top: size * _scanLineAnim.value,
              left: 0,
              right: 0,
              child: Container(
                height: 2,
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: [
                    Colors.transparent,
                    bracketColor.withOpacity(0.8),
                    Colors.transparent
                  ]),
                  boxShadow: [BoxShadow(color: bracketColor.withOpacity(0.5), blurRadius: 6)],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

enum _BracketPos { topLeft, topRight, bottomLeft, bottomRight }

class _Bracket extends StatelessWidget {
  final _BracketPos at;
  final double len;
  final double thick;
  final Color color;

  const _Bracket({required this.at, required this.len, required this.thick, required this.color});

  @override
  Widget build(BuildContext context) {
    final top = at == _BracketPos.topLeft || at == _BracketPos.topRight;
    final left = at == _BracketPos.topLeft || at == _BracketPos.bottomLeft;
    return CustomPaint(
      size: Size(len, len),
      painter: _BracketPainter(
        isTop: top,
        isLeft: left,
        thickness: thick,
        color: color,
        radius: 8,
      ),
    );
  }
}

class _BracketPainter extends CustomPainter {
  final bool isTop, isLeft;
  final double thickness;
  final Color color;
  final double radius;

  _BracketPainter({
    required this.isTop,
    required this.isLeft,
    required this.thickness,
    required this.color,
    required this.radius,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = thickness
      ..strokeCap = StrokeCap.round;

    final w = size.width;
    final h = size.height;

    final path = Path();
    if (isTop && isLeft) {
      path.moveTo(0, h);
      path.lineTo(0, radius);
      path.arcToPoint(Offset(radius, 0), radius: Radius.circular(radius));
      path.lineTo(w, 0);
    } else if (isTop && !isLeft) {
      path.moveTo(0, 0);
      path.lineTo(w - radius, 0);
      path.arcToPoint(Offset(w, radius), radius: Radius.circular(radius));
      path.lineTo(w, h);
    } else if (!isTop && isLeft) {
      path.moveTo(0, 0);
      path.lineTo(0, h - radius);
      path.arcToPoint(Offset(radius, h), radius: Radius.circular(radius));
      path.lineTo(w, h);
    } else {
      path.moveTo(0, h);
      path.lineTo(w - radius, h);
      path.arcToPoint(Offset(w, h - radius), radius: Radius.circular(radius));
      path.lineTo(w, 0);
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _ResultSheet extends StatelessWidget {
  final ScanResult result;
  const _ResultSheet({required this.result});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle
          Container(
            width: 48,
            height: 6,
            decoration: BoxDecoration(
              color: AppColors.outlineVariant.withOpacity(0.4),
              borderRadius: BorderRadius.circular(999),
            ),
          ),
          const SizedBox(height: 20),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(result.foodName,
                        style: GoogleFonts.manrope(
                            fontSize: 24,
                            fontWeight: FontWeight.w800,
                            color: AppColors.onBackground)),
                    const SizedBox(height: 4),
                    Text.rich(TextSpan(
                      text: 'Estimated weight: ',
                      style: GoogleFonts.inter(
                          fontSize: 13, color: AppColors.onSurfaceVariant),
                      children: [
                        TextSpan(
                          text: '${result.weightEstimate.toStringAsFixed(0)}g',
                          style: GoogleFonts.inter(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: AppColors.primary),
                        ),
                      ],
                    )),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.primaryContainer.withOpacity(0.5),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  '${(result.confidence * 100).toStringAsFixed(0)}% MATCH',
                  style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: AppColors.onPrimaryContainer),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          // Macro grid
          Row(
            children: [
              Expanded(child: _MacroBox(label: 'PROTEIN', value: '${result.protein}g', color: AppColors.primary)),
              const SizedBox(width: 10),
              Expanded(child: _MacroBox(label: 'CARBS', value: '${result.carbs}g', color: AppColors.secondary)),
              const SizedBox(width: 10),
              Expanded(child: _MacroBox(label: 'FATS', value: '${result.fat}g', color: AppColors.tertiary)),
            ],
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => Navigator.of(context).pop(),
              icon: const Icon(Icons.add_task_rounded, size: 20),
              label: const Text('Add to my meal log'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: const StadiumBorder(),
                textStyle: GoogleFonts.manrope(
                    fontSize: 16, fontWeight: FontWeight.w700),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MacroBox extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  const _MacroBox({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Text(label,
              style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: AppColors.onSurfaceVariant,
                  letterSpacing: 0.5)),
          const SizedBox(height: 4),
          Text(value,
              style: GoogleFonts.manrope(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: color)),
        ],
      ),
    );
  }
}
