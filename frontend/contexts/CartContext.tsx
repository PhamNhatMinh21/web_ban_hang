// src/contexts/CartContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import api from '../lib/axios'; 
import { CartItem, User, UserResponse } from '../types'; 

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (sku: string, quantity: number) => Promise<void>; 
  removeFromCart: (variantId: number) => Promise<void>; 
  updateQuantity: (variantId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  total: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  currentUser: User | null; 
}

export const CartProvider: React.FC<CartProviderProps> = ({ children, currentUser }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart'); 
      setCartItems(res.data.items || []); 
    } catch (err: any) {
      console.error('Lỗi lấy giỏ hàng:', err.response?.data || err.message);
      setCartItems([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && currentUser) {
      fetchCart();
    } else if (!currentUser) {
      setCartItems([]);
    }
  }, [currentUser, fetchCart]);

  const addToCart = useCallback(async (sku: string, quantity: number = 1) => {
    try {
      // Backend của bạn dùng variantID, nhưng nó là SKU (string)
      await api.post('/cart/add', { variantID: sku, quantity: quantity }); 
      await fetchCart();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Không thể thêm vào giỏ');
    }
  }, [fetchCart]);

  const removeFromCart = useCallback(async (variantId: number) => {
    const item = cartItems.find(i => i.variantId === variantId);
    if (!item) {
        console.error("Không tìm thấy item để xóa");
        return; 
    }
    
    try {
      // Backend của bạn dùng SKU để xóa
      await api.delete(`/cart/remove/${item.sku}`); 
      await fetchCart(); 
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Không thể xóa');
    }
  }, [cartItems, fetchCart]); 

  const updateQuantity = useCallback(async (variantId: number, quantity: number) => {
    const item = cartItems.find(i => i.variantId === variantId);
    if (!item) {
        console.error("Không tìm thấy item để cập nhật");
        return;
    }

    if (quantity <= 0) {
      await removeFromCart(variantId);
      return;
    }
    
    try {
      // Backend của bạn dùng variantID (là SKU) để update
      await api.put('/cart/update', { variantID: item.sku, quantity: quantity }); 
      await fetchCart(); 
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Không thể cập nhật');
    }
  }, [cartItems, fetchCart, removeFromCart]); 

  // === SỬA LỖI Ở ĐÂY ===
  const clearCart = useCallback(async () => {
    try {
      // 1. GỌI API BACKEND ĐỂ XÓA GIỎ HÀNG
      // (Bạn cần tạo endpoint này, ví dụ: DELETE /api/v1/cart/clear)
      await api.delete('/cart/clear'); 
      
      // 2. Chỉ set mảng rỗng SAU KHI API thành công
      setCartItems([]);
    } catch (err: any) {
      console.error('Lỗi xóa giỏ:', err.response?.data || err.message);
      // Nếu API lỗi, CŨNG xóa ở frontend để người dùng không bị kẹt
      setCartItems([]);
    }
  }, []); 
  // === HẾT SỬA ===
  
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      total,
      loading,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};