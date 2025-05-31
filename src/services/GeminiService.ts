import { GoogleGenerativeAI } from '@google/generative-ai';
import { injectable } from 'inversify';
import { Message } from '../models/Conversation';

@injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }
    
    console.log('Initializing GeminiService with API key:', apiKey);
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Sử dụng model mới gemini-1.5-flash thay vì gemini-pro
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateResponse(messages: Message[]): Promise<string> {
    try {
      // Chuyển đổi messages thành format cho Gemini
      const history = this.convertMessagesToHistory(messages);
      
      // Tạo chat session với history
      const chat = this.model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });

      // Lấy message cuối cùng của user
      const lastUserMessage = messages
        .filter(msg => msg.role === 'user')
        .pop();

      if (!lastUserMessage) {
        throw new Error('No user message found');
      }

      const result = await chat.sendMessage(lastUserMessage.content);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate response from Gemini');
    }
  }

  async generateJSONResponse(messages: Message[], promptSuffix: string = ''): Promise<any> {
    const maxRetries = 3;
    let lastError: any = null;
    
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        // Chuyển đổi messages thành format cho Gemini
        const history = this.convertMessagesToHistory(messages);
        
        // Tạo chat session với history
        const chat = this.model.startChat({
          history: history,
          generationConfig: {
            maxOutputTokens: 8000,
            temperature: retry === 0 ? 0.1 : 0.3, // Giảm temperature ở lần đầu để ổn định hơn
          },
        });

        // Lấy message cuối cùng của user
        const lastUserMessage = messages
          .filter(msg => msg.role === 'user')
          .pop();

        if (!lastUserMessage) {
          throw new Error('No user message found');
        }

        // Thêm yêu cầu JSON vào prompt với hướng dẫn rõ ràng hơn
        const jsonPrompt = `${lastUserMessage.content}

${promptSuffix}

IMPORTANT INSTRUCTIONS:
- Return ONLY valid JSON format
- NO markdown code blocks (no \`\`\`json)
- NO additional explanatory text
- Ensure all quotes are properly escaped
- Ensure all brackets and braces are properly closed
- Use proper JSON syntax with commas between properties
- If content is too long, summarize but keep essential information
- Double-check JSON syntax before responding

EXAMPLE OF CORRECT FORMAT:
{
  "property1": "value1",
  "property2": ["item1", "item2"],
  "property3": {
    "nested": "value"
  }
}

RETURN ONLY THE JSON OBJECT:`;

        const result = await chat.sendMessage(jsonPrompt);
        const response = await result.response;
        let responseText = response.text();

        console.log(`Attempt ${retry + 1} - Raw response length:`, responseText.length);
        console.log(`Attempt ${retry + 1} - Raw response preview:`, responseText.substring(0, 200));

        // Làm sạch response text một cách kỹ lưỡng
        responseText = this.cleanJSONResponse(responseText);

        console.log(`Attempt ${retry + 1} - Cleaned response length:`, responseText.length);
        console.log(`Attempt ${retry + 1} - Cleaned response preview:`, responseText.substring(0, 200));

        // Cố gắng parse JSON
        try {
          const parsedJson = JSON.parse(responseText);
          console.log(`JSON parsing successful on attempt ${retry + 1}`);
          return parsedJson;
        } catch (parseError) {
          console.error(`Attempt ${retry + 1} - Initial JSON parse failed, attempting to fix...`);
          
          // Thử các phương pháp fix JSON
          const fixedJson = this.attemptJSONFix(responseText);
          if (fixedJson) {
            console.log(`JSON fix successful on attempt ${retry + 1}`);
            return fixedJson;
          }
          
          lastError = parseError;
          console.error(`Attempt ${retry + 1} - All JSON parse attempts failed`);
          
          // Nếu không phải lần thử cuối, tiếp tục
          if (retry < maxRetries - 1) {
            console.log(`Retrying... (${retry + 1}/${maxRetries})`);
            continue;
          }
        }
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${retry + 1} - Gemini API error:`, error);
        
        // Nếu không phải lần thử cuối, tiếp tục
        if (retry < maxRetries - 1) {
          console.log(`Retrying due to API error... (${retry + 1}/${maxRetries})`);
          continue;
        }
      }
    }
    
    // Nếu tất cả attempts đều thất bại, trả về error object
    const errorMessage = lastError instanceof Error ? lastError.message : String(lastError);
    console.error('All retry attempts failed');
    
    return {
      error: 'JSON parsing failed after retries',
      message: 'Không thể phân tích phản hồi từ AI sau nhiều lần thử. Vui lòng thử lại.',
      details: {
        parseError: errorMessage,
        attemptsCount: maxRetries,
        timestamp: new Date().toISOString()
      }
    };
  }

  private cleanJSONResponse(text: string): string {
    // Loại bỏ markdown code blocks
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Loại bỏ whitespace đầu và cuối
    text = text.trim();
    
    // Loại bỏ các ký tự không mong muốn ở đầu
    text = text.replace(/^[^{[\]]*/, '');
    
    // Tìm JSON object hoặc array đầu tiên
    const jsonStart = Math.min(
      text.indexOf('{') === -1 ? Infinity : text.indexOf('{'),
      text.indexOf('[') === -1 ? Infinity : text.indexOf('[')
    );
    
    if (jsonStart !== Infinity && jsonStart > 0) {
      text = text.substring(jsonStart);
    }
    
    return text;
  }

  private attemptJSONFix(text: string): any | null {
    const fixAttempts = [
      // Attempt 1: Try to find complete JSON object
      () => {
        const match = text.match(/\{[\s\S]*\}/);
        return match ? JSON.parse(match[0]) : null;
      },
      
      // Attempt 2: Try to fix unclosed braces
      () => {
        let fixed = text;
        const openBraces = (fixed.match(/\{/g) || []).length;
        const closeBraces = (fixed.match(/\}/g) || []).length;
        
        if (openBraces > closeBraces) {
          fixed += '}'.repeat(openBraces - closeBraces);
        }
        
        return JSON.parse(fixed);
      },
      
      // Attempt 3: Try to fix unclosed brackets
      () => {
        let fixed = text;
        const openBrackets = (fixed.match(/\[/g) || []).length;
        const closeBrackets = (fixed.match(/\]/g) || []).length;
        
        if (openBrackets > closeBrackets) {
          fixed += ']'.repeat(openBrackets - closeBrackets);
        }
        
        return JSON.parse(fixed);
      },
      
      // Attempt 4: Try to fix trailing comma
      () => {
        const fixed = text.replace(/,\s*([}\]])/g, '$1');
        return JSON.parse(fixed);
      },
      
      // Attempt 5: Fix quotes issues
      () => {
        let fixed = text;
        // Fix single quotes to double quotes
        fixed = fixed.replace(/'/g, '"');
        // Fix unescaped quotes in strings
        fixed = fixed.replace(/"([^"]*)"([^",}\]]*)"([^"]*)":/g, '"$1\\"$2\\"$3":');
        return JSON.parse(fixed);
      },
      
      // Attempt 6: Fix missing quotes around property names
      () => {
        let fixed = text;
        fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
        return JSON.parse(fixed);
      },
      
      // Attempt 7: Fix incomplete strings
      () => {
        let fixed = text;
        // Add closing quote if string is not closed
        fixed = fixed.replace(/"([^"]*?)$/gm, '"$1"');
        return JSON.parse(fixed);
      },
      
      // Attempt 8: Extract first valid JSON structure by parsing char by char
      () => {
        let braceCount = 0;
        let start = -1;
        let inString = false;
        let escapeNext = false;
        
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          
          if (escapeNext) {
            escapeNext = false;
            continue;
          }
          
          if (char === '\\') {
            escapeNext = true;
            continue;
          }
          
          if (char === '"' && !escapeNext) {
            inString = !inString;
            continue;
          }
          
          if (!inString) {
            if (char === '{') {
              if (braceCount === 0) {
                start = i;
              }
              braceCount++;
            } else if (char === '}') {
              braceCount--;
              if (braceCount === 0 && start !== -1) {
                const potentialJson = text.substring(start, i + 1);
                try {
                  return JSON.parse(potentialJson);
                } catch {
                  // Continue searching
                  start = -1;
                }
              }
            }
          }
        }
        
        return null;
      },
      
      // Attempt 9: Try to complete incomplete JSON by adding missing closing braces/brackets
      () => {
        let fixed = text;
        let braceCount = 0;
        let bracketCount = 0;
        let inString = false;
        let escapeNext = false;
        
        for (let i = 0; i < fixed.length; i++) {
          const char = fixed[i];
          
          if (escapeNext) {
            escapeNext = false;
            continue;
          }
          
          if (char === '\\') {
            escapeNext = true;
            continue;
          }
          
          if (char === '"' && !escapeNext) {
            inString = !inString;
            continue;
          }
          
          if (!inString) {
            if (char === '{') braceCount++;
            else if (char === '}') braceCount--;
            else if (char === '[') bracketCount++;
            else if (char === ']') bracketCount--;
          }
        }
        
        // Close any open strings
        if (inString) {
          fixed += '"';
        }
        
        // Close any open brackets/braces
        fixed += ']'.repeat(Math.max(0, bracketCount));
        fixed += '}'.repeat(Math.max(0, braceCount));
        
        return JSON.parse(fixed);
      }
    ];
    
    for (let i = 0; i < fixAttempts.length; i++) {
      try {
        const result = fixAttempts[i]();
        if (result) {
          console.log(`JSON fix successful with attempt ${i + 1}`);
          return result;
        }
      } catch (e) {
        console.log(`Fix attempt ${i + 1} failed:`, e instanceof Error ? e.message : e);
        continue;
      }
    }
    
    return null;
  }

  private convertMessagesToHistory(messages: Message[]) {
    return messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
  }
}