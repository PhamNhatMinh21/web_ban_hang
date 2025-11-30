// src/components/cart/CartSidebar.tsx
import React, { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, removeFromCart, updateQuantity, itemCount, total, loading, fetchCart } = useCart();

  // Tự động reload giỏ khi mở
  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, fetchCart]);

  const handleCheckout = () => {
    onCheckout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-gym-dark shadow-2xl z-50 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-gym-yellow">Giỏ hàng ({itemCount})</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-grow overflow-y-auto p-4">
          {loading ? (
            <p className="text-center text-gym-gray py-8">Đang tải giỏ hàng...</p>
          ) : cartItems.length === 0 ? (
            <p className="text-center text-gym-gray py-10">Giỏ hàng trống</p>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.variantId} className="flex gap-3 pb-3 border-b border-gray-800">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-white line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gym-gray">
                      {item.price.toLocaleString('vi-VN')}₫ x {item.quantity}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-600 rounded text-sm">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-gray-700"
                          disabled={loading}
                        >
                          −
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-gray-700"
                          disabled={loading}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-xs text-red-400 hover:text-red-300"
                        disabled={loading}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <footer className="p-4 border-t border-gray-700 space-y-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng:</span>
              <span className="text-gym-yellow">{total.toLocaleString('vi-VN')}₫</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-gym-yellow text-gym-darker font-bold py-3 rounded hover:bg-yellow-300 transition"
            >
              Thanh toán
            </button>
            <button
              onClick={onClose}
              className="w-full text-center text-gym-gray hover:text-white text-sm"
            >
              Tiếp tục mua sắm
            </button>
          </footer>
        )}
      </div>
    </>
  );
};

export default CartSidebar;