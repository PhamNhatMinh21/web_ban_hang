// File: src/components/CheckoutPage.tsx

import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import api from '../lib/axios';
import { User } from '../types';

interface CheckoutPageProps {
  onBackToShop: () => void;
  onOrderSuccess: () => void;
  currentUser: User | null;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  onBackToShop, 
  onOrderSuccess, 
  currentUser 
}) => {
  const { cartItems, itemCount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');

  // State giả để hứng thông tin thẻ
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // 👇 LẤY DỮ LIỆU THẬT TỪ CURRENT USER 👇
  useEffect(() => {
    if (currentUser) {
      // 1. Lấy tên thật
      setFullName(currentUser.name);
      
      // 2. Lấy email thật (nếu không có thì để rỗng, TUYỆT ĐỐI KHÔNG tự chế example.com)
      setEmail(currentUser.email || ''); 
      
      // 3. Lấy sđt thật
      setPhone(currentUser.phone || ''); 
      
      console.log("Checkout User Info:", currentUser); // Bật F12 xem log này để check
    }
  }, [currentUser]); 

  const subtotal: number = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee: number = 0;
  const total: number = subtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);

    const itemsPayload = cartItems.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));

    const payload = {
      shippingFullName: fullName,
      shippingEmail: email, // Gửi email đang hiển thị trong ô input
      shippingPhoneNumber: phone,
      shippingStreet: street,
      shippingWard: ward,
      shippingDistrict: district,
      shippingCity: city,
      paymentMethod: paymentMethod === 'card' ? 'BANK_TRANSFER' : 'COD', 
      items: itemsPayload,
      couponCode: null, 
    };

    try {
      await api.post('/orders', payload);
      alert('Đặt hàng thành công!');
      await clearCart(); 
      onOrderSuccess(); 
    } catch (err: any) {
      console.error("Lỗi đặt hàng:", err);
      const message = err.response?.data?.message || err.response?.data || 'Đã xảy ra lỗi.';
      alert(`Lỗi: ${message}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const inputStyle = "w-full bg-gym-darker border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gym-yellow";
  const readOnlyInputStyle = "w-full bg-gym-dark border border-gray-700 rounded-md p-3 text-gray-400 focus:outline-none cursor-not-allowed";

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <button onClick={onBackToShop} className="text-sm text-gym-gray hover:text-gym-yellow mb-8">
        &larr; Quay lại cửa hàng
      </button>
      <h1 className="text-4xl font-extrabold text-white tracking-wider text-center mb-10">THANH TOÁN</h1>

      {itemCount === 0 ? (
        <div className="text-center bg-gym-dark p-10 rounded-lg">
          <p className="text-gym-gray text-lg">Giỏ hàng của bạn đang trống.</p>
          <button onClick={onBackToShop} className="mt-6 bg-gym-yellow text-gym-darker font-bold py-3 px-8 rounded-md hover:bg-yellow-300 transition-colors">
            Bắt đầu mua sắm
          </button>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-12 mt-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Shipping Details */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Thông tin giao hàng</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gym-gray mb-1">Họ và tên</label>
                  <input type="text" value={fullName} className={readOnlyInputStyle} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gym-gray mb-1">Email (Để nhận thông báo)</label>
                  {/* Ô Email này sẽ hiện giá trị thật, nếu vẫn ra example.com thì là do tài khoản của bạn đang có email đó */}
                  <input type="email" value={email} className={readOnlyInputStyle} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gym-gray mb-1">Số điện thoại</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputStyle} placeholder="09xxxxxxxx" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gym-gray mb-1">Số nhà, Tên đường</label>
                  <input type="text" value={street} onChange={e => setStreet(e.target.value)} className={inputStyle} placeholder="123 Đường ABC" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gym-gray mb-1">Phường / Xã</label>
                  <input type="text" value={ward} onChange={e => setWard(e.target.value)} className={inputStyle} placeholder="Phường 10" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gym-gray mb-1">Quận / Huyện</label>
                  <input type="text" value={district} onChange={e => setDistrict(e.target.value)} className={inputStyle} placeholder="Quận 5" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gym-gray mb-1">Tỉnh / Thành phố</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} className={inputStyle} placeholder="TP. Hồ Chí Minh" required />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Phương thức thanh toán</h2>
              <div className="mt-4 space-y-3">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-gym-yellow bg-gym-dark' : 'border-gray-700 bg-gym-darker'}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-5 w-5 text-gym-yellow bg-gym-darker border-gray-600 focus:ring-gym-yellow" />
                  <span className="ml-4 text-white font-semibold">Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-gym-yellow bg-gym-dark' : 'border-gray-700 bg-gym-darker'}`}>
                  <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-5 w-5 text-gym-yellow bg-gym-darker border-gray-600 focus:ring-gym-yellow" />
                  <span className="ml-4 text-white font-semibold">Thẻ Tín dụng / Ghi nợ (Visa/Mastercard)</span>
                </label>

                {/* FORM NHẬP THẺ */}
                {paymentMethod === 'card' && (
                  <div className="bg-gym-dark p-4 rounded-lg border border-gym-yellow/50 mt-3 space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-sm font-medium text-gym-gray mb-1">Số thẻ</label>
                      <input type="text" className={inputStyle} placeholder="0000 0000 0000 0000" required value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gym-gray mb-1">Tên trên thẻ</label>
                      <input type="text" className={inputStyle} placeholder="NGUYEN VAN A" required value={cardName} onChange={e => setCardName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gym-gray mb-1">Ngày hết hạn</label>
                        <input type="text" className={inputStyle} placeholder="MM / YY" required value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gym-gray mb-1">Mã bảo mật (CVV)</label>
                        <input type="password" className={inputStyle} placeholder="123" required value={cardCvv} onChange={e => setCardCvv(e.target.value)} />
                      </div>
                    </div>
                    <div className="text-xs text-yellow-500 italic mt-2">* Demo: Bạn có thể nhập thông tin giả để test.</div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column (Order Summary) */}
          <div className="lg:col-span-1">
            <aside className="bg-gym-dark rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Tóm tắt đơn hàng</h2>
              <ul className="space-y-4 my-4 max-h-64 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <li key={item.sku} className="flex items-center space-x-4">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <span className="absolute -top-2 -right-2 bg-gym-yellow text-gym-darker text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-white font-semibold text-sm">{item.name}</p>
                      <p className="text-gym-gray text-xs">
                        {item.flavor && `${item.flavor}`}
                        {item.flavor && item.size && ' - '}
                        {item.size && `${item.size}`}
                      </p>
                    </div>
                    <p className="text-white font-semibold text-sm">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gym-gray">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-gym-gray">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}₫`}</span>
                </div>
                <div className="flex justify-between text-white text-xl font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-gym-yellow">{total.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isPlacingOrder}
                className="w-full bg-gym-yellow text-gym-darker font-bold py-3 rounded-md hover:bg-yellow-300 transition-colors mt-6 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </aside>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckoutPage;