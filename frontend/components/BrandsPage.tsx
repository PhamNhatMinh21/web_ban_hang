import React from 'react';
import { Brand } from '../types';

interface BrandsPageProps {
  brands: Brand[];
  onBack: () => void;
  onBrandSelect: (brandName: string) => void;
}

const BrandsPage: React.FC<BrandsPageProps> = ({ brands, onBack, onBrandSelect }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <button onClick={onBack} className="text-sm text-gym-gray hover:text-gym-yellow mb-8">
        &larr; Quay lại trang chủ
      </button>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold uppercase text-white tracking-wider">Thương hiệu nổi bật</h1>
        <p className="text-gym-gray mt-2">Các thương hiệu thực phẩm bổ sung hàng đầu thế giới, được tin dùng bởi các vận động viên chuyên nghiệp.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {brands.map(brand => (
          <div 
            key={brand.id}
            onClick={() => onBrandSelect(brand.name)}
            className="bg-gym-dark p-6 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-gym-yellow/20 cursor-pointer"
          >
            <img 
              src={brand.logo} 
              alt={brand.name} 
              className="max-h-16 w-full object-contain grayscale hover:grayscale-0 transition-all duration-300" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsPage;