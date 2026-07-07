import type { MealCategory, SceneType } from "@/types";

const MEAL_CATEGORY_LABELS: Record<MealCategory, string> = {
  lunch: "午饭",
  dinner: "晚饭",
  snack: "点心/零食",
  breakfast: "早餐",
  fruit: "水果",
};

function buildMealPrompt(mealCategory: MealCategory | null, imageCount: number): string {
  const mealLabel = mealCategory
    ? MEAL_CATEGORY_LABELS[mealCategory]
    : "餐食";

  const imageHint =
    imageCount > 1
      ? `用户上传了 ${imageCount} 张图片，请综合所有图片内容进行描述。`
      : "请根据图片内容进行描述。";

  return `你是一位午托班老师的家校沟通助手。请根据图片内容，为「${mealLabel} · 食安与营养播报」场景撰写 3 段发给家长微信的汇报文案。

${imageHint}

要求：
1. 先观察图片中的食材、菜品、就餐环境等细节，文案要贴合画面，不要编造图片里没有的内容
2. 文案中可自然提及这是「${mealLabel}」相关内容
3. 分别用以下 3 种语气各写一段：专业严谨、温柔亲切、活泼幽默
4. 每段 80-150 字，适合老师直接转发给家长
5. 语气自然，有温度，避免空洞套话

请严格以 JSON 格式返回，不要包含其他说明文字：
{
  "options": [
    { "tone": "professional", "toneLabel": "专业严谨", "content": "..." },
    { "tone": "warm", "toneLabel": "温柔亲切", "content": "..." },
    { "tone": "playful", "toneLabel": "活泼幽默", "content": "..." }
  ]
}`;
}

function buildActivityPrompt(imageCount: number): string {
  const imageHint =
    imageCount > 1
      ? `用户上传了 ${imageCount} 张图片，请综合所有图片内容进行描述。`
      : "请根据图片内容进行描述。";

  return `你是一位午托班老师的家校沟通助手。请根据图片内容，为「课堂与午休剪影」场景撰写 3 段发给家长微信的汇报文案。

${imageHint}

要求：
1. 先观察图片中的学习、活动、午休等场景细节，文案要贴合画面，不要编造图片里没有的内容
2. 分别用以下 3 种语气各写一段：专业严谨、温柔亲切、活泼幽默
3. 每段 80-150 字，适合老师直接转发给家长
4. 语气自然，有温度，避免空洞套话；注意保护儿童隐私，不要描述可识别个人身份的信息

请严格以 JSON 格式返回，不要包含其他说明文字：
{
  "options": [
    { "tone": "professional", "toneLabel": "专业严谨", "content": "..." },
    { "tone": "warm", "toneLabel": "温柔亲切", "content": "..." },
    { "tone": "playful", "toneLabel": "活泼幽默", "content": "..." }
  ]
}`;
}

export function buildAnalysisPrompt(
  type: SceneType,
  mealCategory: MealCategory | null,
  imageCount: number
): string {
  if (type === "meal") {
    return buildMealPrompt(mealCategory, imageCount);
  }
  return buildActivityPrompt(imageCount);
}

export function toImageUrl(imageData: string): string {
  if (imageData.startsWith("data:")) {
    return imageData;
  }
  return `data:image/jpeg;base64,${imageData}`;
}
