// File: src/App.tsx

import React, { useState, useCallback, useEffect } from 'react';
import api from './lib/axios';
import { CartProvider } from './contexts/CartContext';
import BrandsPage from './components/BrandsPage';
import { 
    Product, Theme, User, Order, OrderStatus, CartItem, UserResponse, CreateProductRequest, PaymentStatus
} from './types';

import Header from './components/Header';
import Footer from './components/Footer'; 
import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';
import CategoryPage from './components/CategoryPage';
import CheckoutPage from './components/CheckoutPage';
import CartSidebar from './components/CartSidebar';
import AuthModal from './components/AuthModal';
import Chatbot from './components/Chatbot';
import { navLinks, brands } from './constants';
import AdminPage from './components/AdminPage';
import AccountPage from './components/AccountPage';
import OrderHistoryPage from './components/OrderHistoryPage';

// ====================================================================
// 1. MAP CATEGORY ID
const FE_CATEGORY_ID_MAP: Record<string, number> = {
    'Whey Protein': 1, 'Tăng cân': 3, 'Tăng sức mạnh': 4, 'Hỗ trợ sức khỏe': 5, 'Phụ kiện': 6,
    'Whey Protein Blend': 7, 'Whey Protein Isolate': 8, 'Hydrolyzed Whey': 9, 'Vegan Protein': 10, 'Protein Bar': 11, 'Dạng bột' : 15,
    'Pre-workout': 12, 'BCAA / EAA': 13, 'Creatine': 14,
};

// 2. MAP PARENT ID (Con -> Cha)
const CHILD_TO_PARENT_ID_MAP: Record<number, number> = {
    7: 1, 8: 1, 9: 1, 10: 1, 11: 1,
    12: 4, 13: 4, 14: 4,
};

// 3. MAP BRAND ID
const FE_BRAND_ID_MAP: Record<string, number> = {
    'Optimum Nutrition': 1, 'Myprotein': 2, 'Rule 1': 3, 'Applied Nutrition': 4,
    'Nutrabolt (C4)': 5, 'BPI Sports': 6, 'Thorne Research': 7, 'Nutrex': 8, 'Redcon1': 9, 'GymSup': 10,
    'ON': 1, 'Rule1': 3, 'C4': 5, 
};
// ====================================================================

const parseVariantName = (name: string): { flavor: string, size: string } => {
    const sizeRegex = /(\d+(\.\d+)?\s*(Lbs|kg|Servings))/i;
    const sizeMatch = name.match(sizeRegex);
    let size = "Standard";
    let flavor = name;
    if (sizeMatch && sizeMatch[0]) {
        size = sizeMatch[0].replace(/\s+/g, '');
        flavor = name.replace(sizeRegex, '').replace(/^Vị\s+/i, '').trim();
    } else {
         flavor = name.replace(/^Vị\s+/i, '').trim();
    }
    return { flavor: flavor || 'Default Flavor', size: size };
};

// === HÀM MAP SẢN PHẨM ===
const mapProductResponseToProduct = (res: any): Product => {
  const rawCategoryName = res.categoryName || res.category || 'Chưa phân loại';
  const mappedId = res.categoryId || FE_CATEGORY_ID_MAP[rawCategoryName] || 0;
  let mappedParentId = res.parentCategoryId;
  if (!mappedParentId) mappedParentId = CHILD_TO_PARENT_ID_MAP[mappedId];
  if (!mappedParentId) {
      const FE_PARENT_NAME_MAP: Record<string, number> = {
          'Whey Protein Blend': 1, 'Whey Protein Isolate': 1, 'Hydrolyzed Whey': 1, 'Vegan Protein': 1, 'Protein Bar': 1,
          'Pre-workout': 4, 'BCAA / EAA': 4, 'Creatine': 4,
      };
      mappedParentId = FE_PARENT_NAME_MAP[rawCategoryName];
  }
  const mappedVariants = (res.variants || []).map((v: any) => {
      const { flavor: parsedFlavor, size: parsedSize } = parseVariantName(v.name);
      return { 
          ...v, flavor: parsedFlavor, size: parsedSize, imageUrl: v.imageUrl,
          categoryId: mappedId, parentCategoryId: mappedParentId, oldPrice: v.salePrice 
      };
  });
  const allFlavors: string[] = [...new Set<string>(mappedVariants.map((v: any) => v.flavor as string).filter(Boolean))];
  const allSizes: string[] = [...new Set<string>(mappedVariants.map((v: any) => v.size as string).filter(Boolean))];
  const firstVariant = mappedVariants.length > 0 ? mappedVariants[0] : null;
  let finalImages: string[] = [];
  if (res.gallery?.length > 0) finalImages = res.gallery;
  else if (res.thumbnail) finalImages = [res.thumbnail];
  else if (res.imageUrls?.length > 0) finalImages = res.imageUrls;
  else if (res.images?.length > 0) finalImages = res.images;
  else if (res.imageUrl) finalImages = [res.imageUrl];
  else if (res.image) finalImages = [res.image];
  if (finalImages.length === 0) finalImages = [`https://placehold.co/400x400?text=No+Image`];

  const rawComments = res.reviews || res.comments || []; 
  const mappedComments = Array.isArray(rawComments) ? rawComments.map((c: any) => ({
      id: c.id || Math.random(),
      author: c.author || c.userName || c.user?.fullName || c.username || "Người dùng",
      rating: c.rating || 5,
      comment: c.content || c.comment || c.text || "",
      date: c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : "Vừa xong",
      avatar: c.avatar || `https://ui-avatars.com/api/?name=${c.author || "User"}&background=random`
  })) : [];
  const finalReviewsList = res.reviewList ? res.reviewList.map((r: any) => ({
      id: r.id, username: r.username, avatar: r.avatar, rating: r.rating, comment: r.comment, createdAt: r.createdAt
  })) : mappedComments; 
  const rawBrandName = res.brandName || res.brand || 'Chưa rõ';
  const mappedBrandId = res.brandId || FE_BRAND_ID_MAP[rawBrandName] || 0;

  return {
    id: res.productId || res.id, name: res.name, description: res.description,
    category: rawCategoryName, brand: rawBrandName, variants: mappedVariants, 
    price: firstVariant?.price || 0, oldPrice: firstVariant?.oldPrice, sku: firstVariant?.sku || 'N/A',
    inStock: (firstVariant?.stockQuantity || 0) > 0, stockQuantity: firstVariant?.stockQuantity || 0,
    images: finalImages, rating: res.averageRating || 0, reviews: res.totalReviews || finalReviewsList.length || 0,
    sold: 0, flavors: allFlavors, sizes: allSizes, categoryId: mappedId, parentCategoryId: mappedParentId, brandId: mappedBrandId,     
  };
};

// === 👇 HÀM MAP ĐƠN HÀNG (ĐÃ CẬP NHẬT ĐỂ SỬA LỖI MẤT EMAIL/SĐT) 👇 ===
const mapBackendOrderToFrontendOrder = (beOrder: any, currentUser: User | null): Order => {
  const mapPaymentStatus = (status: string): PaymentStatus => {
    if (status === 'PAID') return 'Đã thanh toán';
    return 'Chưa thanh toán'; 
  };
  
  const mapItems = (details: any[]): CartItem[] => {
    return details.map(d => {
      const { flavor: parsedFlavor, size: parsedSize } = parseVariantName(d.variantName || d.productName || 'Default Variant');
      return {
        variantId: d.variantId, productId: d.productId || 0, productName: d.productName || 'N/A', 
        name: d.variantName || d.productName, image: d.image || d.imageUrl || `https://placehold.co/400x400?text=Product`, 
        price: d.priceAtPurchase, quantity: d.quantity, sku: d.sku || 'N/A', size: parsedSize, flavor: parsedFlavor  
      };
    });
  };

  // 1. Vét cạn SĐT từ mọi nơi có thể (Thêm beOrder.phoneNumber và receiverPhone)
  const phoneRaw = 
      beOrder.shippingPhoneNumber || 
      beOrder.shippingPhone || 
      beOrder.phoneNumber ||          
      beOrder.receiverPhone ||        
      beOrder.phone ||               
      beOrder.user?.phoneNumber || 
      beOrder.user?.phone || 
      (currentUser?.role === 'USER' ? currentUser.phone : '') || 
      '';

  // 2. Vét cạn Email từ mọi nơi có thể (Thêm beOrder.email ở root)
  const emailRaw = 
      beOrder.shippingEmail || 
      beOrder.email ||               
      beOrder.user?.email || 
      (currentUser?.role === 'USER' ? currentUser.email : '') || 
      '';

  // 3. Vét cạn tên khách hàng
  const nameRaw = 
      beOrder.shippingFullName || 
      beOrder.fullName ||             
      beOrder.customerName ||        
      beOrder.user?.fullName || 
      'Khách hàng';

  return {
    id: String(beOrder.orderId || beOrder.id), 
    date: beOrder.createdAt ? new Date(beOrder.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
    status: beOrder.status as OrderStatus, 
    total: beOrder.totalAmount || beOrder.total || 0,
    items: mapItems(beOrder.orderDetails || beOrder.items || []), 
    customer: {
      name: nameRaw,
      email: emailRaw,
      phone: phoneRaw,
      address: beOrder.shippingAddress || beOrder.address || 'Tại cửa hàng',
    },
    paymentStatus: mapPaymentStatus(beOrder.paymentStatus),
    paymentMethod: String(beOrder.paymentMethod || 'COD').toLowerCase() as ('cod' | 'card'),
  };
};

type Page = 'home' | 'product' | 'category' | 'checkout' | 'brands' | 'account' | 'order-history';

// Component Info Modal đơn giản (Nếu bạn không có component Modal riêng)
const InfoModal: React.FC<{ title: string; content: React.ReactNode; onClose: () => void }> = ({ title, content, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-gym-dark max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-2xl transition-all duration-300 transform scale-100" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-3 border-b border-gray-700 mb-4 sticky top-0 bg-gym-dark z-10">
                    <h2 className="text-2xl font-bold text-gym-yellow">{title}</h2>
                    <button onClick={onClose} className="text-white hover:text-gym-yellow text-3xl font-light leading-none">×</button>
                </div>
                <div className="text-gym-gray">{content}</div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]); 
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('default');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminViewingSite, setIsAdminViewingSite] = useState(false);
  
  // 👉 THÊM STATE CHO INFO MODAL
  const [infoModalContent, setInfoModalContent] = useState<{ title: string; content: React.ReactNode; } | null>(null);

  useEffect(() => {
    const body = document.body;
    body.className = 'bg-gym-darker text-white'; 
    if (currentUser?.role === 'ADMIN' && !isAdminViewingSite) {
        body.classList.add(`admin-theme-${theme}`);
    } else {
        body.classList.add(`theme-${theme}`);
    }
  }, [theme, currentUser, isAdminViewingSite]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get('/products');
      const mappedProducts = res.data.map(mapProductResponseToProduct);
      setProducts(mappedProducts); 
    } catch (err: any) {
      console.error("Lỗi tải lại products:", err);
    }
  }, []); 

  const fetchOrders = useCallback(async (userRole: 'ADMIN' | 'USER', userContext: User | null) => {
    try {
      const endpoint = userRole === 'ADMIN' ? '/orders' : '/orders/my-orders';
      const res = await api.get(endpoint);
      // Truyền userContext vào hàm map để fallback
      const mappedOrders = res.data.map((o: any) => mapBackendOrderToFrontendOrder(o, userContext));
      setOrders(mappedOrders);
    } catch (err: any) {
      console.error("Lỗi tải đơn hàng:", err);
      setOrders([]); 
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user'); 
    if (token && userJson) {
      try {
        const userRes: UserResponse = JSON.parse(userJson); 
        const userRole = userRes.role as ('USER' | 'ADMIN'); 
        
        // Tạo User Object đầy đủ
        const userObj: User = {
          name: `${userRes.firstName} ${userRes.lastName}`,
          role: userRole,
          email: userRes.email,
          phone: userRes.phoneNumber // Lấy thêm SĐT từ localStorage
        };

        setCurrentUser(userObj);
        fetchOrders(userRole, userObj); 
      } catch (e) {
        console.error("Lỗi parse user JSON:", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    fetchProducts(); 
  }, [fetchProducts, fetchOrders]);

  const handleLoginSuccess = useCallback((userResponse: UserResponse) => { 
    localStorage.setItem('user', JSON.stringify(userResponse));
    const userRole = userResponse.role as ('USER' | 'ADMIN');
    
    const userObj: User = {
      name: `${userResponse.firstName} ${userResponse.lastName}`, 
      role: userRole,
      email: userResponse.email,
      phone: userResponse.phoneNumber // Lấy thêm SĐT từ response
    };

    setCurrentUser(userObj);
    fetchOrders(userRole, userObj);
    setIsAuthModalOpen(false);
    if (userRole === 'ADMIN') setIsAdminViewingSite(false);
  }, [fetchOrders]); 

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    setCurrentUser(null);
    setOrders([]); 
    setPage('home');
    setIsAdminViewingSite(false);
  }, []);

  // ... (CÁC HÀM XỬ LÝ SẢN PHẨM) ...
  const handleAddProduct = useCallback(async (request: CreateProductRequest) => {
    try { await api.post('/products', request); alert('Thêm sản phẩm thành công!'); await fetchProducts(); } 
    catch (err: any) { console.error("Lỗi Thêm sản phẩm:", err); alert("LỖI: " + (err as any).response?.data?.message || (err as any).message); }
  }, [fetchProducts]);

  const handleUpdateProduct = useCallback(async (productId: number, request: CreateProductRequest) => {
    try { await api.put(`/products/${productId}`, request); alert('Cập nhật thành công!'); await fetchProducts(); } 
    catch (err: any) { console.error("Lỗi Cập nhật sản phẩm:", err); alert("LỖI: " + (err as any).response?.data?.message || (err as any).message); }
  }, [fetchProducts]);

  const handleDeleteProduct = useCallback(async (productId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn XÓA sản phẩm này không?")) return;
    try { await api.delete(`/products/${productId}`); setProducts(prevProducts => prevProducts.filter(p => p.id !== productId)); } 
    catch (err: any) { console.error("Lỗi Xóa sản phẩm:", err); alert("LỖI: " + (err as any).response?.data?.message || (err as any).message); }
  }, []);
  
  const handleOrderSuccess = useCallback(() => {
    fetchProducts(); 
    if (currentUser) fetchOrders(currentUser.role, currentUser); 
    setPage('home'); 
    window.scrollTo(0, 0);
  }, [fetchProducts, fetchOrders, currentUser]); 

  const handleUpdateOrderStatus = useCallback(async (orderId: string, action: OrderStatus | 'CANCEL_USER') => {
    if (!currentUser) { alert('Vui lòng đăng nhập lại để thực hiện.'); return; }
    try {
        const orderIdNum = parseInt(orderId.replace(/[^0-9]/g, ''));
        if (currentUser.role === 'ADMIN' && action !== 'CANCEL_USER') { await api.put(`/orders/admin/${orderIdNum}/status`, { newStatus: action }); } 
        else if (currentUser.role === 'USER' && action === 'CANCEL_USER') { await api.put(`/orders/${orderIdNum}/cancel`); } 
        else { alert('Không có quyền thay đổi trạng thái này.'); return; }
        await fetchOrders(currentUser.role, currentUser);
        alert(`Cập nhật đơn hàng ${orderId} thành công!`); 
    } catch (err: any) { console.error("Lỗi Cập nhật trạng thái đơn hàng:", err); alert("LỖI: " + (err as any).response?.data?.message || (err as any).message); }
  }, [currentUser, fetchOrders]);

  // 👉 HÀM HANDLER MỚI CHO FOOTER
  const handleInfoLinkClick = useCallback((title: string, content: React.ReactNode) => {
      setInfoModalContent({ title, content });
      window.scrollTo(0, 0); 
  }, []);

  // ... (CÁC HÀM ĐIỀU HƯỚNG) ...
  const handleAdminViewSite = useCallback(() => { setIsAdminViewingSite(true); setPage('home'); window.scrollTo(0, 0); }, []);
  const handleAdminReturnToPanel = useCallback(() => { setIsAdminViewingSite(false); window.scrollTo(0, 0); }, []);
  const handleGoHome = useCallback(() => { setPage('home'); setSelectedProduct(null); setSelectedCategory(null); setSelectedBrand(null); window.scrollTo(0, 0); }, []);
  const handleProductSelect = useCallback((product: Product) => { setSelectedProduct(product); setPage('product'); window.scrollTo(0, 0); }, []);
  const handleCategorySelect = useCallback((category: string) => { if (category === 'Thương hiệu') setPage('brands'); else { setSelectedCategory(category); setSelectedBrand(null); setPage('category'); } window.scrollTo(0, 0); }, []);
  const handleBrandSelect = useCallback((brandName: string) => { setSelectedBrand(brandName); setSelectedCategory(null); setPage('category'); window.scrollTo(0, 0); }, []);
  const handleCheckout = useCallback(() => { setIsCartOpen(false); if (currentUser) { setPage('checkout'); window.scrollTo(0, 0); } else { setIsAuthModalOpen(true); } }, [currentUser]);
  const handleAccountClick = useCallback(() => { if (currentUser) { setPage('account'); window.scrollTo(0, 0); } else setIsAuthModalOpen(true); }, [currentUser]);
  const handleOrderHistoryClick = useCallback(() => { if (currentUser) { setPage('order-history'); window.scrollTo(0, 0); } else setIsAuthModalOpen(true); }, [currentUser]);
  const handleAuthClick = useCallback(() => { setIsAuthModalOpen(true); }, []);
  const handleStockSubscribe = useCallback((productId: number, email: string) => { console.log("Gửi đăng ký nhận hàng:", { productId, email }); }, []);

  const renderPage = () => {
    switch (page) {
      case 'product': return <ProductPage product={selectedProduct!} onBack={handleGoHome} currentUser={currentUser} onAuthClick={handleAuthClick} onStockSubscribe={handleStockSubscribe} onCategorySelect={handleCategorySelect} />;
      case 'category': const filterBy = selectedBrand ? { type: 'brand' as const, value: selectedBrand } : { type: 'category' as const, value: selectedCategory! }; return <CategoryPage products={products} filterBy={filterBy} onProductSelect={handleProductSelect} onBack={handleGoHome} />;
      case 'checkout': return <CheckoutPage onBackToShop={handleGoHome} onOrderSuccess={handleOrderSuccess} currentUser={currentUser} />;
      case 'brands': return <BrandsPage brands={brands} onBack={handleGoHome} onBrandSelect={handleBrandSelect} />;
      case 'account': return <AccountPage currentUser={currentUser!} onBack={handleGoHome} />;
      case 'order-history': return <OrderHistoryPage onBack={handleGoHome} orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />;
      case 'home': default: return <HomePage products={products} onProductSelect={handleProductSelect} onCategorySelect={handleCategorySelect} />;
    }
  };

  if (currentUser?.role === 'ADMIN' && !isAdminViewingSite) {
    return <AdminPage 
        currentUser={currentUser} 
        onLogout={handleLogout}
        onViewSite={handleAdminViewSite}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus} 
    />;
  }

  return (
    <CartProvider currentUser={currentUser}>
      <div className="bg-gym-darker text-white font-sans selection:bg-gym-yellow selection:text-gym-darker">
        <Header 
            navLinks={navLinks} products={products} onCartClick={() => setIsCartOpen(true)} onAuthClick={() => setIsAuthModalOpen(true)}
            onCategorySelect={handleCategorySelect} onProductSelect={handleProductSelect} onLogoClick={handleGoHome} theme={theme} setTheme={setTheme}
            currentUser={currentUser} onLogout={handleLogout} onAccountClick={handleAccountClick} onOrderHistoryClick={handleOrderHistoryClick}
            isAdminViewingSite={currentUser?.role === 'ADMIN' && isAdminViewingSite} onReturnToAdmin={handleAdminReturnToPanel}
        />
        <main className="min-h-screen">{renderPage()}</main>
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
        
        {/* 👉 TRUYỀN PROP VÀO FOOTER ĐỂ KHẮC PHỤC LỖI */}
        <Footer onInfoLinkClick={handleInfoLinkClick} />
        
        <Chatbot />

        {/* 👉 RENDER INFO MODAL */}
        {infoModalContent && (
            <InfoModal 
                title={infoModalContent.title} 
                content={infoModalContent.content} 
                onClose={() => setInfoModalContent(null)} 
            />
        )}
      </div>
    </CartProvider>
  );
};

export default App;