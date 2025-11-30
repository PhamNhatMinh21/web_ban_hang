
import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="bg-gym-dark rounded-lg overflow-hidden group">
      <div className="overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center text-xs text-gym-gray mb-2">
          <span>{article.category.toUpperCase()}</span>
          <span>{article.date}</span>
        </div>
        <h3 className="font-bold text-white text-lg mb-2 h-14 overflow-hidden group-hover:text-gym-yellow transition-colors">
          <a href="#">{article.title}</a>
        </h3>
        <p className="text-sm text-gym-gray mb-4 h-20 overflow-hidden">{article.snippet}</p>
        <a href="#" className="font-semibold text-gym-yellow text-sm hover:underline">Đọc thêm &rarr;</a>
      </div>
    </div>
  );
};

export default ArticleCard;
