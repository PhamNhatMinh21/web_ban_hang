// File: src/components/AdminPage.tsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, Theme, Product, Order, OrderStatus, CreateProductRequest, Article } from '../types';
import AddProductModal from './AddProductModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import FeaturedProductsView from './FeaturedProductsView'; 
import KnowledgeManagementView from './KnowledgeManagementView';
import AddArticleModal from './AddArticleModal'; // Import Modal mới
// Import dữ liệu khởi tạo và đổi tên để tránh trùng state
import { supplementArticles as initialSuppArticles, nutritionArticles as initialNutriArticles } from '../constants';

// --- BỘ ICON SVG ---
const PaletteIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402a3.75 3.75 0 00-5.304-5.304L4.098 14.6c-1.464 1.464-1.464 3.84 0 5.304z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.402-2.368-1.07-3.22a4.5 4.5 0 00-6.364-6.364L12 7.5" /></svg>
);
const DashboardIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25H15.75A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H15.75A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
);
const ProductIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125A2.25 2.25 0 014.5 4.875h15A2.25 2.25 0 0121.75 7.125v4.5A2.25 2.25 0 0119.5 13.875h-15A2.25 2.25 0 012.25 11.625v-4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.375A2.25 2.25 0 014.5 16.125h15A2.25 2.25 0 0121.75 18.375v.75A2.25 2.25 0 0119.5 21.375h-15A2.25 2.25 0 012.25 19.125v-.75z" /></svg>
);
const StarIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
);
const OrderIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>
);
const UserIconSvg: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-2.452a9.75 9.75 0 00-1.594-1.594l-2.072-2.072a3.375 3.375 0 00-4.774-4.774l-2.072-2.072a9.75 9.75 0 00-1.594-1.594 9.337 9.337 0 00-2.452 4.121 9.38 9.38 0 00.372 2.625M12 15a3 3 0 100-6 3 3 0 000 6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const BookIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
);
const PostIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
);
const LogoutIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
);
const SearchIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
);
const AddIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
);
const HomeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M2.25 12v9a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21V12" /></svg>
);
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
);

const navItems = [
  { name: 'Bảng điều khiển', icon: DashboardIcon },
  { name: 'Quản lý sản phẩm', icon: ProductIcon },
  { name: 'Quản lý sản phẩm nổi bật', icon: StarIcon },
  { name: 'Quản lý đơn hàng', icon: OrderIcon },

  
  { name: 'Trang Chủ', icon: HomeIcon },
];

interface AdminPageProps {
  currentUser: User;
  onLogout: () => void;
  onViewSite: () => void;
  products: Product[];
  onAddProduct: (request: CreateProductRequest) => void;
  onUpdateProduct: (productId: number, request: CreateProductRequest) => void;
  onDeleteProduct: (productId: number) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

// ==========================================================
// === DASHBOARD VIEW ===
// ==========================================================
const DashboardView: React.FC<{products: Product[], orders: Order[]}> = ({products, orders}) => {
    
    const stats = useMemo(() => {
        const totalProducts = products.length;
        const totalOrders = orders.length;
        const validOrders = orders.filter(o => o.status !== 'CANCELLED' && o.status !== 'RETURNED');
        const totalRevenue = validOrders.reduce((sum, order) => sum + order.total, 0);
        const currentMonthStr = new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
        
        const monthlyRevenue = validOrders.reduce((sum, order) => {
            if (order.date.includes(currentMonthStr) || order.date.includes(new Date().getMonth() + 1 + "/")) {
                return sum + order.total;
            }
            return sum;
        }, 0);

        return {
            totalProducts,
            totalOrders,
            totalRevenue,
            monthlyRevenue: monthlyRevenue > 0 ? monthlyRevenue : totalRevenue * 0.3,
        };
    }, [products, orders]);

    return (
        <>
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[var(--admin-bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--admin-border-color)]">
                    <h3 className="text-[var(--admin-text-secondary)] text-sm font-medium">Tổng doanh thu (Thực tế)</h3>
                    <p className="text-2xl font-bold mt-2 text-green-400">
                        {stats.totalRevenue.toLocaleString('vi-VN')}₫
                    </p>
                </div>
                <div className="bg-[var(--admin-bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--admin-border-color)]">
                    <h3 className="text-[var(--admin-text-secondary)] text-sm font-medium">Doanh thu tháng này</h3>
                    <p className="text-2xl font-bold mt-2 text-yellow-400">
                        {Math.round(stats.monthlyRevenue).toLocaleString('vi-VN')}₫
                    </p>
                </div>
                <div className="bg-[var(--admin-bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--admin-border-color)]">
                    <h3 className="text-[var(--admin-text-secondary)] text-sm font-medium">Tổng đơn hàng</h3>
                    <p className="text-2xl font-bold mt-2 text-blue-400">
                        {stats.totalOrders} đơn
                    </p>
                </div>
                <div className="bg-[var(--admin-bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--admin-border-color)]">
                    <h3 className="text-[var(--admin-text-secondary)] text-sm font-medium">Sản phẩm đang bán</h3>
                    <p className="text-2xl font-bold mt-2 text-white">
                        {stats.totalProducts} SP
                    </p>
                </div>
            </div>

            <div className="bg-[var(--admin-bg-card)] p-6 rounded-2xl shadow-sm">
                <h2 className="text-lg font-bold mb-4">Sản phẩm mới nhất</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-[var(--admin-text-secondary)] uppercase border-b border-[var(--admin-border-color)]">
                      <tr>
                        <th scope="col" className="px-6 py-3">Tên sản phẩm</th>
                        <th scope="col" className="px-6 py-3">Giá bán</th>
                        <th scope="col" className="px-6 py-3">Tổng tồn kho</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...products].reverse().slice(0, 5).map((product) => {
                        const totalStock = (product.variants || []).reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
                        return (
                            <tr key={product.id} className="border-b border-[var(--admin-border-color)] last:border-b-0">
                              <td className="px-6 py-4 font-medium flex items-center gap-3">
                                  <img src={product.images[0]} className="w-8 h-8 rounded object-cover"/>
                                  {product.name}
                              </td>
                              <td className="px-6 py-4 font-bold text-yellow-500">{product.price.toLocaleString('vi-VN')}₫</td>
                              <td className="px-6 py-4">{totalStock}</td>
                            </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
            </div>
        </>
    );
};

// === PRODUCT MANAGEMENT VIEW ===
const ProductManagementView: React.FC<{
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    onAddNew: () => void;
}> = ({ products, onEdit, onDelete, onAddNew }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Tất cả');
    const [expandedProductId, setExpandedProductId] = useState<number | null>(null);

    const categories = ['Tất cả', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = categoryFilter === 'Tất cả' || product.category === categoryFilter;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, searchTerm, categoryFilter]);
    
    const inputStyles = "bg-[var(--admin-bg-card)] border border-[var(--admin-border-color)] rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 ring-[var(--admin-text-accent)]";

    const handleToggleExpand = (productId: number) => {
        setExpandedProductId(prevId => (prevId === productId ? null : productId));
    };

    return (
        <>
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
                <button 
                    onClick={onAddNew}
                    className="bg-[var(--admin-button-bg)] text-[var(--admin-button-text)] font-bold py-2.5 px-5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                >
                    <AddIcon />
                    <span>Thêm sản phẩm mới</span>
                </button>
            </header>

            <div className="bg-[var(--admin-bg-card)] p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <div className="relative w-full sm:max-w-xs">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon className="text-[var(--admin-text-secondary)]" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm theo tên sản phẩm..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={`${inputStyles} w-full pl-10`} 
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <select 
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className={`${inputStyles} w-full`}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-[var(--admin-text-secondary)] uppercase border-b border-[var(--admin-border-color)]">
                      <tr>
                        <th scope="col" className="px-2 py-3 w-12"></th>
                        <th scope="col" className="px-6 py-3">Tên sản phẩm</th>
                        <th scope="col" className="px-6 py-3">Danh mục</th>
                        <th scope="col" className="px-6 py-3">Thương hiệu</th>
                        <th scope="col" className="px-6 py-3">Tổng tồn kho</th>
                        <th scope="col" className="px-6 py-3">Trạng thái</th>
                        <th scope="col" className="px-6 py-3">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const isExpanded = expandedProductId === product.id;
                        const productVariants = product.variants || []; 
                        const totalStock = productVariants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
                        const inStock = totalStock > 0;

                        return (
                          <React.Fragment key={product.id}>
                            <tr className="border-b border-[var(--admin-border-color)] hover:bg-[var(--admin-bg-hover)]">
                              <td className="px-2 py-4 text-center">
                                <button 
                                  onClick={() => handleToggleExpand(product.id)} 
                                  className="text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-main)] transition-colors"
                                  disabled={productVariants.length === 0}
                                  title={productVariants.length === 0 ? "Không có biến thể" : "Xem biến thể"}
                                >
                                  <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''} ${productVariants.length === 0 ? 'opacity-30' : ''}`} />
                                </button>
                              </td>
                              <td className="px-6 py-4 font-medium flex items-center space-x-3">
                                <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-md object-cover"/>
                                <span>{product.name}</span>
                              </td>
                              <td className="px-6 py-4">{product.category}</td>
                              <td className="px-6 py-4">{product.brand}</td>
                              <td className="px-6 py-4">{totalStock}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {inStock ? 'Còn hàng' : 'Hết hàng'}
                                </span>
                              </td>
                              <td className="px-6 py-4 flex items-center space-x-3">
                                <button onClick={() => onEdit(product)} className="font-medium text-[var(--admin-text-accent)] hover:underline">Sửa</button>
                                <button onClick={() => onDelete(product)} className="font-medium text-red-500 hover:underline">Xóa</button>
                              </td>
                            </tr>
                            
                            {isExpanded && (
                              <tr className="bg-[var(--admin-bg-hover)]">
                                <td colSpan={7} className="py-4 px-6 md:px-10 lg:px-16">
                                  <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-2 ml-1">Các biến thể</h4>
                                  <div className="border border-[var(--admin-border-color)] rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                      <thead className="bg-[var(--admin-bg-card)] text-xs text-[var(--admin-text-secondary)] uppercase">
                                        <tr>
                                          <th scope="col" className="px-4 py-2 text-left">Tên biến thể</th>
                                          <th scope="col" className="px-4 py-2 text-left">SKU</th>
                                          <th scope="col" className="px-4 py-2 text-left">Giá</th>
                                          <th scope="col" className="px-4 py-2 text-left">Giá KM</th>
                                          <th scope="col" className="px-4 py-2 text-left">Tồn kho</th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-[var(--admin-bg-card)]">
                                        {productVariants.map((variant) => (
                                          <tr key={variant.sku} className="border-t border-[var(--admin-border-color)]">
                                            <td className="px-4 py-3">{variant.name}</td>
                                            <td className="px-4 py-3 font-mono">{variant.sku}</td>
                                            <td className="px-4 py-3">{variant.price.toLocaleString('vi-VN')}₫</td>
                                            <td className="px-4 py-3">
                                              {variant.oldPrice ? `${variant.oldPrice.toLocaleString('vi-VN')}₫` : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3">{variant.stockQuantity}</td>
                                          </tr>
                                        ))}
                                        {productVariants.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="text-center py-4 text-[var(--admin-text-secondary)]">
                                                    Sản phẩm này chưa có biến thể nào.
                                                </td>
                                            </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
            </div>
        </>
    );
};

// === ORDER MANAGEMENT VIEW ===
const BE_TO_VN_MAP: Record<OrderStatus, string> = {
    'PENDING_CONFIRMATION': 'Chờ xác nhận',
    'PROCESSING': 'Đang xử lý',
    'SHIPPING': 'Đang giao hàng',
    'COMPLETED': 'Hoàn thành',
    'CANCELLED': 'Đã hủy',
    'RETURNED': 'Đã trả hàng',
};
const VN_TO_BE_MAP: Record<string, OrderStatus> = {
    'Chờ xác nhận': 'PENDING_CONFIRMATION',
    'Đang xử lý': 'PROCESSING',
    'Đang giao hàng': 'SHIPPING',
    'Hoàn thành': 'COMPLETED',
    'Đã hủy': 'CANCELLED',
    'Đã trả hàng': 'RETURNED',
};
const VN_STATUSES_FOR_UI = [
    'Chờ xác nhận', 'Đang xử lý', 'Đang giao hàng', 'Hoàn thành', 'Đã hủy', 'Đã trả hàng',
];

const OrderManagementView: React.FC<{
    orders: Order[];
    onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}> = ({ orders, onUpdateStatus }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tất cả');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const inputStyles = "bg-[var(--admin-bg-card)] border border-[var(--admin-border-color)] rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 ring-[var(--admin-text-accent)]";

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const beStatus = order.status;
            const vnStatus = BE_TO_VN_MAP[beStatus] || 'Không rõ';
            const matchesStatus = statusFilter === 'Tất cả' || vnStatus === statusFilter;
            const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (order.customer.phone && order.customer.phone.includes(searchTerm)); 
            return matchesStatus && matchesSearch;
        });
    }, [orders, searchTerm, statusFilter]);

    const getStatusClass = (status: OrderStatus) => {
        switch (status) {
          case 'COMPLETED': return 'bg-green-500/20 text-green-400';
          case 'SHIPPING': return 'bg-blue-500/20 text-blue-400';
          case 'PROCESSING': return 'bg-yellow-500/20 text-yellow-400';
          case 'PENDING_CONFIRMATION': return 'bg-gray-500/20 text-gray-400';
          case 'CANCELLED': return 'bg-red-500/20 text-red-400';
          case 'RETURNED': return 'bg-red-500/20 text-red-400';
          default: return 'bg-gray-500/20 text-gray-400';
        }
    };
    
    const getPaymentStatusClass = (status: Order['paymentStatus']) => {
        return status === 'Đã thanh toán' ? 'text-green-400' : 'text-yellow-400';
    };

    const getPaymentMethodName = (method: string) => {
        if (method === 'cod') return 'Thanh toán khi nhận hàng (COD)';
        if (method === 'card') return 'Chuyển khoản / Thẻ';
        return method.toUpperCase();
    };

    const handleToggleExpand = (orderId: string) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
            </header>
            <div className="bg-[var(--admin-bg-card)] p-6 rounded-2xl shadow-sm">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <div className="relative w-full sm:max-w-xs">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon className="text-[var(--admin-text-secondary)]" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Tìm Mã ĐH, Tên, SĐT..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)} 
                            className={`${inputStyles} w-full pl-10`} 
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <select 
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className={`${inputStyles} w-full`}
                        >
                            <option value="Tất cả">Tất cả trạng thái</option>
                            {VN_STATUSES_FOR_UI.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-[var(--admin-text-secondary)] uppercase border-b border-[var(--admin-border-color)]">
                      <tr>
                        <th scope="col" className="px-2 py-3 w-12"></th>
                        <th scope="col" className="px-6 py-3">Mã đơn hàng</th>
                        <th scope="col" className="px-6 py-3">Khách hàng</th>
                        <th scope="col" className="px-6 py-3">Ngày đặt</th>
                        <th scope="col" className="px-6 py-3">Tổng tiền</th>
                        <th scope="col" className="px-6 py-3">Thanh toán</th>
                        <th scope="col" className="px-6 py-3">Trạng thái ĐH</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => {
                        const isExpanded = expandedOrderId === order.id;
                        const orderItems = (order as any).items || []; 
                        const currentBeStatus = order.status; 
                        const currentVnStatus = BE_TO_VN_MAP[currentBeStatus] || 'Không rõ';

                        return (
                          <React.Fragment key={order.id}>
                            <tr className="border-b border-[var(--admin-border-color)] hover:bg-[var(--admin-bg-hover)] transition-colors">
                              <td className="px-2 py-4 text-center">
                                <button 
                                  onClick={() => handleToggleExpand(order.id)} 
                                  className="text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-main)] transition-colors p-1 rounded hover:bg-[var(--admin-bg-accent)]"
                                  title={isExpanded ? "Thu gọn" : "Xem chi tiết"}
                                >
                                  <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                              </td>
                              <td className="px-6 py-4 font-mono text-[var(--admin-text-accent)] font-bold">{order.id}</td>
                              <td className="px-6 py-4 font-medium">
                                  <div className="flex flex-col">
                                      <span>{order.customer.name}</span>
                                      <span className="text-xs text-[var(--admin-text-secondary)]">{order.customer.phone}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-[var(--admin-text-secondary)]">{order.date}</td>
                              <td className="px-6 py-4 font-bold">{order.total.toLocaleString('vi-VN')}₫</td>
                              <td className={`px-6 py-4 font-semibold ${getPaymentStatusClass(order.paymentStatus)}`}>{order.paymentStatus}</td>
                              <td className="px-6 py-4">
                                <select 
                                    value={currentVnStatus} 
                                    onChange={(e) => {
                                        const vnValue = e.target.value;
                                        const beStatusToSend = VN_TO_BE_MAP[vnValue];
                                        if (beStatusToSend) onUpdateStatus(order.id, beStatusToSend);
                                    }}
                                    className={`text-xs font-semibold rounded-md p-1.5 border-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--admin-bg-card)] cursor-pointer ${getStatusClass(currentBeStatus)}`}
                                    style={{ backgroundColor: 'transparent' }}
                                >
                                  {VN_STATUSES_FOR_UI.map(s => <option key={s} value={s} className="bg-[var(--admin-bg-card)] text-[var(--admin-text-main)]">{s}</option>)}
                                </select>
                              </td>
                            </tr>
                            
                            {isExpanded && (
                              <tr className="bg-[var(--admin-bg-hover)] animate-fade-in">
                                <td colSpan={7} className="p-6">
                                  <div className="bg-[var(--admin-bg-card)] rounded-xl border border-[var(--admin-border-color)] overflow-hidden">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-[var(--admin-border-color)]">
                                        <div>
                                            <h4 className="text-sm font-bold text-[var(--admin-text-accent)] uppercase mb-3 flex items-center gap-2">
                                                <UserIconSvg className="w-4 h-4"/> Thông tin giao hàng
                                            </h4>
                                            <div className="space-y-2 text-sm text-[var(--admin-text-main)]">
                                                <p className="flex"><span className="text-[var(--admin-text-secondary)] w-24 block">Họ tên:</span> <span className="font-medium">{order.customer.name}</span></p>
                                                <p className="flex"><span className="text-[var(--admin-text-secondary)] w-24 block">Số điện thoại:</span> <span className="font-mono">{order.customer.phone || 'N/A'}</span></p>
                                                <p className="flex"><span className="text-[var(--admin-text-secondary)] w-24 block">Email:</span> <span>{order.customer.email || 'N/A'}</span></p>
                                                <p className="flex items-start"><span className="text-[var(--admin-text-secondary)] w-24 block flex-shrink-0">Địa chỉ:</span> <span>{order.customer.address || 'N/A'}</span></p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-[var(--admin-text-accent)] uppercase mb-3 flex items-center gap-2">
                                                <OrderIcon className="w-4 h-4"/> Thông tin thanh toán
                                            </h4>
                                            <div className="space-y-2 text-sm text-[var(--admin-text-main)]">
                                                <p className="flex"><span className="text-[var(--admin-text-secondary)] w-32 block">Phương thức:</span> <span className="font-bold">{getPaymentMethodName(order.paymentMethod)}</span></p>
                                                <p className="flex"><span className="text-[var(--admin-text-secondary)] w-32 block">Trạng thái TT:</span> <span className={`${getPaymentStatusClass(order.paymentStatus)} font-bold`}>{order.paymentStatus}</span></p>
                                                <p className="flex"><span className="text-[var(--admin-text-secondary)] w-32 block">Tổng tiền:</span> <span className="text-xl font-bold text-[var(--admin-text-accent)]">{order.total.toLocaleString('vi-VN')}₫</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-3">Danh sách sản phẩm</h4>
                                        <div className="border border-[var(--admin-border-color)] rounded-lg overflow-hidden">
                                            <table className="w-full text-sm">
                                            <thead className="bg-[var(--admin-bg-accent)]/10 text-xs text-[var(--admin-text-secondary)] uppercase">
                                                <tr>
                                                <th className="px-4 py-2 text-left">Sản phẩm</th>
                                                <th className="px-4 py-2 text-left">Đơn giá</th>
                                                <th className="px-4 py-2 text-left">Số lượng</th>
                                                <th className="px-4 py-2 text-left">Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-[var(--admin-bg-card)] divide-y divide-[var(--admin-border-color)]">
                                                {orderItems.map((item: any) => (
                                                <tr key={item.sku || Math.random()}>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 rounded bg-[var(--admin-bg-hover)] flex-shrink-0 overflow-hidden border border-[var(--admin-border-color)]">
                                                                <img 
                                                                    src={item.image || (orderItems.length > 0 && orderItems[0]?.image) || ''} 
                                                                    alt={item.productName || item.sku} 
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-[var(--admin-text-main)]">
                                                                    {item.productName || item.name || `SKU: ${item.sku}`}
                                                                </p>
                                                                {(item.size || item.flavor) && (
                                                                    <p className="text-xs text-[var(--admin-text-secondary)] mt-0.5"> 
                                                                        {item.flavor && <span className="mr-2">Vị: {item.flavor}</span>}
                                                                        {item.size && <span>Size: {item.size}</span>}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-[var(--admin-text-secondary)]">{item.price.toLocaleString('vi-VN')}₫</td>
                                                    <td className="px-4 py-3 font-bold text-[var(--admin-text-main)]">x{item.quantity}</td>
                                                    <td className="px-4 py-3 font-bold text-[var(--admin-text-accent)]">
                                                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                                    </td>
                                                </tr>
                                                ))}
                                            </tbody>
                                            </table>
                                        </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
            </div>
        </>
    );
};

const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => (
    <>
        <header className="mb-8">
            <h1 className="text-3xl font-bold">{title}</h1>
        </header>
        <div className="bg-[var(--admin-bg-card)] p-10 rounded-2xl shadow-sm text-center">
            <h2 className="text-2xl font-bold text-[var(--admin-text-main)]">Sắp ra mắt!</h2>
            <p className="text-[var(--admin-text-secondary)] mt-2">Tính năng này đang được phát triển. Vui lòng quay lại sau.</p>
        </div>
    </>
);

const AdminPage: React.FC<AdminPageProps> = ({ currentUser, onLogout, onViewSite, products, onAddProduct, onUpdateProduct, onDeleteProduct, orders, onUpdateOrderStatus }) => {
  const [activePage, setActivePage] = useState('Bảng điều khiển');
  const [theme, setTheme] = useState<Theme>('default');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // 👇 STATE MỚI CHO BÀI VIẾT
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [suppArticles, setSuppArticles] = useState<Article[]>(initialSuppArticles);
  const [nutriArticles, setNutriArticles] = useState<Article[]>(initialNutriArticles);

  useEffect(() => {
    const body = document.body;
    body.className = ''; 
    if (theme === 'default') {
    } else {
        body.classList.add(`admin-theme-${theme}`);
    }
    return () => {
        body.className = 'bg-gym-darker text-white'; 
    }
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
            setIsThemeMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleAddNewClick = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    onDeleteProduct(productToDelete.id);
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleCancelDelete = () => {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
  };

  const handleNavClick = (name: string) => {
    if (name === 'Trang Chủ') {
      onViewSite();
    } else {
      setActivePage(name);
    }
  };

  // 👇 HÀM XỬ LÝ THÊM BÀI VIẾT MỚI
  const handleAddArticle = (newArticleData: Omit<Article, 'id' | 'date'>) => {
    const newArticle: Article = {
        id: Date.now(), // Tạo ID giả
        date: new Date().toLocaleDateString('vi-VN'), // Lấy ngày hiện tại
        ...newArticleData,
        url: newArticleData.url || '#', // Fallback nếu user không nhập link
        image: newArticleData.image || 'https://via.placeholder.com/400x200', // Fallback ảnh
    };

    if (newArticleData.category === 'Kiến thức Supplement') {
        setSuppArticles([...suppArticles, newArticle]);
    } else {
        setNutriArticles([...nutriArticles, newArticle]);
    }
  };

  const renderContent = () => {
    switch (activePage) {
        case 'Quản lý sản phẩm':
            return <ProductManagementView products={products} onEdit={handleEditClick} onDelete={handleDeleteClick} onAddNew={handleAddNewClick} />;
        
        case 'Quản lý sản phẩm nổi bật':
            return (
                <FeaturedProductsView 
                    products={products} 
                    onProductUpdate={async (id, req) => {
                        console.log('AdminPage: Product featured status updated', id);
                    }} 
                />
            );

        case 'Quản lý kiến thức':
            return (
                <KnowledgeManagementView 
                    supplementArticles={suppArticles} 
                    nutritionArticles={nutriArticles} 
                    onAddClick={() => setIsArticleModalOpen(true)}
                />
            );

        case 'Quản lý đơn hàng':
            return <OrderManagementView orders={orders} onUpdateStatus={onUpdateOrderStatus} />;
        case 'Quản lý người dùng':
        case 'Quản lý bài viết':
            return <ComingSoonPage title={activePage} />;
        case 'Bảng điều khiển':
        default:
            return <DashboardView products={products} orders={orders} />;
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-[var(--admin-bg-main)] text-[var(--admin-text-main)]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[var(--admin-bg-sidebar)] p-4 flex flex-col rounded-r-2xl shadow-lg">
        <div className="flex items-center space-x-3 p-2 mb-6">
          <div className="w-12 h-12 bg-[var(--admin-bg-accent)] rounded-full flex items-center justify-center font-bold text-[var(--admin-text-accent-strong)] text-xl">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-sm">GymSUP Admin</p>
            <p className="text-xs text-[var(--admin-text-secondary)]">admin@gymsup.com</p>
          </div>
        </div>
        <nav className="flex-grow">
          <ul>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.name;
              return (
              <li key={item.name}>
                <button onClick={() => handleNavClick(item.name)} className={`flex items-center w-full space-x-3 py-3 px-4 my-1 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-[var(--admin-bg-accent)] text-[var(--admin-text-accent-strong)] font-bold' : 'text-[var(--admin-text-secondary)] hover:bg-[var(--admin-bg-hover)]'}`}>
                  <Icon />
                  <span>{item.name}</span>
                </button>
              </li>
            )})}
          </ul>
        </nav>
        <div className="mt-auto">
          <button onClick={onLogout} className="w-full bg-[var(--admin-button-bg)] text-[var(--admin-button-text)] font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
            <LogoutIcon />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end items-center mb-4 -mt-4">
              <div ref={themeMenuRef} className="relative">
                  <button onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)} className="text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-accent)] transition-colors p-2">
                      <PaletteIcon className="h-6 w-6" />
                  </button>
                  {isThemeMenuOpen && (
                      <div className="absolute right-0 mt-3 w-36 bg-[var(--admin-bg-card)] border border-[var(--admin-border-color)] rounded-md shadow-lg z-50 animate-fade-in py-1">
                          <ul>
                              <li><button onClick={() => { setTheme('default'); setIsThemeMenuOpen(false); }} className={`w-full text-left px-3 py-2 text-sm ${theme === 'default' ? 'bg-[var(--admin-bg-accent)] text-[var(--admin-text-accent-strong)]' : 'hover:bg-[var(--admin-bg-hover)]'}`}>Mặc định</button></li>
                              <li><button onClick={() => { setTheme('light'); setIsThemeMenuOpen(false); }} className={`w-full text-left px-3 py-2 text-sm ${theme === 'light' ? 'bg-[var(--admin-bg-accent)] text-[var(--admin-text-accent-strong)]' : 'hover:bg-[var(--admin-bg-hover)]'}`}>Trắng</button></li>
                              <li><button onClick={() => { setTheme('black'); setIsThemeMenuOpen(false); }} className={`w-full text-left px-3 py-2 text-sm ${theme === 'black' ? 'bg-[var(--admin-bg-accent)] text-[var(--admin-text-accent-strong)]' : 'hover:bg-[var(--admin-bg-hover)]'}`}>Đen</button></li>
                          </ul>
                      </div>
                  )}
              </div>
          </div>
          {renderContent()}
        </div>
      </main>

      <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} onAddProduct={onAddProduct} onUpdateProduct={onUpdateProduct} productToEdit={productToEdit} />
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={handleCancelDelete} onConfirm={handleConfirmDelete} productName={productToDelete?.name || ''} />
      
      {/* 👇 MODAL THÊM BÀI VIẾT Ở ĐÂY */}
      <AddArticleModal 
        isOpen={isArticleModalOpen} 
        onClose={() => setIsArticleModalOpen(false)} 
        onAdd={handleAddArticle} 
      />
    </div>
  );
};

export default AdminPage;