import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import { NavLink, Product, Theme, User } from '../types';

interface HeaderProps {
  navLinks: NavLink[];
  products: Product[];
  onCartClick: () => void;
  onAuthClick: () => void;
  onCategorySelect: (category: string) => void;
  onProductSelect: (product: Product) => void;
  onLogoClick: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentUser: User | null;
  onLogout: () => void;
  onAccountClick: () => void;
  onOrderHistoryClick: () => void;
  isAdminViewingSite: boolean;
  onReturnToAdmin: () => void;
}

const SearchIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const UserIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const CartIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.093-.822l3.481-9.301A1.125 1.125 0 0020.898 3H4.227L3.34 1.737A1.125 1.125 0 002.25 1H.5z" />
    </svg>
);

const PaletteIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402a3.75 3.75 0 00-5.304-5.304L4.098 14.6c-1.464 1.464-1.464 3.84 0 5.304z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.402-2.368-1.07-3.22a4.5 4.5 0 00-6.364-6.364L12 7.5" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ navLinks, products, onCartClick, onAuthClick, onCategorySelect, onProductSelect, onLogoClick, theme, setTheme, currentUser, onLogout, onAccountClick, onOrderHistoryClick, isAdminViewingSite, onReturnToAdmin }) => {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setIsSearchActive(false);
        }
        if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
            setIsThemeMenuOpen(false);
        }
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavLinkClick = (category?: string) => {
    if (category === 'Trang chủ') {
      onLogoClick();
    } else if (category) {
      onCategorySelect(category);
    }
  };

  const handleResultClick = (product: Product) => {
    onProductSelect(product);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchActive(false);
  };

  return (
    <>
      {isAdminViewingSite && (
        <div className="bg-gym-yellow text-gym-darker py-2 px-4 fixed top-0 w-full z-50">
          <div className="container mx-auto flex justify-between items-center">
            <p className="text-sm font-bold uppercase tracking-wider">
              Chế độ Admin
            </p>
            <button
              onClick={onReturnToAdmin}
              className="bg-gym-darker text-white px-4 py-1.5 rounded-md hover:bg-black transition-colors text-xs font-bold uppercase tracking-wider"
            >
              Quay lại trang Admin
            </button>
          </div>
        </div>
      )}
      <header className={`bg-gym-darker sticky z-40 shadow-lg shadow-black/20 ${isAdminViewingSite ? 'top-[36px]' : 'top-0'}`}>
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex justify-between items-center py-3 border-b border-gray-800">
            <button onClick={onLogoClick} className="text-3xl font-extrabold tracking-wider">
              GYM<span className="text-gym-yellow">SUP</span>
            </button>
            <div ref={searchContainerRef} className="hidden lg:flex flex-1 max-w-xl mx-8 relative">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full bg-gym-dark border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchActive(true)}
                />
                <button className="absolute right-0 top-0 h-full bg-gym-yellow text-gym-darker px-4 rounded-r-md">
                  <SearchIcon className="h-5 w-5" />
                </button>
              </div>
              {isSearchActive && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gym-dark border border-gray-700 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <ul>
                      {searchResults.map(product => (
                        <li key={product.id} className="border-b border-gray-700 last:border-b-0">
                          <button onClick={() => handleResultClick(product)} className="flex items-center w-full p-3 hover:bg-gym-darker transition-colors text-left">
                            <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-md mr-4" />
                            <div className="flex-1">
                              <p className="text-white font-semibold text-sm">{product.name}</p>
                              <p className="text-gym-yellow text-xs">{product.price.toLocaleString('vi-VN')}₫</p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gym-gray">
                      Không tìm thấy sản phẩm nào.
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div ref={themeMenuRef} className="relative">
                  <button 
                      onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                      className={`text-gym-gray hover:text-gym-yellow transition-colors ${isThemeMenuOpen ? 'text-gym-yellow' : ''}`}
                      aria-label="Change theme"
                  >
                      <PaletteIcon className="h-6 w-6" />
                  </button>
                  {isThemeMenuOpen && (
                      <div className="absolute right-0 mt-3 w-36 bg-gym-dark border border-gray-700 rounded-md shadow-lg z-50 animate-fade-in py-1">
                          <ul>
                              <li>
                                  <button
                                      onClick={() => { setTheme('default'); setIsThemeMenuOpen(false); }}
                                      className={`flex items-center w-full px-3 py-2 text-sm transition-colors ${theme === 'default' ? 'bg-gym-yellow text-gym-darker' : 'text-gym-gray hover:bg-gym-darker hover:text-white'}`}
                                  >Mặc định</button>
                              </li>
                              <li>
                                  <button
                                      onClick={() => { setTheme('light'); setIsThemeMenuOpen(false); }}
                                      className={`flex items-center w-full px-3 py-2 text-sm transition-colors ${theme === 'light' ? 'bg-gym-yellow text-gym-darker' : 'text-gym-gray hover:bg-gym-darker hover:text-white'}`}
                                  >Trắng</button>
                              </li>
                              <li>
                                  <button
                                      onClick={() => { setTheme('black'); setIsThemeMenuOpen(false); }}
                                      className={`flex items-center w-full px-3 py-2 text-sm transition-colors ${theme === 'black' ? 'bg-gym-yellow text-gym-darker' : 'text-gym-gray hover:bg-gym-darker hover:text-white'}`}
                                  >Đen</button>
                              </li>
                          </ul>
                      </div>
                  )}
              </div>
              {currentUser ? (
                <div ref={userMenuRef} className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                    className="flex items-center space-x-2 text-gym-gray hover:text-gym-yellow transition-colors"
                  >
                    <UserIcon className="h-6 w-6" />
                    <span className="hidden md:inline text-sm font-semibold">{currentUser.name}</span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-gym-dark border border-gray-700 rounded-md shadow-lg z-50 animate-fade-in py-1">
                      <ul>
                        <li>
                          <button onClick={() => { onAccountClick(); setIsUserMenuOpen(false); }} className="flex items-center w-full px-3 py-2 text-sm text-gym-gray hover:bg-gym-darker hover:text-white transition-colors">
                            Tài khoản của tôi
                          </button>
                        </li>
                        <li>
                          <button onClick={() => { onOrderHistoryClick(); setIsUserMenuOpen(false); }} className="flex items-center w-full px-3 py-2 text-sm text-gym-gray hover:bg-gym-darker hover:text-white transition-colors">
                            Lịch sử đơn hàng
                          </button>
                        </li>
                        <li>
                          <hr className="border-gray-700 my-1"/>
                        </li>
                        <li>
                          <button
                            onClick={() => { onLogout(); setIsUserMenuOpen(false); }}
                            className="flex items-center w-full px-3 py-2 text-sm text-gym-gray hover:bg-gym-darker hover:text-red-500 transition-colors"
                          >
                            Đăng xuất
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={onAuthClick} className="flex items-center space-x-2 text-gym-gray hover:text-gym-yellow transition-colors">
                  <UserIcon className="h-6 w-6" />
                  <span className="hidden md:inline text-sm">Tài khoản</span>
                </button>
              )}
              <button onClick={onCartClick} className="relative flex items-center space-x-2 text-gym-gray hover:text-gym-yellow transition-colors">
                <CartIcon className="h-6 w-6" />
                <span className="hidden md:inline text-sm">Giỏ hàng</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 6h4"></path></svg>
              </button>
            </div>
          </div>
          {/* Navigation */}
          <nav className="hidden lg:flex justify-center items-center py-3">
            <ul className="flex space-x-8">
              {navLinks.map((link) => (
                <li key={link.label} className="group">
                  <a href={link.href} onClick={() => handleNavLinkClick(link.label)} className="text-sm font-bold uppercase tracking-wider hover:text-gym-yellow transition-colors pb-3">
                    {link.label}
                  </a>
                  {link.megaMenu && (
                    <div className="absolute left-0 w-full bg-gym-dark shadow-lg mt-3 p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-4">
                      <div className="container mx-auto px-4">
                          <div className="grid grid-cols-4 gap-8">
                              {link.megaMenu.map(item => (
                                  <div key={item.title}>
                                      <h3 className="font-bold text-gym-yellow uppercase mb-4">{item.title}</h3>
                                      <ul className="space-y-2">
                                          {item.links.map(subLink => (
                                              <li key={subLink.label}><a href={subLink.href} onClick={() => handleNavLinkClick(subLink.category || subLink.label)} className="text-gym-gray hover:text-white transition-colors">{subLink.label}</a></li>
                                          ))}
                                      </ul>
                                  </div>
                              ))}
                          </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-gym-dark py-4 px-4">
               <ul className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} onClick={() => { handleNavLinkClick(link.label); setIsMenuOpen(false); }} className="text-sm font-bold uppercase tracking-wider hover:text-gym-yellow transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
               </ul>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;