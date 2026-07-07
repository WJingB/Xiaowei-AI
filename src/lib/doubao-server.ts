import type {
  CopyOption,
  DoubaoAnalysisResult,
  MealCategory,
  SceneType,
} from "@/types";
import { buildAnalysisPrompt, toImageUrl } from "@/lib/doubao-prompt";
import { buildMonitorAnalysisPrompt } from "@/lib/monitor-prompt";
import type { MonitorAnalysisMeta, MonitorSlotId } from "@/lib/monitor-config";

const ARK_API_URL =
  process.env.ARK_API_URL ??
  "https://ark.cn-beijing.volces.com/api/v3/responses";
const ARK_MODEL =
  process.env.ARK_MODEL ?? "doubao-seed-2-0-mini-260428";

interface ArkContentItem {
  type?: string;
  text?: string;
}

interface ArkOutputItem {
  type?: string;
  text?: string;
  content?: ArkContentItem[];
}

interface ArkResponse {
  status?: string;
  output?: ArkOutputItem[];
  error?: { message?: string };
}

interface ModelOption {
  tone: CopyOption["tone"];
  toneLabel: string;
  content: string;
}

interface ModelPayload {
  options: ModelOption[];
  analysis?: {
    detectedBehavior?: string;
    atmosphere?: string;
    qualityScore?: number;
    qualityPass?: boolean;
    summary?: string;
  };
}

function extractResponseText(data: ArkResponse): string {
  const chunks: string[] = [];

  for (const item of data.output ?? []) {
    if (item.type === "output_text" && item.text) {
      chunks.push(item.text);
    }

    for (const part of item.content ?? []) {
      if (
        (part.type === "output_text" || part.type === "text") &&
        part.text
      ) {
        chunks.push(part.text);
      }
    }
  }

  const text = chunks.join("\n").trim();
  if (!text) {
    throw new Error("模型未返回有效文本内容");
  }

  return text;
}

function parseModelJson(text: string): ModelPayload {
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fencedMatch?.[1] ?? text).trim();

  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("无法从模型响应中解析 JSON");
  }

  const parsed = JSON.parse(candidate.slice(start, end + 1)) as ModelPayload;

  if (!Array.isArray(parsed.options) || parsed.options.length === 0) {
    throw new Error("模型返回的 JSON 缺少 options 字段");
  }

  return parsed;
}

function normalizeOptions(
  options: ModelOption[],
  prefix: string
): CopyOption[] {
  const tones: CopyOption["tone"][] = ["professional", "warm", "playful"];

  return options.slice(0, 3).map((option, index) => {
    const tone = tones.includes(option.tone) ? option.tone : tones[index];
    return {
      id: `${prefix}-${tone}`,
      tone,
      toneLabel: option.toneLabel || ["专业严谨", "温柔亲切", "活泼幽默"][index],
      content: option.content.trim(),
    };
  });
}

function normalizeMonitorAnalysis(
  raw: ModelPayload["analysis"],
  slotId: MonitorSlotId
): MonitorAnalysisMeta {
  const score = Math.min(10, Math.max(1, raw?.qualityScore ?? 7));
  return {
    slotId,
    detectedBehavior: raw?.detectedBehavior?.trim() || "状态正常",
    atmosphere: raw?.atmosphere?.trim() || "秩序良好",
    qualityScore: score,
    qualityPass: raw?.qualityPass ?? score >= 8,
    summary: raw?.summary?.trim() || "托管状态良好",
  };
}

async function callDoubaoVision(
  imageDataList: string[],
  promptText: string
): Promise<string> {
  const apiKey = process.env.ARK_API_KEY;
  if (!apiKey) {
    throw new Error("未配置 ARK_API_KEY 环境变量");
  }

  if (imageDataList.length === 0) {
    throw new Error("缺少图片数据");
  }

  const imageContents = imageDataList.map((imageData) => ({
    type: "input_image" as const,
    image_url: toImageUrl(imageData),
  }));

  const response = await fetch(ARK_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ARK_MODEL,
      input: [
        {
          role: "user",
          content: [
            ...imageContents,
            { type: "input_text", text: promptText },
          ],
        },
      ],
      text: {
        format: { type: "json_object" },
      },
    }),
  });

  const data = (await response.json()) as ArkResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message ?? `豆包 API 请求失败 (${response.status})`
    );
  }

  return extractResponseText(data);
}

export async function analyzeImageWithDoubao(
  imageDataList: string[],
  type: SceneType,
  mealCategory: MealCategory | null = null
): Promise<DoubaoAnalysisResult> {
  const text = await callDoubaoVision(
    imageDataList,
    buildAnalysisPrompt(type, mealCategory, imageDataList.length)
  );
  const payload = parseModelJson(text);

  return {
    options: normalizeOptions(payload.options, type),
  };
}

export async function analyzeMonitorWithDoubao(
  imageDataList: string[],
  slotId: MonitorSlotId
): Promise<DoubaoAnalysisResult> {
  const text = await callDoubaoVision(
    imageDataList,
    buildMonitorAnalysisPrompt(slotId, imageDataList.length)
  );
  const payload = parseModelJson(text);

  return {
    options: normalizeOptions(payload.options, `monitor-${slotId}`),
    analysis: normalizeMonitorAnalysis(payload.analysis, slotId),
  };
}
