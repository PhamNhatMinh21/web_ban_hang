// File: src/components/KnowledgeManagementView.tsx

import React from 'react';
import { Article } from '../types';

interface KnowledgeManagementViewProps {
    supplementArticles: Article[];
    nutritionArticles: Article[];
    // 👇 THÊM DÒNG NÀY: Hàm xử lý khi bấm nút thêm
    onAddClick: () => void;
}

// ... (Giữ nguyên phần EditIcon, TrashIcon, ArticleTable) ...

const ArticleTable: React.FC<{ title: string, articles: Article[] }> = ({ title, articles }) => {
    // ... (Giữ nguyên code bảng) ...
    // (Chỉ lưu ý: Giữ nguyên code cũ của ArticleTable mình đã gửi)
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-gray-100">
            {/* ... nội dung bảng giữ nguyên ... */}
             <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 w-[40%]">Tiêu đề</th>
                            <th className="px-4 py-3 w-[35%]">Mô tả</th>
                            <th className="px-4 py-3 w-[15%]">Ngày đăng</th>
                            <th className="px-4 py-3 w-[10%]">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {articles.map((article) => (
                            <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={article.image} 
                                            alt={article.title} 
                                            className="w-16 h-10 rounded object-cover flex-shrink-0 border border-gray-200"
                                        />
                                        <span className="font-medium text-gray-900 line-clamp-2" title={article.title}>
                                            {article.title}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-gray-500">
                                    <p className="line-clamp-2" title={article.snippet}>{article.snippet}</p>
                                </td>
                                <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                                    {article.date}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <button className="text-yellow-500 hover:text-yellow-600 font-medium text-xs flex items-center gap-1">
                                            Sửa
                                        </button>
                                        <button className="text-red-500 hover:text-red-600 font-medium text-xs flex items-center gap-1">
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// 👇 Cập nhật component chính để nhận prop onAddClick
const KnowledgeManagementView: React.FC<KnowledgeManagementViewProps> = ({ supplementArticles, nutritionArticles, onAddClick }) => {
    return (
        <>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý kiến thức</h1>
                </div>
                {/* 👇 GẮN SỰ KIỆN onClick VÀO ĐÂY */}
                <button 
                    onClick={onAddClick}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Thêm kiến thức</span>
                </button>
            </header>

            <ArticleTable title="Kiến thức Supplement" articles={supplementArticles} />
            <ArticleTable title="Kiến thức Dinh dưỡng" articles={nutritionArticles} />
        </>
    );
};

export default KnowledgeManagementView;