import { GoogleGenerativeAI } from '@google/generative-ai';
import { injectable } from 'inversify';

@injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  // Test basic chat
  async testChat(message: string) {
    try {
      console.log('🔍 Testing Gemini API with message:', message);
      
      const result = await this.model.generateContent(message);
      const response = await result.response;
      const text = response.text();
      
      console.log('📝 Full response object:', {
        candidates: response.candidates,
        promptFeedback: response.promptFeedback,
        usageMetadata: response.usageMetadata
      });

      return {
        text,
        fullResponse: response,
        candidates: response.candidates,
        usageMetadata: response.usageMetadata
      };
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      throw error;
    }
  }

  // Test chat with history
  async testChatWithHistory(messages: Array<{role: string, content: string}>) {
    try {
      console.log('🔍 Testing Gemini API with history:', messages);

      const chat = this.model.startChat({
        history: messages.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))
      });

      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      const text = response.text();

      console.log('📝 Chat response:', {
        text,
        candidates: response.candidates,
        usageMetadata: response.usageMetadata
      });

      return {
        text,
        fullResponse: response,
        chatHistory: await chat.getHistory()
      };
    } catch (error) {
      console.error('❌ Gemini Chat Error:', error);
      throw error;
    }
  }

  // Generate response cho conversation
  async generateResponse(messages: Array<{role: string, content: string}>) {
    try {
      if (messages.length === 0) {
        throw new Error('No messages provided');
      }

      // Nếu chỉ có 1 message, dùng generateContent
      if (messages.length === 1) {
        const result = await this.model.generateContent(messages[0].content);
        const response = await result.response;
        return response.text();
      }

      // Nếu có nhiều message, dùng chat với history
      const history = messages.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const chat = this.model.startChat({ history });
      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('❌ Generate Response Error:', error);
      throw error;
    }
  }

  // Test streaming response
  async testStreamingChat(message: string) {
    try {
      console.log('🔍 Testing Streaming Gemini API with message:', message);

      const result = await this.model.generateContentStream(message);
      let text = '';
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log('📦 Chunk received:', chunkText);
        text += chunkText;
      }

      console.log('✅ Final streamed text:', text);
      return { text, isStreaming: true };
    } catch (error) {
      console.error('❌ Streaming Error:', error);
      throw error;
    }
  }
} 