import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyBn2xgBTBBi5LHgDjRt5Pc3ubBAbBQpalI" });
import fs from "fs";
async function testBasicGeneration() {
  console.log('🔍 Test 1: Basic generation');
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    contents: "Xin chào! Tôi tên là Nam",
  });
  
  console.log('📝 Response:', response.text);
  console.log('📊 Usage:', response.usageMetadata);
  return response;
}

async function testChatSession() {
  console.log('\n🔍 Test 2: Chat Session (Built-in history management)');
  
  const chat = ai.chats.create({
    model: "gemini-2.5-flash-preview-05-20"
  });

  // Message 1
  console.log('\n💬 Message 1:');
  const response = await chat.sendMessage({
    message: "Tôi tên là Nam, tôi đang học JavaScript"
  });
  
  console.log('🤖 Response 1:', response.text);

  // Message 2 - Test memory 
  console.log('\n💬 Message 2 (test memory):');
  const response2 = await chat.sendMessage({
    message: "Bạn có nhớ tên tôi không?"
  });
  
  console.log('🤖 Response 2:', response2.text);

  // Check chat object structure
  console.log('\n📜 Chat object methods:');
  console.log('- Chat properties:', Object.getOwnPropertyNames(chat));
  console.log('- Chat prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(chat)));
  
  // Try to inspect the chat object 
  console.log('\n🔍 Chat object structure:');
  console.dir(chat, { depth: 2 });
  fs.writeFileSync('chat.json', JSON.stringify(chat, null, 2));

}

testChatSession();