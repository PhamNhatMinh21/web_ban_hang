// File: src/components/FeaturedProductsView.tsx

import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface FeaturedProductsViewProps {
    products: Product[];
    onProductUpdate?: (productId: number, request: any) => Promise<void>; 
}

const STORAGE_KEY = 'GYMSUP_FEATURED_IDS';

const FeaturedProductsView: React.FC<FeaturedProductsViewProps> = ({ products }) => {
    
    // Hàm helper lấy ID từ storage
    const getFeaturedIds = (): number[] => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    };

    const [localProducts, setLocalProducts] = useState<Product[]>([]);

    useEffect(() => {
        const featuredIds = getFeaturedIds();
        // Map dữ liệu và giữ nguyên thứ tự gốc, chỉ cập nhật trạng thái
        const mergedProducts = products.map(p => ({
            ...p,
            isFeatured: featuredIds.includes(p.id) 
        }));
        setLocalProducts(mergedProducts);
    }, [products]);

    const handleToggleFeatured = (productId: number, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        
        // 1. Cập nhật state (Giao diện)
        setLocalProducts(prev => prev.map(p => 
            p.id === productId ? { ...p, isFeatured: newStatus } : p
        ));

        // 2. Lưu vào LocalStorage
        const currentIds = getFeaturedIds();
        let newIds = [];
        if (newStatus) {
            if (!currentIds.includes(productId)) newIds = [...currentIds, productId];
            else newIds = currentIds;
        } else {
            newIds = currentIds.filter(id => id !== productId);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
    };
    
    // 👇 SỬA Ở ĐÂY: KHÔNG dùng .sort() theo trạng thái nổi bật nữa
    // Chỉ sắp xếp theo ID hoặc Tên để danh sách cố định, không bị nhảy lung tung khi bấm
    const displayList = [...localProducts].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Quản lý sản phẩm nổi bật</h1>
                <p className="text-[var(--admin-text-secondary)] mt-1">
                    Chọn sản phẩm nổi bật để hiển thị 
                </p>
            </header>

            <div className="bg-[var(--admin-bg-card)] p-6 rounded-2xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[var(--admin-text-secondary)] uppercase border-b border-[var(--admin-border-color)]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Sản phẩm</th>
                                <th scope="col" className="px-6 py-3">Trạng thái</th>
                                <th scope="col" className="px-6 py-3 text-right">Hiển thị nổi bật</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayList.map((product) => {
                                const isFeatured = !!product.isFeatured;
                                const statusText = isFeatured ? 'Đang nổi bật' : 'Không nổi bật';
                                const statusClass = isFeatured ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400';
                                
                                return (
                                    <tr key={product.id} className="border-b border-[var(--admin-border-color)] hover:bg-[var(--admin-bg-hover)]">
                                        <td className="px-6 py-4 font-medium flex items-center space-x-3">
                                            <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-md object-cover"/>
                                            <span>{product.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`}>
                                                {statusText}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={isFeatured} 
                                                    onChange={() => handleToggleFeatured(product.id, isFeatured)}
                                                    className="sr-only peer" 
                                                />
                                                <div className="w-11 h-6 bg-[var(--admin-text-secondary)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--admin-text-accent)]"></div>
                                            </label>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default FeaturedProductsView;