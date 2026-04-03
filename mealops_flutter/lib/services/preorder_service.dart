import 'package:dio/dio.dart';
import 'api_client.dart';

class PreOrderService {
  static final Dio _dio = ApiClient.createDio();

  static Future<void> submitPreOrder(List<String> dishIds) async {
    await _dio.post('/api/preorders', data: {'dishIds': dishIds});
  }
}
