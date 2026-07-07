import type { MonitorSlotId } from "@/lib/monitor-config";
import { MONITOR_SLOTS } from "@/lib/monitor-config";

const SLOT_PROMPT_CONTEXT: Record<
  MonitorSlotId,
  { sceneDesc: string; focusPoints: string }
> = {
  lunch: {
    sceneDesc: "午托班餐厅的正午监控画面",
    focusPoints:
      "识别孩子们是否在就餐、排队取餐或等待；评估就餐秩序（井然有序/安静用餐/情绪活跃等）；注意画面中的餐食与环境卫生",
  },
  nap: {
    sceneDesc: "午托班午休室的监控画面",
    focusPoints:
      "识别孩子们是否在休息、躺卧或安静活动；评估午休氛围（安静入睡/轻声活动/秩序良好等）；不要描述可识别个人身份的信息",
  },
  homework: {
    sceneDesc: "午托班教室的监控画面",
    focusPoints:
      "识别孩子们是否在写作业、阅读或参与活动；评估学习专注度与课堂秩序；不要描述可识别个人身份的信息",
  },
};

function buildMonitorSystemPrompt(
  slotId: MonitorSlotId,
  imageCount: number
): string {
  const slot = MONITOR_SLOTS[slotId];
  const ctx = SLOT_PROMPT_CONTEXT[slotId];

  const multiLensHint =
    imageCount > 1
      ? `本次提供了 ${imageCount} 张来自不同角度/连续抓拍的监控画面，请综合所有画面进行评估，给出最全面、最准确的状态判断。`
      : "请分析这张监控画面。";

  return `你现在是一位拥有10年经验的高级幼儿托管主理人，也是专业的托管质量督导员。
${multiLensHint}

监控场景：${ctx.sceneDesc}（${slot.location}，时段 ${slot.timeRange}）
分析重点：${ctx.focusPoints}

请完成以下任务：
1. 【质检员】识别画面中的主要行为状态
2. 【质检员】评估当前氛围与秩序（1-10 分，8 分及以上视为质量合格）
3. 【文案大师】基于以上观察，撰写 3 段发给家长微信的汇报文案

文案要求：
- 分别用以下 3 种语气：专业严谨、温柔亲切、活泼幽默
- 每段 60-100 字，亲切、让家长放心
- 不要提及「监控」「摄像头」「截图」等字眼，要像老师在现场亲眼所见一样自然
- 不要编造画面中没有的内容
- 保护儿童隐私，不做可识别个人的描述

请严格以 JSON 格式返回：
{
  "analysis": {
    "detectedBehavior": "识别到的主要行为（20字内）",
    "atmosphere": "氛围评估（15字内）",
    "qualityScore": 8,
    "qualityPass": true,
    "summary": "综合状态一句话摘要（30字内）"
  },
  "options": [
    { "tone": "professional", "toneLabel": "专业严谨", "content": "..." },
    { "tone": "warm", "toneLabel": "温柔亲切", "content": "..." },
    { "tone": "playful", "toneLabel": "活泼幽默", "content": "..." }
  ]
}`;
}

export function buildMonitorAnalysisPrompt(
  slotId: MonitorSlotId,
  imageCount: number
): string {
  return buildMonitorSystemPrompt(slotId, imageCount);
}

export function toImageUrl(imageData: string): string {
  if (imageData.startsWith("data:")) {
    return imageData;
  }
  return `data:image/jpeg;base64,${imageData}`;
}
