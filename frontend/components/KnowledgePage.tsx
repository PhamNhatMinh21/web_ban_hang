
import React, { useState } from 'react';
import { Article } from '../types';
import ArticleCard from './ArticleCard';
import { supplementArticles, nutritionArticles } from '../constants';

interface KnowledgePageProps {
  onBack: () => void;
}

const KnowledgePage: React.FC<KnowledgePageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('all');
  const allArticles = [...supplementArticles, ...nutritionArticles];

  const filteredArticles = allArticles.filter(article => {
    if (activeTab === 'all') return true;
    if (activeTab === 'supplement') return article.category === 'Bổ Sung';
    if (activeTab === 'nutrition') return article.category === 'Dinh Dưỡng';
    return false;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <button onClick={onBack} className="text-sm text-gym-gray hover:text-gym-yellow mb-8">
        &larr; Quay lại trang chủ
      </button>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold uppercase text-white tracking-wider">Kiến thức</h1>
        <p className="text-gym-gray mt-2">Nâng cao hiểu biết về tập luyện và dinh dưỡng cùng GymSup.</p>
      </div>

      <div className="flex justify-center border-b border-gray-700 mb-8">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 font-bold transition-colors ${activeTab === 'all' ? 'text-gym-yellow border-b-2 border-gym-yellow' : 'text-gym-gray'}`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setActiveTab('supplement')}
          className={`px-6 py-2 font-bold transition-colors ${activeTab === 'supplement' ? 'text-gym-yellow border-b-2 border-gym-yellow' : 'text-gym-gray'}`}
        >
          Bổ Sung
        </button>
        <button
          onClick={() => setActiveTab('nutrition')}
          className={`px-6 py-2 font-bold transition-colors ${activeTab === 'nutrition' ? 'text-gym-yellow border-b-2 border-gym-yellow' : 'text-gym-gray'}`}
        >
          Dinh Dưỡng
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default KnowledgePage;
