import React, { useState, useMemo, useEffect } from 'react';
import { Product, SortOption } from '../types';
import { SORT_OPTIONS } from '../constants';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';

interface CategorySectionProps {
  title: string;
  categoryKey: string;
  subCategories: string[];
  products: Product[];
  onProductSelect: (product: Product) => void;
  onCategorySelect: (category: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, categoryKey, subCategories, products, onProductSelect, onCategorySelect }) => {
  // Determine price bounds once from the initial product list
  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 5000000 };
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  // State for filters
  const [maxPrice, setMaxPrice] = useState(priceBounds.max);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('default');

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const priceMatch = product.price <= maxPrice;
      const ratingMatch = product.rating >= selectedRating;
      const stockMatch = !showInStockOnly || product.inStock;
      return priceMatch && ratingMatch && stockMatch;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'popularity':
          return b.reviews - a.reviews;
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return sorted;

  }, [products, maxPrice, selectedRating, showInStockOnly, sortOption]);

  const resetFilters = () => {
    setMaxPrice(priceBounds.max);
    setSelectedRating(0);
    setShowInStockOnly(false);
    setSortOption('default');
  };
  
  // Reset max price if products list changes
  useEffect(() => {
    setMaxPrice(priceBounds.max);
  }, [priceBounds.max]);

  const activeFilterCount =
    (maxPrice < priceBounds.max ? 1 : 0) +
    (selectedRating > 0 ? 1 : 0) +
    (showInStockOnly ? 1 : 0);

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold uppercase text-white tracking-wider mb-2">{title}</h2>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-2">
          {subCategories.map(sub => (
            <button 
        key={sub} 
        onClick={() => onCategorySelect(sub)} 
        className="text-gym-gray hover:text-gym-yellow transition-colors"
    >
        {sub}
    </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            maxPriceBound={priceBounds.max}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            showInStockOnly={showInStockOnly}
            setShowInStockOnly={setShowInStockOnly}
            onResetFilters={resetFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 bg-gym-dark p-3 rounded-lg">
            <p className="text-sm text-gym-gray mb-2 sm:mb-0">
              Hiển thị <span className="font-bold text-white">{filteredAndSortedProducts.length}</span> trên <span className="font-bold text-white">{products.length}</span> sản phẩm
            </p>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-by" className="text-sm text-gym-gray">Sắp xếp theo:</label>
              <select 
                id="sort-by"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-gym-darker border border-gray-600 rounded-md p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gym-yellow"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} />
              ))}
            </div>
          ) : (
            <div className="bg-gym-dark rounded-lg p-10 text-center text-gym-gray flex flex-col items-center justify-center min-h-[300px]">
                <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy sản phẩm</h3>
                <p>Vui lòng thử thay đổi hoặc xóa bộ lọc để xem thêm kết quả.</p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <button onClick={() => onCategorySelect(categoryKey)} className="bg-transparent border-2 border-gym-yellow text-gym-yellow font-bold py-2 px-8 rounded-full hover:bg-gym-yellow hover:text-gym-dark transition-colors">
              Xem tất cả sản phẩm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;