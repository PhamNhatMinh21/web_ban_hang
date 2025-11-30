import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface FlashSaleProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const FlashSaleCard: React.FC<{ product: Product, onProductSelect: (product: Product) => void }> = ({ product, onProductSelect }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const percentageSold = product.sold && product.total ? (product.sold / product.total) * 100 : 0;
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from firing
    if (isAdding) return;
    setIsAdding(true);
    addToCart({ ...product, quantity: 1 });
    setTimeout(() => setIsAdding(false), 1000);
  }

  return (
    <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 p-2">
      <div 
        onClick={() => onProductSelect(product)}
        className="bg-gym-dark rounded-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:shadow-gym-yellow/20 h-full cursor-pointer"
      >
        <div className="relative overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0}%
          </span>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-white text-base mb-2 flex-grow h-12">{product.name}</h3>
          <div className="flex items-baseline space-x-2 mb-3">
            <p className="text-lg font-bold text-gym-yellow">{product.price.toLocaleString('vi-VN')}₫</p>
            {product.oldPrice && (
              <p className="text-sm text-gym-gray line-through">{product.oldPrice.toLocaleString('vi-VN')}₫</p>
            )}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-3 relative overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 h-4 rounded-full" style={{ width: `${percentageSold}%` }}></div>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">Đã bán {product.sold}</span>
          </div>
          <button 
            onClick={handleAddToCartClick}
            disabled={isAdding}
            className={`mt-auto w-full bg-gym-yellow text-gym-darker font-bold py-2 rounded-md hover:bg-yellow-300 transition-colors duration-300 disabled:opacity-75 disabled:cursor-wait ${isAdding ? 'animate-cart-bump' : ''}`}
          >
            {isAdding ? 'Đã thêm!' : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </div>
  );
};

const FlashSale: React.FC<FlashSaleProps> = ({ products, onProductSelect }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 30, seconds: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      let { hours, minutes, seconds } = timeLeft;
      if (seconds > 0) {
        seconds--;
      } else if (minutes > 0) {
        seconds = 59;
        minutes--;
      } else if (hours > 0) {
        seconds = 59;
        minutes = 59;
        hours--;
      }
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <section className="bg-gym-dark rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-gym-yellow tracking-wider">Flash Sale</h2>
          <div className="flex items-center space-x-2">
            <span className="bg-white text-gym-dark font-bold text-lg px-2 py-1 rounded">{formatTime(timeLeft.hours)}</span>
            <span className="text-white font-bold">:</span>
            <span className="bg-white text-gym-dark font-bold text-lg px-2 py-1 rounded">{formatTime(timeLeft.minutes)}</span>
            <span className="text-white font-bold">:</span>
            <span className="bg-white text-gym-dark font-bold text-lg px-2 py-1 rounded">{formatTime(timeLeft.seconds)}</span>
          </div>
        </div>
        <a href="#" className="text-gym-yellow font-semibold hover:underline mt-2 md:mt-0">Xem tất cả</a>
      </div>
      <div className="flex overflow-x-auto -m-2 pb-4">
        {products.map(product => (
          <FlashSaleCard key={product.id} product={product} onProductSelect={onProductSelect} />
        ))}
      </div>
    </section>
  );
};

export default FlashSale;