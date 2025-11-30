import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, onProductSelect }) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-white tracking-wider mb-6">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
