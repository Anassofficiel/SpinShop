import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Home, Store, HelpCircle, Globe } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b shadow-lg bg-white/95 border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* ✅ Logo - محدّث */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="https://i.postimg.cc/2yHZyfNf/image.png" 
            alt="Morocco Market Logo" 
            className="w-12 h-12 object-contain"
          />
          <span 
            className="text-xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent hidden sm:block"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            MOROCCO MARKET
          </span>
        </Link>

        {/* ✅ Navigation */}
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

          {/* ✅ Cart */}
          <Link to="/cart" className="relative">
            <Button
              variant={isActivePath('/cart') ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.cart')}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* ✅ Support */}
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

          

   {/* ✅ Language Switcher - أيقونة احترافية */}
   <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-slate-100"
              >
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline text-slate-700 font-semibold">
                  اللغة
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent  align="end" className="w-40">
              <LanguageSwitcher />
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ✅ Avatar - بريد إلكتروني أكبر */}
          {userInitial && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="ml-1 sm:ml-2 w-10 h-10 rounded-full flex items-center justify-center text-base font-black text-white bg-gradient-to-br from-amber-500 to-red-600 shadow-lg border-2 border-white hover:scale-105 transition-transform"
                >
                  {userInitial}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-2 space-y-2">
                {/* ✅ البريد الإلكتروني - خانة أكبر */}
                <DropdownMenuItem
                  disabled
                  className="p-0 focus:bg-transparent cursor-default"
                >
                  <div 
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold text-sm break-words text-center shadow-lg border-2 border-white"
                    style={{ 
                      fontFamily: 'Cairo, sans-serif',
                      wordBreak: 'break-all',
                      lineHeight: '1.4'
                    }}
                  >     
                         {user?.email}
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* ✅ تسجيل الخروج */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="p-0 focus:bg-transparent cursor-pointer"
                >
                  <button
                    type="button"
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-black text-center shadow-lg hover:scale-105 transition-transform border-2 border-white"
                    style={{ fontFamily: 'Cairo, sans-serif' }}
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