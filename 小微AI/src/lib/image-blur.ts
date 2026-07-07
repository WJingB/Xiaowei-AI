/**
 * 客户端隐私模糊处理（演示用）
 * 真实环境可在 RTSP 截帧后、调用 API 前执行
 */
export async function applyPrivacyBlur(
  dataUrl: string,
  blurRadius = 6
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 不可用"));
        return;
      }
      ctx.filter = `blur(${blurRadius}px)`;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = dataUrl;
  });
}

export async function applyPrivacyBlurBatch(
  dataUrls: string[],
  enabled: boolean
): Promise<string[]> {
  if (!enabled) return dataUrls;
  return Promise.all(dataUrls.map((url) => applyPrivacyBlur(url)));
}
