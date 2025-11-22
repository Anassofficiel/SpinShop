import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../components/UI/button';
import { Input } from '../components/UI/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/UI/card';

import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (form.password !== form.confirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage('حدث خطأ: ' + error.message);
      return;
    }

    const newUserEmail =
      data.user?.email && data.user.email.length > 0
        ? data.user.email
        : form.email;

    // إن كان التفعيل غير مطلوب → ندير login
    if (!data.session) {
      setSuccessMessage(
        'تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب.'
      );
      return;
    }

    // تسجيل دخول تلقائي
    login({ email: newUserEmail });

    navigate('/home', { replace: true });
  };

  const handleGoogleSignup = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });

    if (error) {
      setErrorMessage('حدث خطأ أثناء إنشاء الحساب باستخدام Google.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 via-sky-400 to-teal-400 px-4 py-10">
      <div className="relative w-full max-w-md">
        {/* زخارف خلفية */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-cyan-300/35 blur-3xl" />

        <Card className="relative bg-white/95 backdrop-blur-xl shadow-[0_18px_70px_rgba(15,23,42,0.35)] border border-white/70 rounded-[32px] overflow-hidden">
          {/* شريط علوي ديكور */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-sky-500 to-teal-400" />

          <CardHeader className="text-center space-y-3 pt-6 pb-3">
            {/* نفس شعار Spin S للتناسق */}
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg border border-white/70">
              <span className="text-4xl font-extrabold text-white drop-shadow-md">
                S
              </span>
            </div>

            <CardTitle className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              إنشاء حساب / Créer un compte
            </CardTitle>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              سجّل حسابك وابدأ التسوق في{' '}
              <span className="font-semibold text-sky-600">SpinShop</span>
              <span className="block text-xs md:text-sm text-slate-500">
                Créez votre compte et commencez à faire vos achats.
              </span>
            </p>
          </CardHeader>

          <CardContent className="pb-7 pt-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* الاسم الكامل */}
              <div className="space-y-2">
                <label className="block text-base font-semibold text-slate-800 text-right">
                  الاسم الكامل / Nom complet
                </label>
                <div className="relative">
                  <Input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="h-14 pr-4 bg-slate-50/80 border-slate-200 rounded-3xl text-lg text-right placeholder:text-slate-400 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition-all"
                    placeholder="الاسم الكامل / Nom complet"
                  />
                  <span className="absolute inset-y-0 left-4 flex items-center text-2xl"></span>
                </div>
              </div>

              {/* البريد الإلكتروني */}
              <div className="space-y-2">
                <label className="block text-base font-semibold text-slate-800 text-right">
                  البريد الإلكتروني / Email
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="h-14 pr-4 bg-slate-50/80 border-slate-200 rounded-3xl text-lg text-right placeholder:text-slate-400 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition-all"
                    placeholder="example@email.com"
                  />
                  <span className="absolute inset-y-0 left-4 flex items-center text-2xl">
                    📧
                  </span>
                </div>
              </div>

              {/* كلمة المرور */}
              <div className="space-y-2">
                <label className="block text-base font-semibold text-slate-800 text-right">
                  كلمة المرور / Mot de passe
                </label>
                <div className="relative">
                  <Input
                    type={showPw1 ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="h-14 pr-4 bg-slate-50/80 border-slate-200 rounded-3xl text-lg text-right placeholder:text-slate-400 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition-all"
                    placeholder="••••••••"
                  />
                  <span
                    className="absolute left-4 inset-y-0 flex items-center text-2xl cursor-pointer select-none"
                    onClick={() => setShowPw1(!showPw1)}
                  >
                    {showPw1 ? '✅' : '🔒'}
                  </span>
                </div>
              </div>

              {/* تأكيد كلمة المرور */}
              <div className="space-y-2">
                <label className="block text-base font-semibold text-slate-800 text-right">
                  تأكيد كلمة المرور / Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Input
                    type={showPw2 ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="h-14 pr-4 bg-slate-50/80 border-slate-200 rounded-3xl text-lg text-right placeholder:text-slate-400 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition-all"
                    placeholder="••••••••"
                  />
                  <span
                    className="absolute left-4 inset-y-0 flex items-center text-2xl cursor-pointer select-none"
                    onClick={() => setShowPw2(!showPw2)}
                  >
                    {showPw2 ? '✅' : '🔐'}
                  </span>
                </div>
              </div>

              {/* رسائل الخطأ / النجاح */}
              {errorMessage && (
                <p className="text-red-600 text-center text-sm md:text-base -mt-1 bg-red-50 border border-red-100 px-3 py-2 rounded-2xl">
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p className="text-green-600 text-center text-sm md:text-base -mt-1 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-2xl">
                  {successMessage}
                </p>
              )}

              {/* الشروط (اختياري) */}
              <p className="text-[11px] md:text-xs text-slate-500 text-right leading-relaxed">
                بإنشائك حساباً، فأنت توافق على{' '}
                <span className="text-sky-700 font-semibold cursor-pointer">
                  الشروط والأحكام
                </span>
                .
                <span className="block text-[10px] md:text-[11px] text-slate-400">
                  En créant un compte, vous acceptez nos conditions générales.
                </span>
              </p>

              {/* زر إنشاء حساب */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-1 h-12 rounded-3xl text-lg font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading
                  ? 'جارِ إنشاء الحساب...'
                  : 'إنشاء حساب / Créer un compte'}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm md:text-base text-slate-600">
              لديك حساب؟{' '}
              <Link
                to="/login"
                className="text-sky-700 font-semibold hover:underline"
              >
                تسجيل الدخول / Connexion
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
