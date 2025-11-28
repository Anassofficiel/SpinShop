// src/pages/Product.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, Check, Star, Gift, Sparkles, Heart, Truck } from 'lucide-react';

import Header from '../components/Header/Header';
import { Button } from '../components/UI/button';
import { Input } from '../components/UI/input';
import { Label } from '../components/UI/label';
import { Card, CardContent } from '../components/UI/card';
import { useOffer } from '../context/OfferContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

type ProductImage = string;

interface ProductData {
  id: string;
  countryCode: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: ProductImage[];
  inStock: boolean;
  sizes: string[];
  rating?: number;
  reviews?: number;
}

// ------------------------------------------------------------------
// داتا المنتجات ديال المغرب
// ------------------------------------------------------------------

const MA_PRODUCTS: ProductData[] = [
  {
    id: 'MA-1',
    countryCode: 'MA',
    name: 'Morocco Home Kids Jersey 24/25',
    description: 'توني الدار للأطفال بألوان المنتخب المغربي، قماش خفيف ومريح للّعب اليومي.',
    price: 249,
    originalPrice: 349,
    images: [
      'https://i.postimg.cc/s2JsH9Wj/image.png',
      'https://i.postimg.cc/kgKwNVds/Chat-GPT-Image-13-nov-2025-16-21-32.png',
      'https://i.postimg.cc/kgKwNVds/Chat-GPT-Image-13-nov-2025-16-21-32.png',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 'MA-2',
    countryCode: 'MA',
    name: 'Morocco Away Kids Jersey 24/25',
    description: 'توني الإياب بتصميم عصري، مناسب للمقابلات والخروج اليومي.',
    price: 279,
    originalPrice: 399,
    images: [
      'https://via.placeholder.com/800x800?text=MA-2+Front',
      'https://via.placeholder.com/800x800?text=MA-2+Back',
      'https://via.placeholder.com/800x800?text=MA-2+Detail',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    rating: 4.7,
    reviews: 142,
  },
  {
    id: 'MA-3',
    countryCode: 'MA',
    name: 'Morocco Kids Training Top',
    description: 'توب تدريب خفيف، مثالي للجري والتدريب اليومي في الجو المعتدل.',
    price: 199,
    originalPrice: 279,
    images: [
      'https://via.placeholder.com/800x800?text=MA-3+Front',
      'https://via.placeholder.com/800x800?text=MA-3+Back',
      'https://via.placeholder.com/800x800?text=MA-3+Detail',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    rating: 4.6,
    reviews: 98,
  },
  {
    id: 'MA-4',
    countryCode: 'MA',
    name: 'Morocco Kids Hoodie',
    description: 'هودي دافئ لأيام الشتاء، بطبعة شعار المغرب في الأمام.',
    price: 279,
    originalPrice: 389,
    images: [
      'https://via.placeholder.com/800x800?text=MA-4+Front',
      'https://via.placeholder.com/800x800?text=MA-4+Back',
      'https://via.placeholder.com/800x800?text=MA-4+Detail',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 'MA-5',
    countryCode: 'MA',
    name: 'Morocco Kids Shorts',
    description: 'شورت رياضي خفيف مع خطوط جانبية بألوان العلم المغربي.',
    price: 129,
    originalPrice: 189,
    images: [
      'https://via.placeholder.com/800x800?text=MA-5+Front',
      'https://via.placeholder.com/800x800?text=MA-5+Back',
      'https://via.placeholder.com/800x800?text=MA-5+Detail',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    rating: 4.6,
    reviews: 124,
  },
  {
    id: 'MA-6',
    countryCode: 'MA',
    name: 'Morocco Kids Full Kit',
    description: 'طقم كامل: توني + شورت، مثالي للهدايا أو المباريات.',
    price: 349,
    originalPrice: 499,
    images: [
      'https://via.placeholder.com/800x800?text=MA-6+Front',
      'https://via.placeholder.com/800x800?text=MA-6+Back',
      'https://via.placeholder.com/800x800?text=MA-6+Detail',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    rating: 4.8,
    reviews: 167,
  },
  {
    id: 'MA-7',
    countryCode: 'MA',
    name: 'Morocco Goalkeeper Kids Jersey',
    description: 'توني حارس المرمى للأطفال بتصميم مميّز ولون مختلف عن اللاعبين.',
    price: 259,
    originalPrice: 359,
    images: [
      'https://via.placeholder.com/800x800?text=MA-7+Front',
      'https://via.placeholder.com/800x800?text=MA-7+Back',
      'https://via.placeholder.com/800x800?text=MA-7+Detail',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 'MA-8',
    countryCode: 'MA',
    name: 'Morocco Kids Lifestyle T-shirt',
    description: 'تي شورت كاجوال بالألوان المغربية، مناسب للمدرسة والخروج.',
    price: 149,
    originalPrice: 219,
    images: [
      'https://via.placeholder.com/800x800?text=MA-8+Front',
      'https://via.placeholder.com/800x800?text=MA-8+Back',
      'https://via.placeholder.com/800x800?text=MA-8+Detail',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    rating: 4.5,
    reviews: 87,
  },
  {
    id: 'MA-9',
    countryCode: 'MA',
    name: 'Morocco Kids Tracksuit',
    description: 'سيرفيت كامل للأطفال بجودة عالية، مناسب للرياضة والسفر.',
    price: 399,
    originalPrice: 549,
    images: [
      'https://via.placeholder.com/800x800?text=MA-9+Front',
      'https://via.placeholder.com/800x800?text=MA-9+Back',
      'https://via.placeholder.com/800x800?text=MA-9+Detail',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    rating: 4.9,
    reviews: 178,
  },
  {
    id: 'MA-10',
    countryCode: 'MA',
    name: 'Morocco Kids Zip Hoodie',
    description: 'هودي بسحاب أمامي، سهل في اللبس والخلع، مثالي للمدرسة.',
    price: 289,
    originalPrice: 399,
    images: [
      'https://via.placeholder.com/800x800?text=MA-10+Front',
      'https://via.placeholder.com/800x800?text=MA-10+Back',
      'https://via.placeholder.com/800x800?text=MA-10+Detail',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    rating: 4.8,
    reviews: 145,
  },
];

const PRODUCTS_BY_COUNTRY: Record<string, ProductData[]> = {
  MA: MA_PRODUCTS,
};

// ------------------------------------------------------------------
// إعدادات الخطوط
// ------------------------------------------------------------------

const FONT_OPTIONS = [
  {
    id: 'poppins',
    label: 'Poppins',
    family: '"Poppins", system-ui, sans-serif',
  },
  { 
    id: 'arial', 
    label: 'Arial', 
    family: 'Arial, system-ui, sans-serif' 
  },
  {
    id: 'impact',
    label: 'Impact',
    family: 'Impact, "Arial Black", sans-serif',
  },
  {
    id: 'tahoma',
    label: 'Tahoma',
    family: 'Tahoma, Verdana, sans-serif',
  },
];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentOffer } = useOffer();
  const { addToCart } = useCart();

  const [customization, setCustomization] = useState({
    name: '',
    number: '',
  });

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFont, setSelectedFont] = useState<string>(FONT_OPTIONS[0].id);
  const [nameColor, setNameColor] = useState<string>('#ffffff');
  const [numberColor, setNumberColor] = useState<string>('#ffffff');

  // نجيب المنتج حسب الـ id
  const product: ProductData | undefined = (() => {
    const allMA = PRODUCTS_BY_COUNTRY.MA;
    if (!id) return allMA[0];
    return allMA.find((p) => p.id === id) || allMA[0];
  })();

  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize(null);
    }
    setSelectedImageIndex(0);
  }, [id, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  // ✅ حساب السعر النهائي مع خصم العجلة
  const calculateFinalPrice = (price: number) => {
    if (currentOffer?.type === 'discount' && currentOffer.value) {
      return Math.round(price * (1 - currentOffer.value / 100));
    }
    return price;
  };

  const finalPrice = calculateFinalPrice(product.price);
  const wheelSavings = product.price - finalPrice;
  const hasWheelDiscount = currentOffer?.type === 'discount';
  const hasFreeShipping = currentOffer?.type === 'shipping';
  const noOffer = currentOffer?.type === 'no_luck';

  // حساب خصم البطاقة الأصلي
  const originalDiscount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const mainImage =
    product.images[selectedImageIndex] ??
    'https://via.placeholder.com/800x800?text=Product';

  const currentFont =
    FONT_OPTIONS.find((f) => f.id === selectedFont) ?? FONT_OPTIONS[0];

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('⚠️ اختر المقاس أولا');
      return;
    }

    // التحقق من طول الاسم (حد أقصى 12 حرف)
    if (customization.name && customization.name.length > 12) {
      toast.error('⚠️ الاسم يجب أن لا يتجاوز 12 حرف');
      return;
    }

    // التحقق من طول الرقم (حد أقصى 2 رقم)
    if (customization.number && customization.number.length > 2) {
      toast.error('⚠️ الرقم يجب أن لا يتجاوز رقمين');
      return;
    }

    addToCart(
      {
        ...product,
        selectedSize,
        selectedFont,
        nameColor,
        numberColor,
      },
      customization
    );
    toast.success('✅ تمت الإضافة إلى السلة بنجاح');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-3xl animate-float-slow" />
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 hover:bg-slate-100 text-slate-700 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          رجوع
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ✅ الصور */}
          <div>
            <Card className="relative overflow-hidden mb-4 border-2 border-slate-200 shadow-xl rounded-3xl bg-white">
              <div className="relative aspect-square">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

               {/* ✅ عرض الاسم والرقم على الصورة - نسخة احترافية */}
{(customization.name || customization.number) && (
  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
    {customization.name && (
      <div
        style={{
          fontFamily: currentFont.family,
          color: nameColor,
          textShadow: `
            0 2px 10px rgba(0,0,0,0.9),
            0 4px 20px rgba(0,0,0,0.7),
            0 6px 30px rgba(0,0,0,0.5),
            -2px -2px 0 rgba(0,0,0,0.8),
            2px -2px 0 rgba(0,0,0,0.8),
            -2px 2px 0 rgba(0,0,0,0.8),
            2px 2px 0 rgba(0,0,0,0.8)
          `,
          top: '25%',
          letterSpacing: '0.15em',
        }}
        className="absolute text-4xl md:text-5xl lg:text-6xl font-black uppercase"
      >
        {customization.name}
      </div>
    )}

    {customization.number && (
      <div
        style={{
          fontFamily: currentFont.family,
          color: numberColor,
          textShadow: `
            0 3px 15px rgba(0,0,0,1),
            0 6px 30px rgba(0,0,0,0.8),
            0 10px 50px rgba(0,0,0,0.6),
            -3px -3px 0 rgba(0,0,0,0.9),
            3px -3px 0 rgba(0,0,0,0.9),
            -3px 3px 0 rgba(0,0,0,0.9),
            3px 3px 0 rgba(0,0,0,0.9)
          `,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        className="absolute text-[10rem] md:text-[12rem] lg:text-[14rem] leading-none font-black"
      >
        {customization.number}
      </div>
                     )}
                  </div>
                )}
              </div>

              {/* ✅ الشارات */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between gap-2">
                {originalDiscount > 0 && (
                  <div className="rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 shadow-xl border-2 border-white">
                    <span className="text-sm font-black text-white">
                      -{originalDiscount}%
                    </span>
                  </div>
                )}

                {hasWheelDiscount && (
                  <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 shadow-xl border-2 border-white animate-bounce-slow">
                    <span className="text-sm font-black text-white">
                      🎁 -{currentOffer.value}%
                    </span>
                  </div>
                )}

                {hasFreeShipping && (
                  <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 shadow-xl border-2 border-white animate-bounce-slow">
                    <span className="text-sm font-black text-white">
                      🚚 مجاني
                    </span>
                  </div>
                )}
              </div>

              {/* زر المفضلة */}
              <button
                className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:bg-red-50 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Heart className="w-6 h-6 text-slate-600 hover:text-red-500 transition-colors" />
              </button>
            </Card>

            {/* thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      'border-2 rounded-2xl overflow-hidden transition-all shadow-md hover:shadow-xl',
                      selectedImageIndex === idx
                        ? 'border-blue-500 ring-4 ring-blue-200 scale-105'
                        : 'border-slate-200 hover:border-blue-300'
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ✅ التفاصيل */}
          <div>
            <h1 
              className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {product.name}
            </h1>

            {/* التقييم */}
            {product.rating && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-600">
                  ({product.reviews} تقييم)
                </span>
              </div>
            )}

            {/* ✅ الأسعار - نفس المنطق من Collection */}
            <div className="flex flex-col gap-3 mb-5 p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-slate-200 shadow-lg">
              {/* حالة 1: لقد نفدت محاولاتك */}
              {noOffer && (
                <div className="flex flex-col gap-2">
                  <span 
                    className="text-5xl md:text-6xl font-black text-green-600"
                    style={{ fontFamily: 'Cairo, sans-serif' }}
                  >
                    {product.price} MAD
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg font-bold text-slate-400 line-through">
                      {product.originalPrice} MAD
                    </span>
                  )}
                </div>
              )}

              {/* حالة 2: خصم من العجلة */}
              {hasWheelDiscount && (
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-3 mb-2">
                    <Gift className="w-6 h-6 text-green-600 animate-bounce-slow" />
                    <span className="text-sm font-black text-green-600">
                      خصم {currentOffer.value}% من عجلة الحظ 🎉
                    </span>
                  </div>
                  <span 
                    className="text-5xl md:text-6xl font-black text-red-600"
                    style={{ fontFamily: 'Cairo, sans-serif' }}
                  >
                    {finalPrice} MAD
                  </span>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-2xl font-bold text-green-600 line-through">
                      {product.price} MAD
                    </span>
                    <span className="text-sm font-black text-white bg-red-500 px-4 py-2 rounded-full shadow-lg">
                      وفّر {wheelSavings} MAD
                    </span>
                  </div>
                </div>
              )}

              {/* حالة 3: شحن مجاني */}
              {hasFreeShipping && (
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-3 mb-2">
                    <Truck className="w-6 h-6 text-blue-600 animate-bounce-slow" />
                    <span className="text-sm font-black text-blue-600">
                      شحن مجاني من عجلة الحظ 🚚
                    </span>
                  </div>
                  <span 
                    className="text-5xl md:text-6xl font-black text-green-600"
                    style={{ fontFamily: 'Cairo, sans-serif' }}
                  >
                    {product.price} MAD
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg font-bold text-slate-400 line-through">
                      {product.originalPrice} MAD
                    </span>
                  )}
                </div>
              )}

              {/* حالة 4: لم يدور العجلة */}
              {!currentOffer && (
                <div className="flex flex-col gap-2">
                  <span 
                    className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    style={{ fontFamily: 'Cairo, sans-serif' }}
                  >
                    {product.price} MAD
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg font-bold text-slate-400 line-through">
                      {product.originalPrice} MAD
                    </span>
                  )}
                </div>
              )}
            </div>

            <p 
              className="text-slate-600 mb-5 text-base md:text-lg leading-relaxed"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {product.description}
            </p>

            <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-green-50 border-2 border-green-200">
              <Check className="w-6 h-6 text-green-600" />
              <span className="text-green-700 font-bold text-lg">
                متوفر في المخزون
              </span>
            </div>

            {/* ✅ المقاسات */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <p className="mb-3 text-base font-black text-slate-700"
                   style={{ fontFamily: 'Cairo, sans-serif' }}>
                  اختر المقاس
                </p>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center text-base font-black border-2 transition-all shadow-md',
                        selectedSize === size
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white border-blue-500 scale-110 shadow-xl'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:scale-105'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ التخصيص */}
            <Card className="mb-8 border-2 border-slate-200 shadow-xl rounded-3xl overflow-hidden">
              <div 
                className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500"
              >
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  خصّص منتجك
                </h3>
              </div>
              
              <CardContent className="p-6">
                {/* الخط */}
                <div className="mb-6">
                  <p className="mb-3 text-base font-black text-slate-700"
                     style={{ fontFamily: 'Cairo, sans-serif' }}>
                    نوع الخط
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => setSelectedFont(font.id)}
                        className={cn(
                          'px-5 py-3 rounded-2xl text-sm font-bold border-2 transition-all shadow-md',
                          selectedFont === font.id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500 scale-105 shadow-lg'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                        )}
                        style={{ fontFamily: font.family }}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* الألوان */}
                <div className="mb-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="mb-3 text-base font-black text-slate-700"
                       style={{ fontFamily: 'Cairo, sans-serif' }}>
                      لون الاسم
                    </p>
                    <label className="relative inline-flex items-center justify-center cursor-pointer">
                      <span
                        className="w-14 h-14 rounded-2xl border-4 border-slate-300 shadow-lg hover:scale-110 transition-transform"
                        style={{ backgroundColor: nameColor }}
                      />
                      <input type="color"
value={nameColor}
onChange={(e) => setNameColor(e.target.value)}
className="absolute inset-0 opacity-0 cursor-pointer"
/>
</label>
</div>   <div>
                <p className="mb-3 text-base font-black text-slate-700"
                   style={{ fontFamily: 'Cairo, sans-serif' }}>
                  لون الرقم
                </p>
                <label className="relative inline-flex items-center justify-center cursor-pointer">
                  <span
                    className="w-14 h-14 rounded-2xl border-4 border-slate-300 shadow-lg hover:scale-110 transition-transform"
                    style={{ backgroundColor: numberColor }}
                  />
                  <input
                    type="color"
                    value={numberColor}
                    onChange={(e) => setNumberColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* الإسم والرقم */}
            <div className="space-y-5">
              <div>
                <Label 
                  htmlFor="name" 
                  className="text-base font-black text-slate-700 mb-2 block"
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  الاسم (حد أقصى 12 حرف)
                </Label>
                <Input
                  id="name"
                  value={customization.name}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    if (value.length <= 12) {
                      setCustomization({
                        ...customization,
                        name: value,
                      });
                    }
                  }}
                  placeholder="أدخل الاسم"
                  className="mt-1 h-14 text-lg font-bold rounded-2xl border-2 border-slate-300 focus:border-blue-500 shadow-md"
                  maxLength={12}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {customization.name.length}/12 حرف
                </p>
              </div>

              <div>
                <Label 
                  htmlFor="number" 
                  className="text-base font-black text-slate-700 mb-2 block"
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  الرقم (حد أقصى رقمين)
                </Label>
                <Input
                  id="number"
                  value={customization.number}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 2 && /^\d*$/.test(value)) {
                      setCustomization({
                        ...customization,
                        number: value,
                      });
                    }
                  }}
                  placeholder="أدخل الرقم"
                  type="text"
                  inputMode="numeric"
                  className="mt-1 h-14 text-lg font-bold rounded-2xl border-2 border-slate-300 focus:border-blue-500 shadow-md"
                  maxLength={2}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {customization.number.length}/2 رقم
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ✅ زر الإضافة */}
        <Button
          onClick={handleAddToCart}
          size="lg"
          className="w-full h-16 rounded-2xl text-xl font-black text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl relative overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            أضف إلى السلة
            <Sparkles className="w-6 h-6" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Button>
      </div>
    </div>
  </main>

  <style>{`
    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-30px) scale(1.1); }
    }

    @keyframes float-delayed {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-40px) scale(1.15); }
    }

    @keyframes float-slow {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-20px) scale(1.05); }
    }

    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .animate-float {
      animation: float 8s ease-in-out infinite;
    }

    .animate-float-delayed {
      animation: float-delayed 10s ease-in-out infinite;
    }

    .animate-float-slow {
      animation: float-slow 12s ease-in-out infinite;
    }

    .animate-bounce-slow {
      animation: bounce-slow 2s ease-in-out infinite;
    }
  `}</style>
</div> );
};
export default Product;