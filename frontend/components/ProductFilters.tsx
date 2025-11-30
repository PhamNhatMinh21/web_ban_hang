
import React from 'react';
import { StarIcon, ResetIcon } from '../constants';

interface ProductFiltersProps {
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  maxPriceBound: number;
  selectedRating: number;
  setSelectedRating: (rating: number) => void;
  showInStockOnly: boolean;
  setShowInStockOnly: (inStock: boolean) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

const RatingFilter: React.FC<{ selectedRating: number, onSelect: (rating: number) => void }> = ({ selectedRating, onSelect }) => {
    const [hoverRating, setHoverRating] = React.useState(0);
    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => onSelect(star === selectedRating ? 0 : star)}
                    className="focus:outline-none"
                    aria-label={`Filter by ${star} stars or more`}
                >
                    <StarIcon className={`w-6 h-6 transition-colors ${
                        (hoverRating >= star || selectedRating >= star) 
                        ? 'text-gym-yellow' 
                        : 'text-gray-600'
                    }`} />
                </button>
            ))}
        </div>
    );
};

const ProductFilters: React.FC<ProductFiltersProps> = ({
  maxPrice,
  setMaxPrice,
  maxPriceBound,
  selectedRating,
  setSelectedRating,
  showInStockOnly,
  setShowInStockOnly,
  onResetFilters,
  activeFilterCount,
}) => {
  return (
    <aside className="bg-gym-dark rounded-lg p-6 space-y-6 self-start sticky top-24">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold uppercase text-white">Bộ lọc</h3>
        {activeFilterCount > 0 && (
          <button 
            onClick={onResetFilters}
            className="flex items-center space-x-2 text-sm text-gym-gray hover:text-gym-yellow transition-colors"
          >
            <ResetIcon className="w-4 h-4" />
            <span>Xóa ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <label htmlFor="price-range" className="block text-sm font-semibold text-gym-gray mb-2">
          Giá tối đa: <span className="font-bold text-white">{maxPrice.toLocaleString('vi-VN')}₫</span>
        </label>
        <input
          id="price-range"
          type="range"
          min={0}
          max={maxPriceBound}
          step={50000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gym-yellow"
        />
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-semibold text-gym-gray mb-2">Đánh giá từ</label>
        <RatingFilter selectedRating={selectedRating} onSelect={setSelectedRating} />
      </div>

      {/* Availability Filter */}
      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showInStockOnly}
            onChange={(e) => setShowInStockOnly(e.target.checked)}
            className="h-5 w-5 rounded bg-gym-darker border-gray-600 text-gym-yellow focus:ring-gym-yellow focus:ring-offset-gym-dark"
          />
          <span className="text-white">Chỉ hiển thị hàng có sẵn</span>
        </label>
      </div>
    </aside>
  );
};

export default ProductFilters;
