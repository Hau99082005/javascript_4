"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Hàm delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Danh sách models để thử
const models = ["gemini-1.5-pro", "gemini-pro", "gemini-1.5-flash"];

export async function runAi(prompt: string): Promise<string> {
  const maxRetries = 2;
  const timeoutMs = 30000; // 30 giây

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // Thử từng model
    for (const modelName of models) {
      try {
        // Tạo promise với timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout: Request took too long')), timeoutMs);
        });

        const aiPromise = (async () => {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const response = result.response;
          const text = await response.text();
          return text;
        })();

        // Race giữa AI và timeout
        const result = await Promise.race([aiPromise, timeoutPromise]);
        return result as string;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(`AI Error (model: ${modelName}, attempt ${attempt + 1}):`, error);
        
        // Nếu là lỗi 503, thử model khác
        if (error.status === 503) {
          console.log(`Model ${modelName} overloaded, trying next model...`);
          continue; // Thử model tiếp theo
        }
        
        // Nếu là lỗi khác và là lần cuối, trả về lỗi
        if (attempt === maxRetries && modelName === models[models.length - 1]) {
          if (error.message?.includes('Timeout')) {
            return "Xin lỗi, yêu cầu của bạn mất quá nhiều thời gian để xử lý. Vui lòng thử lại với câu hỏi ngắn gọn hơn.";
          }
          
          if (error.status === 429) {
            return "Bạn đã vượt quá giới hạn sử dụng AI. Vui lòng thử lại sau.";
          }
          
          if (error.status === 401) {
            return "Lỗi xác thực API. Vui lòng kiểm tra cấu hình.";
          }
          
          return "Có lỗi xảy ra khi xử lý yêu cầu AI. Vui lòng thử lại sau.";
        }
      }
    }
    
    // Nếu tất cả models đều lỗi và chưa phải lần cuối, đợi rồi thử lại
    if (attempt < maxRetries) {
      await delay(1000 * (attempt + 1)); // Đợi 1s, 2s, 3s...
    }
  }
  
  return "Tất cả các model AI hiện đang quá tải. Vui lòng thử lại sau vài phút.";
}