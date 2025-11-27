
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface ModelImage {
  base64Data: string;
  mimeType: string;
}

export function constructPrompt(
  age: number,
  gender: string,
  pose: string,
  expression: string,
  ethnicity: string,
  scene: string,
  aspectRatio: string,
  facialFeatures: string[],
  hairstyle: string,
  hairColor: string,
  bodyType: string,
  shotType: string,
  height: number,
  hasCustomBackground: boolean,
  hasModelThumbnail: boolean
): string {
  const commonPromptParts = [
    `拍摄范围为${shotType}`,
    `姿势为${pose}`,
    expression !== '随机' ? `表情为${expression}` : '',
    `照片宽高比为${aspectRatio}`,
    '光线柔和',
    '专业时尚摄影风格，高画质，细节丰富'
  ];

  const customDetails: string[] = [];
  if (gender !== '随机') {
    customDetails.push(`性别为${gender}`);
  }
  if (facialFeatures.length > 0) {
    customDetails.push(`面部特征包括${facialFeatures.join('、')}`);
  }
  if (hairstyle !== '随机') {
    customDetails.push(`发型为${hairstyle}`);
  }
  if (hairColor !== '随机') {
    customDetails.push(`发色为${hairColor}`);
  }
  if (bodyType !== '随机') {
    customDetails.push(`体型为${bodyType}`);
  }
  customDetails.push(`身高约为${height}厘米`);
  
  const promptParts = [
    hasModelThumbnail ? '使用提供的模特图片作为人物外观参考，生成一张他们穿着所提供服装的写实图片' : '为提供的服装生成一张写实的模特图',
    hasCustomBackground ? '使用提供的背景图片作为背景' : `场景为${scene}`,
    ethnicity !== '随机' ? `模特为${ethnicity}` : '',
    `模特年龄约为${age}岁`,
    ...customDetails,
    '与服装风格匹配',
    ...commonPromptParts
  ].filter(Boolean);

  return promptParts.join('，') + '。';
}

// Helper to wait
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateModelImage(
  clothingBase64: string,
  clothingMimeType: string,
  age: number,
  gender: string,
  pose: string,
  expression: string,
  ethnicity: string,
  scene: string,
  aspectRatio: string,
  facialFeatures: string[],
  hairstyle: string,
  hairColor: string,
  bodyType: string,
  shotType: string,
  height: number,
  customBackground?: ModelImage,
  modelThumbnail?: ModelImage,
  numberOfVariations: number = 1,
  promptOverride?: string
): Promise<string[]> {
  const modelName = 'gemini-2.5-flash-image';
  const parts: any[] = [];

  // Add all images first. The model can infer context.
  if (modelThumbnail) {
    parts.push({ inlineData: { data: modelThumbnail.base64Data, mimeType: modelThumbnail.mimeType } });
  }
  if (customBackground) {
    parts.push({ inlineData: { data: customBackground.base64Data, mimeType: customBackground.mimeType } });
  }
  parts.push({ inlineData: { data: clothingBase64, mimeType: clothingMimeType } });
  
  const prompt = promptOverride || constructPrompt(
    age,
    gender,
    pose,
    expression,
    ethnicity,
    scene,
    aspectRatio,
    facialFeatures,
    hairstyle,
    hairColor,
    bodyType,
    shotType,
    height,
    !!customBackground,
    !!modelThumbnail
  );
  
  parts.push({ text: prompt });

  try {
    // Helper function to handle retries for 429/503 errors
    const generateWithRetry = async (index: number) => {
        // Stagger requests slightly if generating multiple variations to prevent immediate rate limiting
        // e.g., 0ms, 800ms, 1600ms
        if (index > 0 && numberOfVariations > 1) {
            await sleep(index * 800);
        }

        let attempt = 0;
        const maxRetries = 3;

        while (true) {
            try {
                return await ai.models.generateContent({
                    model: modelName,
                    contents: { parts },
                    config: { responseModalities: [Modality.IMAGE] },
                });
            } catch (error: any) {
                attempt++;
                const errorMessage = error.message || JSON.stringify(error);
                
                // Check for Rate Limits (429) or Service Unavailable (503)
                const isRateLimit = errorMessage.includes('429') || 
                                    errorMessage.includes('quota') || 
                                    errorMessage.includes('RESOURCE_EXHAUSTED') ||
                                    error.status === 429 || 
                                    error.code === 429;
                
                const isServerOverload = error.status === 503 || errorMessage.includes('503');

                if ((isRateLimit || isServerOverload) && attempt <= maxRetries) {
                    // Exponential backoff: 2s, 4s, 8s
                    const delay = 2000 * Math.pow(2, attempt - 1);
                    console.warn(`Gemini API Request ${index + 1} failed (Attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms. Reason: ${isRateLimit ? 'Rate Limit' : 'Server Error'}`);
                    await sleep(delay);
                    continue;
                }
                // If not retryable or max retries reached, throw original error
                throw error;
            }
        }
    };

    // Map requests to retry-enabled promises
    const generationPromises = Array.from({ length: numberOfVariations }).map((_, index) => 
        generateWithRetry(index)
    );

    const responses = await Promise.all(generationPromises);

    const generatedImages = responses.map(response => {
        const candidate = response.candidates?.[0];
        
        if (!candidate) {
             throw new Error('未收到生成结果。可能是因为提示词或图片触发了安全拦截。');
        }

        const reason = candidate.finishReason;

        // Check specifically for content existence and safety blocks
        const hasContent = candidate.content && candidate.content.parts && candidate.content.parts.length > 0;
        
        if (!hasContent) {
             if (reason === 'SAFETY') {
                 throw new Error('图片生成因安全策略被拦截。\n\n原因：Gemini 模型对人物生成（尤其是涉及未成年人形象或敏感内容）有严格限制。\n\n建议：\n1. 请将“模特年龄”调整为 18 岁。\n2. 避免过于暴露或敏感的描述。');
             }
             // "NO_IMAGE" or "OTHER" often indicates a silent refusal, frequently due to child safety policies
             if (reason && reason !== 'STOP') {
                 if (reason === 'NO_IMAGE' || reason === 'OTHER' || reason === 'RECITATION') {
                    throw new Error(`AI 拒绝了生成请求 (${reason})。\n\n原因：这通常是因为请求触发了儿童安全保护机制（即使您未明确要求）。\n\n解决方法：请务必将左侧的“模特年龄”设置为 18 岁，然后重试。`);
                 }
                 throw new Error(`生成未能完成，原因: ${reason}`);
             }
             // Sometimes the API returns success but empty content if filters are triggered silently
             throw new Error('API 返回了空的内容。这通常是由于安全策略拦截导致的。\n\n提示：请尝试将“模特年龄”调整为 18 岁。');
        }

        if (candidate.finishReason !== 'STOP' && candidate.finishReason) {
             console.warn('Finish reason:', candidate.finishReason);
             if (candidate.finishReason === 'SAFETY') {
                 throw new Error('图片生成因安全策略被拦截。请尝试将年龄调整为 18 岁。');
             }
        }

        for (const part of candidate.content.parts) {
            if (part.inlineData) {
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
            if (part.text) {
                // If the model returned text instead of an image, it's a refusal or explanation
                console.warn('Model returned text instead of image:', part.text);
                
                let errorMsg = `生成失败: AI 反馈 - ${part.text}`;
                // Check for keywords indicating safety refusals in the text response
                const textLower = part.text.toLowerCase();
                if (textLower.includes('child') || textLower.includes('minor') || textLower.includes('kid') || textLower.includes('safe') || textLower.includes('policy') || textLower.includes('guidelines')) {
                    errorMsg += '\n\n(提示: 模型检测到可能涉及未成年人或敏感内容。请尝试将年龄调整为 18 岁)';
                }
                throw new Error(errorMsg);
            }
        }
        
        throw new Error('Gemini API response contained no image data.');
    });

    return generatedImages;

  } catch (error) {
    console.error('Error calling Gemini API for image:', error);
    
    const err = error as any;
    const errorMessage = err.message || JSON.stringify(err);

    // Check for Quota Exceeded (429)
    if (
        errorMessage.includes('429') || 
        errorMessage.includes('quota') || 
        errorMessage.includes('RESOURCE_EXHAUSTED') || 
        err.status === 429 ||
        err.code === 429
    ) {
        throw new Error('API 调用配额已耗尽 (429)。系统已尝试自动重试但未成功。请稍后（约1分钟）再试。');
    }

    if (error instanceof Error) {
        // Pass through specific errors that we just threw above
        if (error.message.includes('生成失败') || error.message.includes('安全策略') || error.message.includes('API 返回了') || error.message.includes('AI 拒绝了')) {
            throw error;
        }
        
        if (error.message.includes('API key not valid')) {
            throw new Error('无效的 API 密钥。请检查您的配置。');
        }
    }
    throw new Error('无法从 Gemini API 生成图片。这可能是由于网络问题、配额限制或安全策略拦截。建议调整年龄设置为 18 岁后重试。');
  }
}
