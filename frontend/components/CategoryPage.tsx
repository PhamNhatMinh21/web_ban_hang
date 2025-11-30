import React, { useState, useMemo, useEffect } from 'react';
import { Product, SortOption } from '../types';
import { SORT_OPTIONS } from '../constants';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';

interface Category {
  id: number;
  name: string;
  parentId?: number;
}

interface CategoryPageProps {
  products: Product[];
  filterBy: { type: 'category' | 'brand'; value: string };
  onProductSelect: (product: Product) => void;
  onBack: () => void;
}

type SortOptionValue = 'default' | 'price-asc' | 'price-desc' | 'popularity';

// DỮ LIỆU CỨNG
const STATIC_CATEGORIES: Category[] = [
    { id: 1, name: 'Whey Protein' },
    { id: 3, name: 'Tăng cân' },
    { id: 4, name: 'Tăng sức mạnh' },
    { id: 5, name: 'Hỗ trợ sức khỏe' },
    { id: 6, name: 'Phụ kiện' },

    // Con của Whey
    { id: 7, name: 'Whey Protein Blend', parentId: 1 },
    { id: 8, name: 'Whey Protein Isolate', parentId: 1 },
    { id: 9, name: 'Hydrolyzed Whey', parentId: 1 },
    { id: 10, name: 'Vegan Protein', parentId: 1 },
    { id: 11, name: 'Protein Bar', parentId: 1 },
    { id: 15, name: 'Dạng bột', parentId: 1 },
    // Con của Tăng sức mạnh
    { id: 12, name: 'Pre-workout', parentId: 4 },
    { id: 13, name: 'BCAA / EAA', parentId: 4 },
    { id: 14, name: 'Creatine', parentId: 4 },
];

const CategoryPage: React.FC<CategoryPageProps> = ({ products, filterBy, onProductSelect, onBack }) => {
  const [allCategories] = useState<Category[]>(STATIC_CATEGORIES);
  
  // State lưu ID danh mục con đang chọn
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<number | null>(null);

  // 1. Xác định Category hiện tại (Object)
  const currentCategoryObj = useMemo(() => {
      if (filterBy.type !== 'category') return null;
      return allCategories.find(c => c.name === filterBy.value);
  }, [allCategories, filterBy.value]);

  // 2. Xác định Cha
  const parentCategory = useMemo(() => {
      if (!currentCategoryObj) return null;
      if (currentCategoryObj.parentId) {
          return allCategories.find(c => c.id === currentCategoryObj.parentId);
      }
      return currentCategoryObj;
  }, [currentCategoryObj, allCategories]);

  // =====================================================================
  // 👇👇👇 FIX NHANH: TỰ ĐỘNG CHỌN CON ĐẦU TIÊN 👇👇👇
  // =====================================================================
  useEffect(() => {
      if (currentCategoryObj) {
          // Trường hợp 1: Nếu URL đang là con (VD: Pre-workout) -> Chọn chính nó
          if (currentCategoryObj.parentId) {
              setActiveSubCategoryId(currentCategoryObj.id);
          } 
          // Trường hợp 2: Nếu URL là Cha (VD: Tăng sức mạnh) -> Tìm con đầu tiên để chọn
          else {
              const firstChild = allCategories.find(c => c.parentId === currentCategoryObj.id);
              if (firstChild) {
                  // Có con -> Chọn con đầu tiên luôn (Không để null nữa)
                  setActiveSubCategoryId(firstChild.id);
              } else {
                  // Không có con (VD: Phụ kiện) -> Thì đành chịu, để null
                  setActiveSubCategoryId(null);
              }
          }
      }
  }, [currentCategoryObj, allCategories]);
  // =====================================================================

  const subCategories = useMemo(() => {
    if (!parentCategory) return [];
    return allCategories.filter(c => c.parentId === parentCategory.id);
  }, [allCategories, parentCategory]);

  const displayTitle = useMemo(() => {
      if (activeSubCategoryId) {
          const sub = allCategories.find(c => c.id === activeSubCategoryId);
          if (sub) return sub.name;
      }
      return parentCategory?.name || filterBy.value;
  }, [activeSubCategoryId, allCategories, parentCategory, filterBy.value]);

  // Logic lọc sản phẩm đơn giản hóa
  const initialProducts = useMemo(() => {
    return products.filter(product => {
        if (filterBy.type === 'brand') {
            return product.brand === filterBy.value;
        }

        if (parentCategory) {
            // Nếu đang chọn Tab con (mà code trên đã ép buộc chọn rồi)
            if (activeSubCategoryId !== null) {
                // Ưu tiên 1: So khớp ID
                if (Number(product.categoryId) === activeSubCategoryId) return true;
                
                // Ưu tiên 2: So khớp tên (Dự phòng nếu backend chưa trả ID đúng)
                const subName = allCategories.find(c => c.id === activeSubCategoryId)?.name;
                if (subName && product.category === subName) return true;

                return false;
            }
            
            // Nếu vẫn lọt vào đây (trường hợp ko có con), lọc theo cha
            if (Number(product.categoryId) === parentCategory.id) return true;
            if (product.category === parentCategory.name) return true;
        }

        return product.category === filterBy.value;
    });
  }, [products, filterBy, parentCategory, activeSubCategoryId, allCategories]);

  // --- Logic Sort & Filter giữ nguyên ---
  const priceBounds = useMemo(() => {
    if (initialProducts.length === 0) return { min: 0, max: 5000000 };
    const prices = initialProducts.map(p => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [initialProducts]);

  const [maxPrice, setMaxPrice] = useState(priceBounds.max);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOptionValue>('default');

  const resetFilters = () => {
    setMaxPrice(priceBounds.max);
    setSelectedRating(0);
    setShowInStockOnly(false);
    setSortOption('default');
  };

  useEffect(() => {
    setMaxPrice(priceBounds.max);
  }, [priceBounds.max]);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = initialProducts.filter(product => {
      const priceMatch = product.price <= maxPrice;
      const ratingMatch = product.rating >= selectedRating;
      const stockMatch = !showInStockOnly || product.inStock;
      return priceMatch && ratingMatch && stockMatch;
    });

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'popularity': return b.reviews - a.reviews;
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        default: return 0;
      }
    });
  }, [initialProducts, maxPrice, selectedRating, showInStockOnly, sortOption]);

  const activeFilterCount = (maxPrice < priceBounds.max ? 1 : 0) + (selectedRating > 0 ? 1 : 0) + (showInStockOnly ? 1 : 0);

  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <button onClick={onBack} className="text-sm text-gym-gray hover:text-gym-yellow mb-8 flex items-center gap-1">
        <span>&larr;</span> Quay lại trang chủ
      </button>
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold uppercase text-white tracking-wider drop-shadow-md transition-all duration-300">
            {displayTitle}
        </h1>
      </div>

      {filterBy.type === 'category' && subCategories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-10">
              {/* Đã xóa nút "Tất cả" để tránh lỗi, chỉ hiện các con */}
              {subCategories.map(sub => (
                  <button 
                      key={sub.id}
                      onClick={() => setActiveSubCategoryId(sub.id)}
                      className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border-2 ${
                          activeSubCategoryId === sub.id 
                          ? 'bg-gym-yellow border-gym-yellow text-gym-darker shadow-[0_0_15px_rgba(255,215,0,0.4)] scale-105' 
                          : 'bg-transparent border-gray-700 text-gray-400 hover:border-gym-yellow hover:text-white'
                      }`}
                  >
                      {sub.name}
                  </button>
              ))}
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilters
            maxPrice={maxPrice} setMaxPrice={setMaxPrice} maxPriceBound={priceBounds.max}
            selectedRating={selectedRating} setSelectedRating={setSelectedRating}
            showInStockOnly={showInStockOnly} setShowInStockOnly={setShowInStockOnly}
            onResetFilters={resetFilters} activeFilterCount={activeFilterCount}
          />
        </div>

        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
            <p className="text-sm text-gym-gray mb-2 sm:mb-0">
              Hiển thị <span className="font-bold text-white">{filteredAndSortedProducts.length}</span> sản phẩm
            </p>
            <div className="flex items-center space-x-3">
              <label htmlFor="sort-by" className="text-sm text-gym-gray font-medium">Sắp xếp:</label>
              <select
                id="sort-by"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOptionValue)}
                className="bg-gym-darker border border-gray-600 rounded-lg py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:border-gym-yellow appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} />
              ))}
            </div>
          ) : (
            <div className="bg-[#1a1a1a] rounded-xl p-16 text-center border border-gray-800 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-400 max-w-xs mx-auto">
                  Rất tiếc, không có sản phẩm nào khớp với bộ lọc hiện tại.
              </p>
              <button onClick={resetFilters} className="mt-6 text-gym-yellow font-bold hover:underline">
                  Xóa bộ lọc & Thử lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;