// File: src/components/AddArticleModal.tsx

import React, { useState } from 'react';
import { Article } from '../types';

interface AddArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (article: Omit<Article, 'id' | 'date'>) => void;
}

const AddArticleModal: React.FC<AddArticleModalProps> = ({ isOpen, onClose, onAdd }) => {
    // State lưu dữ liệu form
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        url: '',
        image: '',
        snippet: ''
    });

    if (!isOpen) return null;

    const handleSubmit = () => {
        // Validate cơ bản
        if (!formData.title || !formData.category) {
            alert('Vui lòng nhập tiêu đề và chọn danh mục!');
            return;
        }
        
        // Gửi dữ liệu ra ngoài cho AdminPage xử lý
        onAdd(formData);
        
        // Reset form và đóng
        setFormData({ title: '', category: '', url: '', image: '', snippet: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Thêm kiến thức</h2>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-4">
                    {/* Tiêu đề */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Tiêu đề</label>
                        <input 
                            type="text" 
                            placeholder="ví dụ: Whey Protein là gì?" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    {/* Danh mục */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Danh mục</label>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="">Chọn một danh mục</option>
                            <option value="Kiến thức Supplement">Kiến thức Supplement</option>
                            <option value="Kiến thức Dinh dưỡng">Kiến thức Dinh dưỡng</option>
                        </select>
                    </div>

                    {/* Đường link */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Đường link</label>
                        <input 
                            type="text" 
                            placeholder="https://example.com/article-link" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                            value={formData.url}
                            onChange={e => setFormData({...formData, url: e.target.value})}
                        />
                    </div>

                    {/* Ảnh mô tả */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Ảnh mô tả</label>
                        <input 
                            type="text" 
                            placeholder="https://example.com/image.png" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                            value={formData.image}
                            onChange={e => setFormData({...formData, image: e.target.value})}
                        />
                    </div>

                    {/* Mô tả ngắn */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Mô tả</label>
                        <textarea 
                            rows={3}
                            placeholder="Viết mô tả ngắn..." 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
                            value={formData.snippet}
                            onChange={e => setFormData({...formData, snippet: e.target.value})}
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 border-t border-gray-100 flex justify-end items-center gap-3">
                    <button 
                        onClick={onClose}
                        className="font-bold text-gray-500 hover:text-gray-700 transition-colors px-4 py-2"
                    >
                        Hủy
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-orange-500/30"
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddArticleModal;