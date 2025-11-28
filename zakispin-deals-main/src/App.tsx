import { useState, useEffect, type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import { Toaster } from '@/components/UI/toaster';
import { Toaster as Sonner } from '@/components/UI/sonner';
import { TooltipProvider } from '@/components/UI/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { OfferProvider } from './context/OfferContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Store from './pages/Store';
import Country from './pages/Country';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirm from './pages/OrderConfirm';
import Support from './pages/Support';
import NotFound from './pages/NotFound';

import Login from './pages/Login';
import Register from './pages/Register';
import Collection from './pages/Collection'; // 🔥 صفحة المجموعات الجديدة

import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

import './i18n/init';

const queryClient = new QueryClient();

/** حماية الصفحات: ما يدخلوش إلا اللي عندهم session */
const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { login } = useAuth();

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;

      const currentSession = data.session ?? null;
      setSession(currentSession);

      if (currentSession?.user?.email) {
        // نحدّث AuthContext بالإيميل ديال المستخدم
        login({ email: currentSession.user.email });
      } else {
        navigate('/login', { replace: true });
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [navigate, login]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-lg">جارِ التحميل...</p>
      </div>
    );
  }

  return session ? children : null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <OfferProvider>
        <CartProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* صفحة الهبوط الأولى */}
                <Route path="/" element={<Landing />} />

                {/* Splash */}
                <Route path="/splash" element={<Splash />} />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* الصفحات المحمية */}
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/store"
                  element={
                    <ProtectedRoute>
                      <Store />
                    </ProtectedRoute>
                  }
                />

                {/* ✅ صفحة المجموعات (T-Shirts / Caps / Accessories) */}
                <Route
                  path="/collection/:slug"
                  element={
                    <ProtectedRoute>
                      <Collection />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/country/:code"
                  element={
                    <ProtectedRoute>
                      <Country />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/product/:id"
                  element={
                    <ProtectedRoute>
                      <Product />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-confirm"
                  element={
                    <ProtectedRoute>
                      <OrderConfirm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/support"
                  element={
                    <ProtectedRoute>
                      <Support />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </CartProvider>
      </OfferProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
