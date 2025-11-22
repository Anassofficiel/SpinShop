import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Home, Store, HelpCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '../UI/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../UI/dropdown-menu';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/home', icon: Home, label: t('nav.home') },
    { path: '/store', icon: Store, label: t('nav.store') },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during supabase signOut', error);
    } finally {
      logout();
      navigate('/login', { replace: true });
    }
  };

  const userInitial =
    user?.email && user.email.length > 0
      ? user.email.charAt(0).toUpperCase()
      : null;

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-xl border-b shadow-lg
    ${
      location.pathname === '/store'
        ? 'bg-black/80 border-white/10'
        : 'bg-white/80 border-gray-200'
    }
  `}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span className="text-xl font-bold text-gradient hidden sm:block">
            SpinShop
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}

          {/* Cart */}
          <Link to="/cart" className="relative">
            <Button
              variant={isActivePath('/cart') ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.cart')}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Support */}
          <Link to="/support">
            <Button
              variant={isActivePath('/support') ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.support')}</span>
            </Button>
          </Link>

          <LanguageSwitcher />

          {/* Avatar بحرف الإيميل + منيو */}
          {userInitial && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="ml-1 sm:ml-2 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-slate-900 bg-gradient-to-br from-yellow-400 to-amber-500 shadow-md border border-amber-200"
                >
                  {userInitial}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 space-y-1">
                {/* الإيميل */}
                <DropdownMenuItem
                  disabled
                  className="p-0 focus:bg-transparent cursor-default"
                >
                  <div className="w-full px-3 py-2 rounded-md bg-emerald-300 text-black font-extrabold text-sm break-all text-center tracking-wide transition-transform duration-150 hover:scale-105">
                    {user?.email}
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* تسجيل الخروج */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="p-0 focus:bg-transparent cursor-pointer"
                >
                  <button
                    type="button"
                    className="w-full px-3 py-2 rounded-md bg-red-500 text-white text-xs font-semibold text-center transition-transform duration-150 hover:scale-105"
                  >
                    {t('auth.logout')}
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
