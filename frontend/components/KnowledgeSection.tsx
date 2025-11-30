// File: src/components/KnowledgeSection.tsx

import React from 'react';
import { Article } from '../types';

interface KnowledgeSectionProps {
  supplementArticles: Article[];
  nutritionArticles: Article[];
}

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  
  // 👇 ĐÃ SỬA: Lấy đúng trường 'url' trong dữ liệu
  const postLink = article.url || '#'; 
  
  // Kiểm tra xem link có phải là link ngoài (facebook, youtube...) không
  const isExternalLink = postLink.startsWith('http');

  return (
    <a 
      href={postLink}
      // Link ngoài thì mở tab mới, link nội bộ thì mở tab hiện tại
      target={isExternalLink ? "_blank" : "_self"}
      rel={isExternalLink ? "noopener noreferrer" : undefined}
      className="group block cursor-pointer bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition-all duration-300 hover:-translate-y-1 shadow-lg"
    >
      {/* Hình ảnh */}
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10"/>
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Nội dung */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider border border-yellow-500/30 px-2 py-1 rounded bg-yellow-500/10">
                {article.category}
            </span>
            <span className="text-xs text-gray-500">{article.date}</span>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {article.snippet}
        </p>

        <div className="text-sm font-bold text-gray-500 group-hover:text-white flex items-center gap-2 transition-colors">
            Đọc tiếp 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
        </div>
      </div>
    </a>
  );
};

const KnowledgeSection: React.FC<KnowledgeSectionProps> = ({ supplementArticles, nutritionArticles }) => {
  return (
    <section className="py-8 border-t border-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* CỘT 1 */}
        <div>
          <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-4">
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide">
                Kiến thức Supplement
            </h2>
            <button className="text-sm font-bold text-gym-gray hover:text-yellow-500 transition-colors">
                
            </button>
          </div>
          <div className="space-y-6">
            {supplementArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* CỘT 2 */}
        <div>
          <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-4">
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide">
                Kiến thức Dinh dưỡng
            </h2>
            <button className="text-sm font-bold text-gym-gray hover:text-yellow-500 transition-colors">
                
            </button>
          </div>
          <div className="space-y-6">
            {nutritionArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeSection;