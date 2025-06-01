import { GoogleGenerativeAI } from '@google/generative-ai';

// Load env
const apiKey = process.env.GEMINI_API_KEY || 'your-api-key-here';

if (!apiKey || apiKey === 'your-api-key-here') {
  console.error('❌ Cần set GEMINI_API_KEY trong .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function testBasicChat() {
  console.log('🔍 Testing basic chat...');
  
  try {
    const prompt = "Xin chào! Bạn có thể giới thiệu về bản thân không?";
    console.log('📤 Sending message:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('\n📋 Response Structure:');
    console.log('===============================');
    console.log('📝 Text response:', text);
    console.log('\n🔍 Full response object:');
    console.log('- candidates:', response.candidates);
    console.log('- promptFeedback:', response.promptFeedback);
    console.log('- usageMetadata:', response.usageMetadata);
    
    // Check candidates structure
    if (response.candidates && response.candidates.length > 0) {
      console.log('\n🎯 First candidate structure:');
      console.log(JSON.stringify(response.candidates[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function testChatWithHistory() {
  console.log('\n\n🔍 Testing chat with history...');
  
  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Tôi tên là Nam, tôi đang học lập trình." }],
        },
        {
          role: "model", 
          parts: [{ text: "Xin chào Nam! Rất vui được gặp bạn. Bạn đang học lập trình ngôn ngữ nào?" }],
        },
      ],
    });

    const msg = "Bạn có thể nhớ tên tôi không?";
    console.log('📤 Sending message with history:', msg);
    
    const result = await chat.sendMessage(msg);
    const response = result.response;
    const text = response.text();
    
    console.log('\n📋 Response with history:');
    console.log('===============================');
    console.log('📝 Text response:', text);
    
    // Get full chat history
    const history = await chat.getHistory();
    console.log('\n📜 Chat history length:', history.length);
    console.log('📜 Latest messages:', history.slice(-2));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function testStreamingResponse() {
  console.log('\n\n🔍 Testing streaming response...');
  
  try {
    const prompt = "Hãy viết một câu chuyện ngắn về lập trình viên.";
    console.log('📤 Streaming message:', prompt);
    
    const result = await model.generateContentStream(prompt);
    let fullText = '';
    
    console.log('\n📋 Streaming chunks:');
    console.log('===============================');
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      process.stdout.write(chunkText);
      fullText += chunkText;
    }
    
    console.log('\n\n✅ Full streamed text length:', fullText.length);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Gemini API Tests...\n');
  
  await testBasicChat();
  await testChatWithHistory();
  await testStreamingResponse();
  
  console.log('\n✅ All tests completed!');
}

runAllTests(); 