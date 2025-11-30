// File: src/components/ProductCard.tsx (BỔ SUNG NẾU CHƯA CÓ)
import React from 'react';
import { Product } from '../types';
import { StarIcon } from '../constants'; // Import từ constants.tsx

interface ProductCardProps {
  product: Product;
  onProductSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductSelect }) => {
  return (
    <div 
      onClick={() => onProductSelect(product)}
      className="bg-gym-dark-secondary rounded-lg overflow-hidden group cursor-pointer shadow-lg transition-all duration-300 hover:shadow-gym-yellow/20"
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-48 md:h-56 object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        {product.oldPrice && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </span>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-gym-gray uppercase font-semibold">{product.brand}</span>
        <h3 className="text-white font-semibold text-sm md:text-base mt-1 h-12 md:h-14 overflow-hidden">
          {product.name}
        </h3>
        <div className="flex items-center mt-2">
          <div className="flex text-gym-yellow">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'text-gym-yellow' : 'text-gray-600'}`} />
            ))}
          </div>
          <span className="text-xs text-gym-gray ml-2">({product.reviews})</span>
        </div>
        <p className="text-gym-yellow font-bold text-lg md:text-xl mt-3">
          {product.price.toLocaleString('vi-VN')}₫
          {product.oldPrice && (
            <span className="text-sm text-gym-gray line-through ml-2">
              {product.oldPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;