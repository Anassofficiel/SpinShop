import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';

import Header from '../components/Header/Header';
import { Button } from '../components/UI/button';
import { Input } from '../components/UI/input';
import { Label } from '../components/UI/label';
import { Card, CardContent } from '../components/UI/card';
import { formatPrice } from '../utils/priceUtils';
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
  oldPrice?: number;
  images: ProductImage[];
  inStock: boolean;
  sizes: string[];
}

// ------------------------------------------------------------------
// داتا المنتجات ديال المغرب (يمكنك تغيير الصور/الأثمنة/الوصف بحرّيتك)
// ------------------------------------------------------------------

const MA_PRODUCTS: ProductData[] = [
  {
    id: 'MA-1',
    countryCode: 'MA',
    name: 'Morocco Home Kids Jersey 24/25',
    description:
      'توني الدار للأطفال بألوان المنتخب المغربي، قماش خفيف ومريح للّعب اليومي.',
    price: 299,
    oldPrice: 329,
    images: [
      // صورة ظهر التوني الرئيسية
      'https://i.postimg.cc/s2JsH9Wj/image.png',
      // باقي الصور (يمكن تغيرهم)
      'https://i.postimg.cc/kgKwNVds/Chat-GPT-Image-13-nov-2025-16-21-32.png',
      'https://i.postimg.cc/kgKwNVds/Chat-GPT-Image-13-nov-2025-16-21-32.png',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'MA-2',
    countryCode: 'MA',
    name: 'Morocco Away Kids Jersey 24/25',
    description: 'توني الإياب بتصميم عصري، مناسب للمقابلات والخروج اليومي.',
    price: 239,
    oldPrice: 319,
    images: [
      'https://via.placeholder.com/800x800?text=MA-2+Front',
      'https://via.placeholder.com/800x800?text=MA-2+Back',
      'https://via.placeholder.com/800x800?text=MA-2+Detail',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'MA-3',
    countryCode: 'MA',
    name: 'Morocco Kids Training Top',
    description: 'توب تدريب خفيف، مثالي للجري والتدريب اليومي في الجو المعتدل.',
    price: 199,
    oldPrice: 259,
    images: [
      'https://via.placeholder.com/800x800?text=MA-3+Front',
      'https://via.placeholder.com/800x800?text=MA-3+Back',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'MA-4',
    countryCode: 'MA',
    name: 'Morocco Kids Hoodie',
    description: 'هودي دافئ لأيام الشتاء، بطبعة شعار المغرب في الأمام.',
    price: 279,
    oldPrice: 349,
    images: [
      'https://via.placeholder.com/800x800?text=MA-4+Front',
      'https://via.placeholder.com/800x800?text=MA-4+Back',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'MA-5',
    countryCode: 'MA',
    name: 'Morocco Kids Shorts',
    description: 'شورت رياضي خفيف مع خطوط جانبية بألوان العلم المغربي.',
    price: 129,
    oldPrice: 169,
    images: [
      'https://via.placeholder.com/800x800?text=MA-5+Front',
      'https://via.placeholder.com/800x800?text=MA-5+Back',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'MA-6',
    countryCode: 'MA',
    name: 'Morocco Kids Full Kit',
    description: 'طقم كامل: توني + شورت، مثالي للهدايا أو المباريات.',
    price: 349,
    oldPrice: 429,
    images: [
      'https://via.placeholder.com/800x800?text=MA-6+Front',
      'https://via.placeholder.com/800x800?text=MA-6+Back',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'MA-7',
    countryCode: 'MA',
    name: 'Morocco Goalkeeper Kids Jersey',
    description:
      'توني حارس المرمى للأطفال بتصميم مميّز ولون مختلف عن اللاعبين.',
    price: 259,
    oldPrice: 329,
    images: [
      'https://via.placeholder.com/800x800?text=MA-7+Front',
      'https://via.placeholder.com/800x800?text=MA-7+Back',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'MA-8',
    countryCode: 'MA',
    name: 'Morocco Kids Lifestyle T-shirt',
    description: 'تي شورت كاجوال بالألوان المغربية، مناسب للمدرسة والخروج.',
    price: 149,
    oldPrice: 199,
    images: [
      'https://via.placeholder.com/800x800?text=MA-8+Front',
      'https://via.placeholder.com/800x800?text=MA-8+Back',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'MA-9',
    countryCode: 'MA',
    name: 'Morocco Kids Tracksuit',
    description: 'سيرفيت كامل للأطفال بجودة عالية، مناسب للرياضة والسفر.',
    price: 399,
    oldPrice: 479,
    images: [
      'https://via.placeholder.com/800x800?text=MA-9+Front',
      'https://via.placeholder.com/800x800?text=MA-9+Back',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'MA-10',
    countryCode: 'MA',
    name: 'Morocco Kids Zip Hoodie',
    description: 'هودي بسحاب أمامي، سهل في اللبس والخلع، مثالي للمدرسة.',
    price: 289,
    oldPrice: 359,
    images: [
      'https://via.placeholder.com/800x800?text=MA-10+Front',
      'https://via.placeholder.com/800x800?text=MA-10+Back',
    ],
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
];

const PRODUCTS_BY_COUNTRY: Record<string, ProductData[]> = {
  MA: MA_PRODUCTS,
};

// ------------------------------------------------------------------
// إعدادات الخطوط في الـ preview
// ------------------------------------------------------------------

const FONT_OPTIONS = [
  {
    id: 'poppins',
    label: 'Poppins',
    family: '"Poppins", system-ui, sans-serif',
  },
  { id: 'arial', label: 'Arial', family: 'Arial, system-ui, sans-serif' },
  {
    id: 'georgia',
    label: 'Georgia',
    family: 'Georgia, "Times New Roman", serif',
  },
  {
    id: 'mono',
    label: 'Monospace',
    family: '"Courier New", ui-monospace, monospace',
  },
];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getDiscount } = useOffer();
  const { addToCart } = useCart();
  const discount = getDiscount();

  const [customization, setCustomization] = useState({
    name: '',
    number: '',
  });

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFont, setSelectedFont] = useState<string>(FONT_OPTIONS[0].id);
  const [nameColor, setNameColor] = useState<string>('#ffffff');
  const [numberColor, setNumberColor] = useState<string>('#ffffff');

  // نجيب المنتج حسب الـ id، وإلا نرجع أول منتج من المغرب
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
  }, [id]); // كلما تغيّر المنتج

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const finalPrice =
    discount > 0 ? product.price * (1 - discount / 100) : product.price;

  const mainImage =
    product.images[selectedImageIndex] ??
    'https://via.placeholder.com/800x800?text=Product';

  const currentFont =
    FONT_OPTIONS.find((f) => f.id === selectedFont) ?? FONT_OPTIONS[0];

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('اختر المقاس أولا');
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
    toast.success(t('product.addToCart') + ' ✓');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ----------------------------------------------
              Product Images (main + thumbnails)
          ---------------------------------------------- */}
          <div>
            {/* الصورة الرئيسية مع Overlay الاسم و الرقم فوق التوني فقط */}
            <Card className="relative overflow-hidden mb-4 bg-muted">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />

              {(customization.name || customization.number) && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* NAME */}
                  {customization.name && (
                    <span
                      style={{
                        fontFamily: currentFont.family,
                        color: nameColor,
                      }}
                      className="
                        absolute
                        top-[16%]
                        left-1/2
                        -translate-x-1/2
                        text-4xl
                        font-extrabold
                        tracking-[0.30em]
                        uppercase
                        drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]
                        rotate-[-10deg]
                        origin-center
                      "
                    >
                      {customization.name}
                    </span>
                  )}

                  {/* NUMBER */}
                  {customization.number && (
                    <span
                      style={{
                        fontFamily: currentFont.family,
                        color: numberColor,
                      }}
                      className="
                        absolute
                        top-[44%]
                        left-1/2
                        -translate-x-1/2
                        text-[9rem]
                        leading-none
                        font-black
                        drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]
                      "
                    >
                      {customization.number}
                    </span>
                  )}
                </div>
              )}
            </Card>

            {/* الصور الصغيرة (thumbnails) */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      'border rounded overflow-hidden transition-all',
                      selectedImageIndex === idx
                        ? 'border-primary ring-2 ring-primary/50'
                        : 'border-border hover:border-primary/60'
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

          {/* ----------------------------------------------
              Product Details
          ---------------------------------------------- */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              {product.oldPrice && (
                <span className="text-2xl text-muted-foreground line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              <span className="text-4xl font-bold text-primary">
                {formatPrice(finalPrice)}
              </span>
            </div>

            <p className="text-muted-foreground mb-4">{product.description}</p>

            <div className="flex items-center gap-2 mb-6">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-green-500 font-medium">
                {t('product.inStock')}
              </span>
            </div>

            {/* SIZE selector - دوائر بحال radio */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  {t('product.size') || 'Size'}
                </p>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold border transition-all',
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                          : 'bg-muted text-foreground border-border hover:bg-muted/80'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------------------------------------
                Customization (Name / Number + Font + Colors)
            ---------------------------------------------- */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  {t('product.customize')}
                </h3>

                {/* اختيار نوع الخط */}
                <div className="mb-5">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Font style
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => setSelectedFont(font.id)}
                        className={cn(
                          'px-3 py-1 rounded-full text-xs border transition-all',
                          selectedFont === font.id
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-muted text-foreground border-border hover:bg-muted/80'
                        )}
                        style={{ fontFamily: font.family }}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* اختيار الألوان */}
                <div className="mb-5 flex flex-wrap gap-6">
                  {/* لون الاسم */}
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Name color
                    </p>
                    <label className="relative inline-flex items-center justify-center">
                      <span
                        className="w-7 h-7 rounded-full border shadow-sm"
                        style={{ backgroundColor: nameColor }}
                      />
                      <input
                        type="color"
                        value={nameColor}
                        onChange={(e) => setNameColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* لون الرقم */}
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Number color
                    </p>
                    <label className="relative inline-flex items-center justify-center">
                      <span
                        className="w-7 h-7 rounded-full border shadow-sm"
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

                {/* الفورم ديال الاسم و الرقم */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t('product.name')}</Label>
                    <Input
                      id="name"
                      value={customization.name}
                      onChange={(e) =>
                        setCustomization({
                          ...customization,
                          name: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="Enter name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="number">{t('product.number')}</Label>
                    <Input
                      id="number"
                      value={customization.number}
                      onChange={(e) =>
                        setCustomization({
                          ...customization,
                          number: e.target.value,
                        })
                      }
                      placeholder="Enter number"
                      type="number"
                      className="mt-1"
                    />
                  </div>

                  {/* ماكاين حتى preview إضافي هنا باش ما يتعاودش النص خارج التوني */}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full btn-primary text-xl py-6 gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {t('product.addToCart')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Product;
