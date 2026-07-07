/**
 * 监控截帧模块（预留）
 *
 * 正式版实现思路：
 * 1. RTSP 协议：ffmpeg / node-rtsp-stream 定时截帧
 * 2. 海康威视：ISAPI / OpenAPI 抓拍接口
 * 3. 大华：SDK / HTTP 抓拍
 * 4. 萤石云：YS7 Open API 获取直播截图
 *
 * MVP 阶段请使用 /monitor 页面上传监控截图代替。
 */

export interface MonitorCaptureResult {
  frameDataUrls: string[];
  capturedAt: Date;
  cameraId: string;
  slotId: string;
}

/** @todo 接入真实监控流 */
export async function captureMonitorFrame(
  _cameraId: string,
  _slotId: string
): Promise<MonitorCaptureResult> {
  throw new Error(
    "监控截帧尚未接入，请使用 /monitor 页面上传截帧模拟"
  );
}

/** @todo 按作息表定时调度 */
export function scheduleMonitorCapture(): void {
  // cron: 12:00 lunch, 13:00 nap, 16:00 homework
}
