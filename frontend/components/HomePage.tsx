// File: src/components/HomePage.tsx

import React, { useEffect, useState } from 'react'; // Nhớ import useEffect, useState
import HeroSection, { HeroSlide } from './HeroSection';
import TrendingProducts from './TrendingProducts';
import CategorySection from './CategorySection';
import KnowledgeSection from './KnowledgeSection';
import { supplementArticles, nutritionArticles } from '../constants';
import { Product } from '../types';

interface HomePageProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onCategorySelect: (category: string) => void;
}

// Key phải giống hệt bên Admin
const STORAGE_KEY = 'GYMSUP_FEATURED_IDS';

const HomePage: React.FC<HomePageProps> = ({ products, onProductSelect, onCategorySelect }) => {
  
  // State để lưu danh sách sản phẩm nổi bật
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  useEffect(() => {
      // 1. Lấy danh sách ID từ LocalStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      const featuredIds: number[] = stored ? JSON.parse(stored) : [];

      // 2. Lọc sản phẩm
      let filtered = products.filter(p => featuredIds.includes(p.id));

      // 3. Fallback: Nếu chưa chọn gì thì lấy 4 cái đầu tiên
      if (filtered.length === 0) {
          filtered = products.slice(0, 4);
      } else {
          // Lấy tối đa 8 cái cho đẹp
          filtered = filtered.slice(0, 8);
      }

      setTrendingProducts(filtered);
  }, [products]); // Chạy lại khi danh sách products thay đổi

  // =======================================================
  // CÁC LOGIC KHÁC GIỮ NGUYÊN
  // =======================================================
  
  const wheyProducts = products.filter(p => 
      Number(p.categoryId) === 1 || Number(p.parentCategoryId) === 1
  ).slice(0, 8);

  const strengthProducts = products.filter(p => 
      Number(p.categoryId) === 4 || Number(p.parentCategoryId) === 4
  ).slice(0, 8);

  const heroSlides: HeroSlide[] = [];
  const slideProducts = products.slice(0, 4);

  slideProducts.forEach(p => {
      if (p) {
          heroSlides.push({
              product: p,
              categoryLabel: p.brand,
              title: p.name,
              backgroundImage: p.images[0] || 'https://via.placeholder.com/1920x600'
          });
      }
  });

  return (
    <>
      <HeroSection slides={heroSlides} onProductSelect={onProductSelect} />

      <div className="container mx-auto px-4 space-y-16 py-12">
        {/* Truyền biến trendingProducts đã được xử lý ở trên */}
        <TrendingProducts products={trendingProducts} onProductSelect={onProductSelect} />
        
        <CategorySection 
          title="WHEY PROTEIN"
          categoryKey="Whey Protein"
          subCategories={['Whey Protein Blend', 'Whey Protein Isolate', 'Hydrolyzed Whey', 'Vegan Protein', 'Protein Bar']}
          products={wheyProducts}
          onProductSelect={onProductSelect}
          onCategorySelect={onCategorySelect}
        />
        
        <CategorySection 
          title="TĂNG SỨC MẠNH"
          categoryKey="Tăng sức mạnh"
          subCategories={['Pre-workout', 'Creatine', 'BCAA / EAA']}
          products={strengthProducts}
          onProductSelect={onProductSelect}
          onCategorySelect={onCategorySelect}
        />
        
        <KnowledgeSection 
          supplementArticles={supplementArticles}
          nutritionArticles={nutritionArticles}
        />
      </div>
    </>
  );
};

export default HomePage;