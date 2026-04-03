import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../core/theme.dart';

class ShimmerCard extends StatelessWidget {
  final double height;
  final double? width;
  final double borderRadius;

  const ShimmerCard({
    super.key,
    this.height = 80,
    this.width,
    this.borderRadius = 16,
  });

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppColors.surfaceContainerHighest,
      highlightColor: AppColors.surfaceContainerLow,
      child: Container(
        height: height,
        width: width,
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(borderRadius),
        ),
      ),
    );
  }
}

class ShimmerDishCard extends StatelessWidget {
  const ShimmerDishCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppColors.surfaceContainerHighest,
      highlightColor: AppColors.surfaceContainerLow,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(height: 16, color: Colors.white, width: 140),
                  const SizedBox(height: 8),
                  Container(height: 12, color: Colors.white, width: 200),
                  const SizedBox(height: 8),
                  Container(height: 12, color: Colors.white, width: 100),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
class ShimmerHero extends StatelessWidget {
  const ShimmerHero({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          flex: 5,
          child: ShimmerCard(height: 200, borderRadius: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          flex: 5,
          child: Column(
            children: [
              ShimmerCard(height: 94, borderRadius: 16),
              const SizedBox(height: 12),
              ShimmerCard(height: 94, borderRadius: 16),
            ],
          ),
        ),
      ],
    );
  }
}
