// File: src/constants.tsx

import React from 'react';
import { Product, Brand, Article, NavLink, SortOption } from './types';

// --- ICONS ---
export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);

export const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const ResetIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0a8.25 8.25 0 0111.664 0m-11.664 0l-3.181 3.183A8.25 8.25 0 012.985 19.644l3.181-3.183m0 0l-3.181-3.183a8.25 8.25 0 0111.664 0l3.181 3.183" />
    </svg>
);

// --- NAVIGATION LINKS ---
export const navLinks: NavLink[] = [
    {
        label: "Trang chủ",
        href: "#",
    },
    {
        label: "Whey Protein",
        href: "#",
        megaMenu: [
            {
                title: "Tăng cơ",
                links: [
                    { label: "Whey Protein Blend", href: "#", category: "Whey Protein Blend" },
                    { label: "Whey Protein Isolate", href: "#", category: "Whey Protein Isolate" },
                    { label: "Hydrolyzed Whey", href: "#", category: "Hydrolyzed Whey" },
                    { label: "Vegan Protein", href: "#", category: "Vegan Protein" },
                ],
            },
            {
                title: "Dạng sản phẩm",
                links: [
                    { label: "Protein Bar", href: "#", category: "Protein Bar" },
                    { label: "Dạng bột", href: "#", category: "Dạng bột" },
                ],
            },
        ],
    },
    {
        label: "Tăng cân",
        href: "#",
    },
    {
        label: "Tăng sức mạnh",
        href: "#",
        megaMenu: [
            {
                title: "Trước & trong tập",
                links: [
                    { label: "Pre-workout", href: "#", category: "Pre-workout" },
                ],
            },
            {
                title: "Sức mạnh & phục hồi",
                links: [
                    { label: "BCAA / EAA", href: "#", category: "BCAA / EAA" },
                    { label: "Creatine", href: "#", category: "Creatine" },
                ],
            },
        ],
    },
    {
        label: "Hỗ trợ sức khỏe",
        href: "#",
    },
    {
        label: "Phụ kiện",
        href: "#",
    },
    {
        label: "Thương hiệu",
        href: "#",
    },
];

// --- BRANDS ---
export const brands: Brand[] = [
    { id: 1, name: 'Optimum Nutrition', logo: 'https://cdn.jsdelivr.net/gh/nghiabodoi/-nh-n-ng-18-@main/Logo%20Th%C6%B0%C6%A1ng%20Hi%E1%BB%87u/Optimum%20Nutrition.png' },
    { id: 2, name: 'Myprotein', logo: 'https://cdn.jsdelivr.net/gh/nghiabodoi/-nh-n-ng-18-@main/Logo%20Th%C6%B0%C6%A1ng%20Hi%E1%BB%87u/Myprotein.png' },
    { id: 3, name: 'Rule 1', logo: 'https://cdn.jsdelivr.net/gh/nghiabodoi/-nh-n-ng-18-@main/Logo%20Th%C6%B0%C6%A1ng%20Hi%E1%BB%87u/Rule%201.png' },
    { id: 4, name: 'Applied Nutrition', logo: 'https://appliednutrition.uk/cdn/shop/files/Applied_Nutrition_Logo-01_1200x.png?v=1614285899' },
    { id: 5, name: 'Nutrabolt (C4)', logo: 'https://cdn.jsdelivr.net/gh/nghiabodoi/-nh-n-ng-18-@main/Logo%20Th%C6%B0%C6%A1ng%20Hi%E1%BB%87u/Nutrabolt%20(C4).jpg' },
    { id: 6, name: 'BPI Sports', logo: 'https://cdn.jsdelivr.net/gh/nghiabodoi/-nh-n-ng-18-@main/Logo%20Th%C6%B0%C6%A1ng%20Hi%E1%BB%87u/BPI%20Sports.png' },
    { id: 7, name: 'Thorne Research', logo: 'https://seeklogo.com/images/T/thorne-logo-8E3221522D-seeklogo.com.png' },
    { id: 8, name: 'Nutrex', logo: 'https://cdn.shopify.com/s/files/1/0528/9532/8522/files/nutrex-research-logo.png?v=1632732952' },
    { id: 9, name: 'Redcon1', logo: 'https://cdn.jsdelivr.net/gh/nghiabodoi/-nh-n-ng-18-@main/Logo%20Th%C6%B0%C6%A1ng%20Hi%E1%BB%87u/Redcon1.png' },
    { id: 10, name: 'GymSup', logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgNDAiPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgc3R5bGU9ImZvbnQtd2VpZ2h0OmJvbGQ7ZmlsbDojZmZmIj5HWU1TVVA8L3RleHQ+PC9zdmc+' },
];

// --- SORT OPTIONS ---
export const SORT_OPTIONS: SortOption[] = [
    { value: 'default', label: 'Mặc định' },
    { value: 'popularity', label: 'Phổ biến nhất' },
    { value: 'price-asc', label: 'Giá: Thấp đến cao' },
    { value: 'price-desc', label: 'Giá: Cao đến thấp' },
];

// ================================================================
// --- DỮ LIỆU SẢN PHẨM (QUAN TRỌNG: ĐÃ GẮN ID DANH MỤC) ---
// ================================================================
export const allProducts: Product[] = [
    {
      id: 1,
      name: 'Optimum Nutrition Gold Standard 100% Whey Protein 5Lbs',
      images: ['https://picsum.photos/seed/product1/400/400', 'https://picsum.photos/seed/product1-2/400/400'],
      price: 1850000,
      oldPrice: 2200000,
      rating: 4.8,
      reviews: 1250,
      inStock: true,
      description: 'Gold Standard 100% Whey Blend...',
      brand: 'Optimum Nutrition',
      
      // 👇 Gắn ID để lọc: Whey Protein (1) -> Blend (7)
      category: 'Whey Protein',
      categoryId: 7,       
      parentCategoryId: 1,
      
      flavors: ['Double Rich Chocolate', 'Vanilla Ice Cream', 'Mocha Cappuccino'],
      sizes: ['5Lbs', '10Lbs'],
      sold: 1250, 
      stockQuantity: 100,
      variants: [
        {
          variantId: 101, name: 'Double Rich Chocolate 5Lbs',
          sku: 'GSW-CHOCO-5LB',
          price: 1850000, oldPrice: 2200000, stockQuantity: 100,
          flavor: 'Double Rich Chocolate', size: '5Lbs'
        },
         {
          variantId: 102, name: 'Vanilla Ice Cream 5Lbs',
          sku: 'GSW-VANI-5LB',
          price: 1850000, oldPrice: 2200000, stockQuantity: 80,
          flavor: 'Vanilla Ice Cream', size: '5Lbs'
        },
        {
          variantId: 104, name: 'Double Rich Chocolate 10Lbs',
          sku: 'GSW-CHOCO-10LB',
          price: 3500000, stockQuantity: 50,
          flavor: 'Double Rich Chocolate', size: '10Lbs'
        },
        {
            variantId: 10, name: 'Gold Standard 10Lbs Vani',
            sku: 'GSW-VANI-10LB',
            price: 3500000, stockQuantity: 50,
            flavor: 'Vanilla Ice Cream', size: '10Lbs'
        },
        {
            variantId: 11, name: 'Gold Standard 5Lbs Mocha',
            sku: 'GSW-MOCHA-5LB',
            price: 1850000, stockQuantity: 70, 
            flavor: 'Mocha Cappuccino', size: '5Lbs'
        },
        {
            variantId: 12, name: 'Gold Standard 10Lbs Mocha',
            sku: 'GSW-MOCHA-10LB',
            price: 3500000, stockQuantity: 30,
            flavor: 'Mocha Cappuccino', size: '10Lbs'
        }
      ]
    },
    {
      id: 3,
      name: 'Myprotein Impact Whey Isolate 5.5Lbs',
      images: ['https://picsum.photos/seed/product3/400/400'],
      price: 1790000,
      oldPrice: 2000000,
      rating: 4.7,
      reviews: 850,
      inStock: true,
      description: 'Impact Whey Isolate cung cấp 23g protein mỗi lần dùng...',
      brand: 'Myprotein',
      
      // 👇 Gắn ID để lọc: Whey Protein (1) -> Isolate (8)
      category: 'Whey Protein',
      categoryId: 8,
      parentCategoryId: 1,
      
      flavors: ['Chocolate Brownie', 'Salted Caramel', 'Unflavored'],
      sizes: ['5.5Lbs'],
      sold: 850,
      stockQuantity: 100,
      variants: [
        {
          variantId: 301, name: 'Chocolate Brownie 5.5Lbs',
          sku: 'MP-ISO-CHOC-5.5',
          price: 1790000, oldPrice: 2000000, stockQuantity: 100,
          flavor: 'Chocolate Brownie', size: '5.5Lbs'
        },
        {
          variantId: 302, name: 'Salted Caramel 5.5Lbs',
          sku: 'MP-ISO-SALT-5.5',
          price: 1790000, oldPrice: 2000000, stockQuantity: 100,
          flavor: 'Salted Caramel', size: '5.5Lbs'
        },
        {
          variantId: 303, name: 'Unflavored 5.5Lbs',
          sku: 'MP-ISO-UNFL-5.5',
          price: 1750000, stockQuantity: 50,
          flavor: 'Unflavored', size: '5.5Lbs'
        }
      ]
    },
    {
      id: 7,
      name: 'C4 Original Pre Workout 60 Servings',
      images: ['https://picsum.photos/seed/product7/400/400'],
      price: 950000,
      rating: 4.8,
      reviews: 3200,
      inStock: true,
      description: 'C4 Original là một trong những sản phẩm pre-workout phổ biến nhất thế giới...',
      brand: 'Nutrabolt (C4)',
      
      // 👇 Gắn ID để lọc: Tăng sức mạnh (4) -> Pre-workout (12)
      category: 'Tăng sức mạnh',
      categoryId: 12,
      parentCategoryId: 4,
      
      flavors: ['Icy Blue Razz', 'Fruit Punch', 'Watermelon'],
      sizes: ['60 Servings'], 
      sold: 3200,
      stockQuantity: 100,
      variants: [
        {
          variantId: 701, name: 'Icy Blue Razz 60 Servings',
          sku: 'C4-ICY-60',
          price: 950000, stockQuantity: 100,
          flavor: 'Icy Blue Razz', size: '60 Servings'
        },
        {
          variantId: 702, name: 'Fruit Punch 60 Servings',
          sku: 'C4-FRUIT-60',
          price: 950000, stockQuantity: 100,
          flavor: 'Fruit Punch', size: '60 Servings'
        },
        {
          variantId: 703, name: 'Watermelon 60 Servings',
          sku: 'C4-WATER-60',
          price: 950000, stockQuantity: 100,
          flavor: 'Watermelon', size: '60 Servings'
        }
      ]
    },
    {
        id: 5,
        name: 'Optimum Nutrition Serious Mass 12Lbs',
        images: ['https://picsum.photos/seed/product5/400/400'],
        price: 1650000,
        rating: 4.6,
        reviews: 2100,
        brand: 'Optimum Nutrition',
        inStock: true,
        description: 'Serious Mass là sản phẩm tăng cân tối ưu, cung cấp 1250 calories...',
        
        // 👇 Gắn ID để lọc: Tăng cân (3) -> Chính nó (3)
        category: 'Tăng cân',
        categoryId: 3,
        parentCategoryId: 3,
        
        flavors: ['Chocolate', 'Vanilla', 'Banana'],
        sizes: ['12Lbs'],
        sold: 2100,
        stockQuantity: 100,
        variants: [
          {
            variantId: 501, name: 'Chocolate 12Lbs',
            sku: 'ON-SM-CHOC-12',
            price: 1650000, stockQuantity: 100,
            flavor: 'Chocolate', size: '12Lbs'
          },
          {
            variantId: 502, name: 'Vanilla 12Lbs',
            sku: 'ON-SM-VANI-12',
            price: 1650000, stockQuantity: 100,
            flavor: 'Vanilla', size: '12Lbs'
          },
          {
            variantId: 503, name: 'Banana 12Lbs',
            sku: 'ON-SM-BANA-12',
            price: 1650000, stockQuantity: 100,
            flavor: 'Banana', size: '12Lbs'
          }
        ]
    },
];

// --- EXPORTS KHÁC ---
export const trendingProducts = allProducts.slice(0, 4);
export const wheyProducts = allProducts.filter(p => p.category === 'Whey Protein').slice(0, 6);
export const strengthProducts = allProducts.filter(p => p.category === 'Tăng sức mạnh').slice(0, 6);

export const supplementArticles: Article[] = [
  
    { id: 1, title: 'Whey Protein là gì? Tác dụng và cách dùng hiệu quả', date: '15/07/2023', snippet: 'Tìm hiểu sâu về Whey Protein, lợi ích đối với người tập gym và cách sử dụng để tối ưu hóa sự phát triển cơ bắp.', image: 'https://picsum.photos/seed/article1/400/200', category: 'Kiến thức Supplement', url: 'https://www.thegioiwhey.com/blogs/kien-thuc-the-hinh/whey-protein-la-gi-tac-dung-huu-ich-cua-whey-protein' },
    { id: 2, title: 'Creatine: "Vua" của các loại thực phẩm bổ sung tăng sức mạnh', date: '12/07/2023', snippet: 'Creatine đã được chứng minh là một trong những chất bổ sung hiệu quả nhất để tăng cường sức mạnh và hiệu suất tập luyện.', image: 'https://picsum.photos/seed/article2/400/200', category: 'Kiến thức Supplement', url: 'https://gymstore.vn/creatine-la-gi' },
];

export const nutritionArticles: Article[] = [
    { id: 3, title: 'BMR là gì? Hướng dẫn tính BMR để tăng/giảm cân khoa học', date: '10/07/2023', snippet: 'Chỉ số BMR giúp bạn xác định lượng calo cần thiết mỗi ngày để duy trì hoặc thay đổi cân nặng một cách hiệu quả.', image: 'https://picsum.photos/seed/article3/400/200', category: 'Kiến thức Dinh dưỡng', url: 'https://tamanhhospital.vn/bmr' },
    { id: 4, title: 'Top 10 thực phẩm giàu protein cho người tập gym', date: '08/07/2023', snippet: 'Xây dựng cơ bắp không chỉ đến từ việc tập luyện mà còn phụ thuộc rất nhiều vào chế độ ăn uống giàu protein.', image: 'https://picsum.photos/seed/article4/400/200', category: 'Kiến thức Dinh dưỡng', url: 'https://www.wheystore.vn/news/thuc-pham-giau-protein-1154' },
];