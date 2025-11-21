'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth';
import { createClient } from '@/lib/supabase';
import { Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  useEffect(() => {
    setMounted(true);
    
    // Check if user is already logged in
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      }
    };
    
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await signIn(formData.email, formData.password);
        
        if (error) {
          // Mensagens de erro mais amigáveis
          if (error.includes('Invalid login credentials')) {
            setError('Email ou senha incorretos. Verifique suas credenciais.');
          } else if (error.includes('Email not confirmed')) {
            setError('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.');
          } else if (error.includes('Sessão não foi criada')) {
            setError('Verifique se você confirmou seu email. Caso não tenha recebido, solicite um novo email de confirmação.');
          } else {
            setError(error);
          }
        } else if (data?.session) {
          setSuccess('Login realizado com sucesso! Redirecionando...');
          
          // Aguardar um pouco para garantir que a sessão foi salva
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Forçar refresh da página para atualizar o estado de autenticação
          window.location.href = '/';
        } else {
          setError('Não foi possível fazer login. Verifique se você confirmou seu email.');
        }
      } else {
        if (!formData.name) {
          setError('Por favor, insira seu nome');
          setLoading(false);
          return;
        }
        
        const { data, error } = await signUp(formData.email, formData.password, formData.name);
        
        if (error) {
          if (error.includes('already registered')) {
            setError('Este email já está cadastrado. Faça login ou use outro email.');
          } else {
            setError(error);
          }
        } else if (data?.user) {
          // Check if email confirmation is required
          if (data.session) {
            setSuccess('Conta criada com sucesso! Redirecionando...');
            await new Promise(resolve => setTimeout(resolve, 500));
            window.location.href = '/';
          } else {
            setSuccess('Conta criada! Verifique seu email para confirmar o cadastro antes de fazer login.');
            // Limpar formulário
            setFormData({ email: '', password: '', name: '' });
            // Mudar para tela de login após 3 segundos
            setTimeout(() => {
              setIsLogin(true);
              setSuccess('');
            }, 3000);
          }
        }
      }
    } catch (err: any) {
      console.error('Erro no handleSubmit:', err);
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00E5C9] to-[#00B8A3] bg-clip-text text-transparent mb-2">
            TotalMe
          </h1>
          <p className="text-gray-400">Seu app completo de saúde e bem-estar</p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          {/* Toggle Login/Signup */}
          <div className="flex gap-2 mb-6 bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                isLogin
                  ? 'bg-[#00E5C9] text-black'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                !isLogin
                  ? 'bg-[#00E5C9] text-black'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (only for signup) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome completo"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00E5C9] focus:ring-2 focus:ring-[#00E5C9]/20 transition-all"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00E5C9] focus:ring-2 focus:ring-[#00E5C9]/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-11 pr-12 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00E5C9] focus:ring-2 focus:ring-[#00E5C9]/20 transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-400">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00E5C9] to-[#00B8A3] text-black font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-[#00E5C9]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? 'Entrando...' : 'Criando conta...'}
                </>
              ) : (
                <>{isLogin ? 'Entrar' : 'Criar Conta'}</>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className="text-[#00E5C9] hover:underline font-medium"
              >
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Ao continuar, você concorda com nossos Termos e Política de Privacidade
        </p>
      </div>
    </div>
  );
}
