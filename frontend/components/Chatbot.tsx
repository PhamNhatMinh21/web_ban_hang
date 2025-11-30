// File: src/components/Chatbot.tsx

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { allProducts, supplementArticles, nutritionArticles } from '../constants'; // Import dữ liệu shop để AI học

// 👇 Dán API Key của bạn vào đây (hoặc để trong file .env thì tốt hơn)
const API_KEY = process.env.GEMINI_API_KEY;

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Xin chào! Tôi là trợ lý AI của GymSup. Tôi có thể giúp gì cho bạn về các sản phẩm bổ sung?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // === CẤU HÌNH AI ===
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // Tạo ngữ cảnh (Context) cho AI hiểu về shop của bạn
  // Đây là bước quan trọng nhất để nó không trả lời linh tinh
  const SYSTEM_PROMPT = `
    Bạn là nhân viên tư vấn bán hàng nhiệt tình của shop "GymSup".
    
    Dưới đây là danh sách sản phẩm của shop:
    ${JSON.stringify(allProducts.map(p => ({ name: p.name, price: p.price, desc: p.description })))}

    Dưới đây là một số bài viết kiến thức:
    ${JSON.stringify([...supplementArticles, ...nutritionArticles].map(a => ({ title: a.title, snippet: a.snippet })))}

    Quy tắc trả lời:
    1. Chỉ tư vấn các sản phẩm có trong danh sách trên.
    2. Trả lời ngắn gọn, vui vẻ, dùng icon cho sinh động.
    3. Nếu khách hỏi cái gì không liên quan đến Gym/Supplement, hãy khéo léo từ chối và quay lại chủ đề chính.
    4. Đơn vị tiền tệ là VNĐ.
  `;

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Hiển thị tin nhắn người dùng ngay lập tức
    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Gọi API Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // Ghép ngữ cảnh + lịch sử chat (cơ bản) + câu hỏi mới
      const prompt = `
        ${SYSTEM_PROMPT}
        
        Khách hàng hỏi: "${userMsg.text}"
        Hãy trả lời khách hàng:
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // 3. Hiển thị câu trả lời của AI
      const botMsg: Message = { id: Date.now() + 1, text: text, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("Lỗi AI:", error);
      const errorMsg: Message = { id: Date.now() + 1, text: "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau!", sender: 'bot' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="bg-[#1a1a1a] border border-gray-700 w-80 h-96 rounded-xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-scale-in">
          {/* Header */}
          <div className="bg-gym-yellow p-3 flex justify-between items-center">
            <h3 className="font-bold text-gym-darker flex items-center gap-2">
              🤖 GymSup AI Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gym-darker hover:text-white font-bold text-xl">&times;</button>
          </div>

          {/* Body Chat */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gym-darker">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-gym-yellow text-gym-darker rounded-br-none' 
                    : 'bg-gray-700 text-white rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-400 p-2 rounded-lg text-xs italic">
                  GymSup AI đang nhập...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-[#1a1a1a] border-t border-gray-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Hỏi về Whey, Creatine..."
              className="flex-1 bg-gray-800 text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gym-yellow"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-gym-yellow text-gym-darker p-2 rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Nút tròn mở Chat */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gym-yellow w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 group relative"
        >
          <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full animate-ping"></span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gym-darker">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Chatbot;