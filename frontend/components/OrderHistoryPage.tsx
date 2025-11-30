// File: src/components/OrderHistoryPage.tsx (MỚI 100%)
import React from 'react';
import { Order, OrderStatus, CartItem } from '../types';

interface OrderHistoryPageProps {
  orders: Order[];
  onBack: () => void;
  onUpdateOrderStatus: (orderId: string, action: OrderStatus | 'CANCEL_USER') => void;
}

// --- Component phụ: Thanh theo dõi trạng thái ---
// (Giống hệt trong ảnh)
const StatusStepper: React.FC<{ currentStatus: OrderStatus }> = ({ currentStatus }) => {
  const steps: { status: OrderStatus; label: string }[] = [
    { status: 'PENDING_CONFIRMATION', label: 'Chờ xác nhận' },
    { status: 'PROCESSING', label: 'Đang xử lý' },
    { status: 'SHIPPING', label: 'Đang giao hàng' },
    { status: 'COMPLETED', label: 'Hoàn thành' },
  ];

  // Tìm vị trí của trạng thái hiện tại
  const currentIndex = steps.findIndex(step => step.status === currentStatus);

  // Nếu đã hủy/trả hàng, hiển thị trạng thái đặc biệt
  if (currentStatus === 'CANCELLED' || currentStatus === 'RETURNED') {
    return (
      <div className="flex justify-center items-center p-6 bg-gym-dark">
        <div className="flex flex-col items-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 mb-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          <span className="text-sm font-semibold uppercase">
            {currentStatus === 'CANCELLED' ? 'Đã hủy' : 'Đã trả hàng'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-start p-6 bg-gym-dark rounded-b-lg">
      {steps.map((step, index) => {
        // 'isActive' nếu index <= trạng thái hiện tại
        // (currentIndex = -1 nếu không tìm thấy, nên tất cả sẽ false)
        const isActive = index <= currentIndex;

        return (
          <div key={step.status} className="flex-1 flex flex-col items-center relative">
            {/* Dấu gạch nối (không hiển thị cho item cuối) */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-[14px] left-1/2 w-full h-0.5 ${isActive ? 'bg-gym-yellow' : 'bg-gray-700'
                  }`}
              />
            )}

            {/* Vòng tròn và icon */}
            <div
              className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full border-2 ${isActive
                  ? 'bg-gym-yellow border-gym-yellow'
                  : 'bg-gray-700 border-gray-700'
                }`}
            >
              {isActive && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-gym-darker"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            
            {/* Nhãn text */}
            <span
              className={`mt-2 text-center text-xs font-semibold uppercase ${isActive ? 'text-white' : 'text-gym-gray'
                }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};


// --- Component phụ: Thẻ trạng thái (badge) ---
const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles = {
    base: 'text-xs font-bold py-1 px-3 rounded-full',
    COMPLETED: 'bg-green-700 text-green-200', // "Hoàn thành"
    SHIPPING: 'bg-blue-700 text-blue-200',    // "Đang giao hàng"
    PROCESSING: 'bg-yellow-700 text-yellow-200', // "Đang xử lý"
    PENDING_CONFIRMATION: 'bg-gray-600 text-gray-200', // "Chờ xác nhận"
    CANCELLED: 'bg-red-700 text-red-200',      // "Đã hủy"
    RETURNED: 'bg-red-700 text-red-200',       // "Đã trả hàng"
  };

  const labels = {
    COMPLETED: 'Hoàn thành',
    SHIPPING: 'Đang giao hàng',
    PROCESSING: 'Đang xử lý',
    PENDING_CONFIRMATION: 'Chờ xác nhận',
    CANCELLED: 'Đã hủy',
    RETURNED: 'Đã trả hàng',
  };

  return (
    <span className={`${styles.base} ${styles[status] || styles.PENDING_CONFIRMATION}`}>
      {labels[status] || 'Không rõ'}
    </span>
  );
};

// --- Component phụ: 1 Dòng sản phẩm trong đơn hàng ---
const OrderItemRow: React.FC<{ item: CartItem }> = ({ item }) => (
  <div className="flex items-center space-x-4 py-4 px-6">
    <img src={item.image} alt={item.productName} className="w-16 h-16 rounded-md object-cover" />
    <div className="flex-1">
      {/* Tên sản phẩm chính (theo ảnh) */}
      <p className="font-semibold text-white">{item.productName}</p>
      {/* Hiển thị tên biến thể (flavor, size) nếu có */}
      {item.name !== item.productName && (
         <p className="text-sm text-gym-gray">{item.name}</p>
      )}
      <p className="text-sm text-gym-gray">Số lượng: {item.quantity}</p>
    </div>
    <p className="font-semibold text-white">
      {/* Giá = đơn giá * số lượng */}
      {(item.price * item.quantity).toLocaleString('vi-VN')}₫
    </p>
  </div>
);

// --- Component chính: Trang Lịch sử đơn hàng ---
const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ orders, onBack, onUpdateOrderStatus }) => {
  
  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      onUpdateOrderStatus(orderId, 'CANCEL_USER');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <button onClick={onBack} className="text-sm text-gym-gray hover:text-gym-yellow mb-6">
        &larr; Quay lại
      </button>
      <h2 className="text-3xl font-bold text-white text-center mb-10 uppercase">
        Lịch sử đơn hàng
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gym-gray">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {orders.map(order => (
            <div key={order.id} className="bg-gym-dark-secondary rounded-lg shadow-lg overflow-hidden">
              
              {/* Header của thẻ đơn hàng */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-6 border-b border-gray-700">
                <div>
                  <p className="text-sm text-gym-gray">
                    Mã đơn hàng: <span className="text-lg font-bold text-gym-yellow">{order.id}</span>
                  </p>
                  <p className="text-sm text-gym-gray">Ngày đặt: {order.date}</p>
                </div>
                <div className="flex sm:flex-col sm:items-end items-center gap-x-4">
                  <StatusBadge status={order.status} />
                  <p className="text-2xl font-bold text-white mt-1">
                    {order.total.toLocaleString('vi-VN')}₫
                  </p>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="divide-y divide-gray-700">
                {order.items.map(item => (
                  <OrderItemRow key={item.variantId} item={item} />
                ))}
              </div>

              {/* Thanh theo dõi trạng thái */}
              <StatusStepper currentStatus={order.status} />

              {/* Nút Hủy đơn (chỉ hiển thị khi chờ xác nhận) */}
              {order.status === 'PENDING_CONFIRMATION' && (
                <div className="p-4 bg-gym-dark text-center">
                  <button 
                    onClick={() => handleCancelOrder(order.id)}
                    className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors"
                  >
                    Hủy đơn hàng
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;