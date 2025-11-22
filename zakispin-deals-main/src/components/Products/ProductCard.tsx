import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../UI/card';
import { Button } from '../UI/button';
import { formatPrice } from '../../utils/priceUtils';
import { useOffer } from '../../context/OfferContext';
import { useCart } from '../../context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useTranslation();
  const { getDiscount, hasFreeShipping } = useOffer();
  const { addToCart } = useCart();

  const discount = getDiscount();
  const freeShipping = hasFreeShipping();

  const finalPrice =
    discount > 0 ? product.price * (1 - discount / 100) : product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="card-hover overflow-hidden h-full flex flex-col">
        {/* صورة المنتج + البادجات */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badge التخفيض 30% مثلاً */}
          {discount > 0 && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center rounded-full bg-red-600 text-white text-xs font-extrabold px-3 py-1 shadow-lg">
                -{discount}% {t('cart.discount', '')}
              </span>
            </div>
          )}

          {/* Badge التوصيل المجاني */}
          {freeShipping && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center rounded-full bg-emerald-500 text-white text-[11px] font-semibold px-3 py-1 shadow-md">
                {t('product.freeShipping', 'توصيل مجاني')}
              </span>
            </div>
          )}
        </div>

        {/* معلومات المنتج */}
        <CardContent className="flex-1 p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2">
            {discount > 0 && (
              <span className="text-sm font-semibold text-red-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-xl font-extrabold text-primary">
              {formatPrice(finalPrice)}
            </span>
          </div>
        </CardContent>

        {/* زر السلة السريعة */}
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleQuickAdd}
            className="w-full btn-primary gap-2"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4" />
            {t('product.addToCart')}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
