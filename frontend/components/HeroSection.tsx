// File: src/components/HeroSection.tsx (MỚI hoặc THAY THẾ)
import React, { useState, useEffect } from 'react';
import { Product } from '../types';

// SVG Icon cho nút "Xem Ngay"
const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

// Định nghĩa 'slide' trông như thế nào
export interface HeroSlide {
  product: Product;
  categoryLabel: string; // "OPTIMUM NUTRITION"
  title: string;         // "Optimum Nutrition Gold Standard..."
  backgroundImage: string;
}

// Props mà HeroSection sẽ nhận từ HomePage
interface HeroSectionProps {
  slides: HeroSlide[];
  onProductSelect: (product: Product) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ slides, onProductSelect }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Tự động chuyển slide sau mỗi 5 giây
  useEffect(() => {
    // Chỉ chạy timer nếu có nhiều hơn 1 slide
    if (slides.length <= 1) return;

    const timer = setTimeout(() => {
      const nextSlide = (currentSlide + 1) % slides.length;
      setCurrentSlide(nextSlide);
    }, 5000); // 5 giây

    return () => clearTimeout(timer); // Xóa timer khi component unmount
  }, [currentSlide, slides.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-gym-dark flex items-center justify-center">
        <p className="text-gym-gray">Đang tải slide...</p>
      </div>
    );
  }

  const activeSlide = slides[currentSlide];

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] bg-gym-darker overflow-hidden">
      {/* Lớp chứa các slide (dùng để tạo hiệu ứng mờ) */}
      <div
        className="relative w-full h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slide.backgroundImage})`,
              left: `${index * 100}%`
            }}
          />
        ))}
      </div>

      {/* Lớp phủ màu đen để làm nổi bật chữ */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Lớp chứa nội dung (text, nút) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        {/* Chúng ta dùng key={activeSlide.product.id} để buộc React re-render và chạy animation */}
        <h3 key={`${activeSlide.product.id}-cat`} className="text-sm font-bold text-gym-yellow uppercase tracking-widest mb-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {activeSlide.categoryLabel}
        </h3>
        <h1 key={`${activeSlide.product.id}-title`} className="text-3xl md:text-5xl font-extrabold text-white tracking-wider max-w-3xl mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {activeSlide.title}
        </h1>
        <button
          key={`${activeSlide.product.id}-btn`}
          onClick={() => onProductSelect(activeSlide.product)}
          className="flex items-center justify-center gap-2 bg-gym-yellow text-gym-darker font-bold py-3 px-8 rounded-md hover:bg-yellow-300 transition-colors animate-fade-in-up"
          style={{ animationDelay: '300ms' }}
        >
          Xem Ngay
          {/* <ArrowRightIcon className="w-5 h-5" /> */}
        </button>
      </div>

      {/* Dấu chấm (Slider Dots) - Giống hệt trong ảnh */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-gym-yellow scale-110' : 'bg-gray-500 opacity-50 hover:opacity-80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;