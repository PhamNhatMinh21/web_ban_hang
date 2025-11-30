// File: src/components/admin/AddProductModal.tsx

import React, { useState, useEffect } from 'react';
import { Product, CreateProductRequest, ProductVariantRequest } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (request: CreateProductRequest) => void;
  onUpdateProduct: (productId: number, request: CreateProductRequest) => void;
  productToEdit: Product | null;
}

// Type cho Form nhập liệu (Toàn bộ là string để dễ nhập)
type VariantFormState = {
  name: string;
  sku: string;
  price: string;
  salePrice: string;
  stockQuantity: string;
  flavor: string;
  size: string;
  imageUrl: string;
};

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  onUpdateProduct,
  productToEdit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [brandId, setBrandId] = useState<number>(0);
  const [imagesInput, setImagesInput] = useState('');
  const [error, setError] = useState('');
  
  const [variantsState, setVariantsState] = useState<VariantFormState[]>([]);

  const isEditMode = !!productToEdit;

  const inputStyles = "w-full px-3 py-2 bg-[var(--admin-bg-card)] border border-[var(--admin-border-color)] rounded-md text-[var(--admin-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)] placeholder-gray-500";
  const smallInputStyles = "w-full px-2 py-1.5 text-sm bg-[var(--admin-bg-card)] border border-[var(--admin-border-color)] rounded-md text-[var(--admin-text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)] placeholder-gray-500";

  // Load dữ liệu khi mở Modal hoặc khi Edit
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && productToEdit) {
        setName(productToEdit.name);
        setDescription(productToEdit.description || '');
        setCategoryId(productToEdit.categoryId || 0);
        setBrandId(productToEdit.brandId || 0);
        setImagesInput((productToEdit.images || []).join('\n'));

        const variantsFromProduct = productToEdit.variants.map(v => ({
          name: v.name,
          sku: v.sku,
          price: String(v.price),
          // Load lại giá cũ (nếu có) hoặc giá sale
          salePrice: v.oldPrice ? String(v.oldPrice) : (v.salePrice ? String(v.salePrice) : ''),
          stockQuantity: String(v.stockQuantity),
          flavor: v.flavor || '',
          size: v.size || '',
          imageUrl: v.imageUrl || '',
        }));
        setVariantsState(variantsFromProduct);
      } else {
        // Reset form khi thêm mới
        setName('');
        setDescription('');
        setCategoryId(0);
        setBrandId(0);
        setImagesInput('');
        setVariantsState([
          { name: '', sku: '', price: '', stockQuantity: '', salePrice: '', flavor: '', size: '', imageUrl: '' },
        ]);
      }
      setError('');
    }
  }, [isOpen, productToEdit, isEditMode]);

  const previewImages = imagesInput.split('\n').map(url => url.trim()).filter(url => url !== '');

  if (!isOpen) return null;

  const handleAddVariantRow = () => {
    setVariantsState([
      ...variantsState,
      { name: '', sku: '', price: '', stockQuantity: '', salePrice: '', flavor: '', size: '', imageUrl: '' },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variantsState.length <= 1) return;
    const newVariants = [...variantsState];
    newVariants.splice(index, 1);
    setVariantsState(newVariants);
  };

  const handleVariantChange = (index: number, field: keyof VariantFormState, value: string) => {
    const newVariants = variantsState.map((variant, i) =>
      i === index ? { ...variant, [field]: value } : variant
    );
    setVariantsState(newVariants);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Tên sản phẩm là bắt buộc.');
    if (categoryId === 0) return setError('Chọn danh mục.');
    if (brandId === 0) return setError('Chọn thương hiệu.');

    const finalImages = imagesInput.split('\n').map(url => url.trim()).filter(url => url !== '');
    if (finalImages.length === 0) finalImages.push('https://placehold.co/400x400?text=No+Image');

    const finalVariants: ProductVariantRequest[] = [];
    let errorMessage = '';

    for (const v of variantsState) {
      // 1. Parse dữ liệu số
      const rawPrice = Number(v.price.trim());     
      const rawSalePrice = v.salePrice && v.salePrice.trim() !== '' 
                           ? Number(v.salePrice.trim()) 
                           : undefined;             

      let finalPrice = rawPrice;
      let finalSalePrice = rawSalePrice;

      // ==========================================================
      // 👇👇👇 LOGIC TỰ ĐỘNG ĐẢO GIÁ (MAGIC FIX) 👇👇👇
      // Nếu bạn nhập: Giá 1tr, KM 800k -> Hệ thống tự đảo lại: Giá 800k, Giá cũ 1tr
      // Để hiển thị đúng logic giảm giá ở Frontend
      if (rawSalePrice !== undefined && rawSalePrice > 0 && rawSalePrice < rawPrice) {
          finalPrice = rawSalePrice;    // Giá bán thực (thấp hơn)
          finalSalePrice = rawPrice;    // Giá gạch ngang (cao hơn)
      }
      // ==========================================================

      const t = {
        name: v.name.trim(),
        sku: v.sku.trim(),
        flavor: v.flavor.trim(),
        size: v.size.trim(),
      };

      if (!t.name || !t.sku || !t.flavor || !t.size) { errorMessage = 'Điền đầy đủ thông tin biến thể (Tên, SKU, Vị, Size)'; break; }
      if (isNaN(finalPrice) || finalPrice <= 0) { errorMessage = 'Giá không hợp lệ'; break; }
      if (isNaN(Number(v.stockQuantity))) { errorMessage = 'Tồn kho phải là số'; break; }

      finalVariants.push({
        name: t.name,
        sku: t.sku,
        price: finalPrice,        // Giá bán (Thấp)
        salePrice: finalSalePrice,// Giá cũ (Cao)
        stockQuantity: Number(v.stockQuantity),
        imageUrl: v.imageUrl.trim(),
        flavor: t.flavor,
        size: t.size,
      });
    }

    if (errorMessage) { setError(errorMessage); return; }

    const payload: CreateProductRequest = {
      name: name.trim(),
      description: description.trim() || '',
      categoryId: categoryId,
      brandId: brandId,
      imageUrls: finalImages, // Đã khớp với types.ts
      variants: finalVariants,
    };

    try {
      if (isEditMode && productToEdit) {
        onUpdateProduct(productToEdit.id, payload);
      } else {
        onAddProduct(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--admin-bg-main)] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-[var(--admin-border-color)]">
          <h2 className="text-2xl font-bold text-[var(--admin-text-main)]">{isEditMode ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Thông tin chung */}
          <section className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                <input value={name} onChange={e => setName(e.target.value)} className={inputStyles} placeholder="VD: Whey Gold Standard" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Danh mục</label>
                    <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value))} className={inputStyles}>
                        <option value={0}>Chọn danh mục</option>
                        <optgroup label="WHEY PROTEIN">
                            <option value={7}>Whey Protein Blend</option> 
                            <option value={8}>Whey Protein Isolate</option>
                            <option value={9}>Whey Hydrolyzed </option> 
                            <option value={10}>Vegan Protein</option> 
                           <option value={11}>Protein Bar</option>  
                      <option value={15}> Dạng bột</option>
                        </optgroup>
                
                         <option value={3}>Tăng cân</option>
                         <optgroup label="TĂNG SỨC MẠNH">
                            <option value={12}>Pre-workout</option>
                            
                            <option value={13}>BCAA / EAA</option> 
                            <option value={14}>Creatine</option>
                        </optgroup>
                        <option value={5}>Hỗ trợ sức khỏe</option>
                        <option value={6}>Phụ kiện</option>
     
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Thương hiệu</label>
                    <select value={brandId} onChange={e => setBrandId(Number(e.target.value))} className={inputStyles}>
                        <option value={0}>Chọn thương hiệu</option>
                        <option value={1}>Optimum Nutrition</option>
                        <option value={2}>Myprotein</option>
                        <option value={3}>Rule 1</option>
                        <option value={4}>Applied Nutrition</option>
                        <option value={5}>C4</option>
                        <option value={6}>BPI Sports</option>
                        <option value={7}>Thorne Research</option>
                        <option value={8}>Nutrex</option>
                        <option value={9}>Redcon1</option>
                        <option value={10}>GymSup</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Hình ảnh chung (Mỗi dòng 1 link)</label>
                <textarea value={imagesInput} onChange={e => setImagesInput(e.target.value)} rows={3} className={inputStyles} placeholder="https://anh1.jpg&#10;https://anh2.jpg" />
                {previewImages.length > 0 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                        {previewImages.map((u, i) => <img key={i} src={u} className="w-16 h-16 object-cover rounded border border-gray-600" alt="preview"/>)}
                    </div>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className={inputStyles} />
            </div>
          </section>

          <hr className="border-[var(--admin-border-color)]" />

          {/* Biến thể */}
          <section>
            <h3 className="text-lg font-bold mb-3">Danh sách biến thể</h3>
            <div className="space-y-4">
              {variantsState.map((variant, index) => (
                <div key={index} className="bg-[var(--admin-bg-card)] p-4 rounded border border-[var(--admin-border-color)] space-y-3 relative">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-[var(--admin-text-accent)]">Biến thể #{index + 1}</label>
                    {variantsState.length > 1 && <button type="button" onClick={() => handleRemoveVariant(index)} className="text-red-500 text-xs font-bold hover:underline">XÓA DÒNG</button>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><label className="text-xs mb-1 block">Tên biến thể</label><input value={variant.name} onChange={e => handleVariantChange(index, 'name', e.target.value)} className={smallInputStyles} placeholder="VD: 5Lbs Chocolate" /></div>
                    <div><label className="text-xs mb-1 block">SKU (Mã kho)</label><input value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} className={smallInputStyles} placeholder="VD: ON-CHOCO-5LB" /></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     <div><label className="text-xs mb-1 block">Hương vị</label><input value={variant.flavor} onChange={e => handleVariantChange(index, 'flavor', e.target.value)} className={smallInputStyles} placeholder="Chocolate" /></div>
                     <div><label className="text-xs mb-1 block">Kích cỡ</label><input value={variant.size} onChange={e => handleVariantChange(index, 'size', e.target.value)} className={smallInputStyles} placeholder="5Lbs" /></div>
                  </div>

                  {/* Ảnh riêng */}
                  <div>
                    <label className="text-xs mb-1 block text-blue-400">Link ảnh riêng (Nếu có)</label>
                    <div className="flex gap-2">
                        <input value={variant.imageUrl} onChange={e => handleVariantChange(index, 'imageUrl', e.target.value)} className={smallInputStyles} placeholder="https://..." />
                        {variant.imageUrl && <img src={variant.imageUrl} className="w-9 h-9 object-cover rounded border border-gray-600"/>}
                    </div>
                  </div>

                  {/* Giá tiền */}
                  <div className="grid grid-cols-3 gap-3 bg-[var(--admin-bg-hover)] p-2 rounded">
                    <div>
                        <label className="text-xs mb-1 block font-bold text-white">Giá gốc (Bán ra)</label>
                        <input type="number" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} className={smallInputStyles} placeholder="1000000" />
                    </div>
                    <div>
                        <label className="text-xs mb-1 block font-bold text-yellow-400">Giá Khuyến Mãi</label>
                        <input type="number" value={variant.salePrice} onChange={e => handleVariantChange(index, 'salePrice', e.target.value)} className={smallInputStyles} placeholder="800000 (Nếu có)" />
                        <p className="text-[10px] text-gray-400 mt-1">*Nếu nhập nhỏ hơn Giá gốc, hệ thống tự hiểu là giảm giá.</p>
                    </div>
                    <div>
                        <label className="text-xs mb-1 block font-bold text-white">Tồn kho</label>
                        <input type="number" value={variant.stockQuantity} onChange={e => handleVariantChange(index, 'stockQuantity', e.target.value)} className={smallInputStyles} placeholder="100" />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={handleAddVariantRow} className="w-full border-2 border-dashed border-gray-600 py-3 text-sm font-bold rounded hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                + Thêm biến thể mới
              </button>
            </div>
          </section>

          {error && <p className="text-red-500 text-center font-bold">{error}</p>}
        </form>

        <div className="flex justify-end p-6 border-t border-[var(--admin-border-color)] gap-4">
          <button onClick={onClose} className="px-4 py-2 rounded text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Hủy bỏ</button>
          <button onClick={handleSubmit} className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">
            {isEditMode ? 'Cập nhật' : 'Lưu sản phẩm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;