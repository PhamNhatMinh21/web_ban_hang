import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface TrendingProductsProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const TrendingProducts: React.FC<TrendingProductsProps> = ({ products, onProductSelect }) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-white tracking-wider">Sản phẩm <span className="text-gym-yellow">Trending</span></h2>
       
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} />
        ))}
      </div>
    </section>
  );
};

export default TrendingProducts;
