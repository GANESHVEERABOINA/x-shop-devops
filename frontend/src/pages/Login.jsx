import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

if (typeof document !== 'undefined' && !document.getElementById('xshop-login-motion')) {
  const style = document.createElement('style');
  style.id = 'xshop-login-motion';
  style.innerHTML = `
    @keyframes xshopReelUp {
      0% { transform: translateY(0%); }
      100% { transform: translateY(-50%); }
    }
    @keyframes xshopReelDown {
      0% { transform: translateY(-50%); }
      100% { transform: translateY(0%); }
    }
    .xshop-reel-up { animation: xshopReelUp 34s linear infinite; }
    .xshop-reel-down { animation: xshopReelDown 40s linear infinite; }
    .xshop-reel-up-slow { animation: xshopReelUp 46s linear infinite; }
  `;
  document.head.appendChild(style);
}

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);
  const location = useLocation();
  const redirectPath = location.state?.from || '/';

  const { token, setToken, navigate, backendUrl, products } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const handlePlayable = () => {
      setVideoReady(true);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    };

    const handleError = () => {
      setVideoReady(false);
    };

    if (video.readyState >= 2) {
      handlePlayable();
    }

    video.addEventListener('loadeddata', handlePlayable);
    video.addEventListener('canplay', handlePlayable);
    video.addEventListener('playing', handlePlayable);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handlePlayable);
      video.removeEventListener('canplay', handlePlayable);
      video.removeEventListener('playing', handlePlayable);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Account created successfully!');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Welcome back!');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate(redirectPath, { replace: true });
    }
  }, [token, navigate, redirectPath]);

  const productImages = (products || [])
    .map((p) => (Array.isArray(p.image) ? p.image[0] : p.image))
    .filter(Boolean);

  const buildColumn = (offset) => {
    if (productImages.length === 0) return [];
    const base = [];
    for (let i = 0; i < 6; i++) {
      base.push(productImages[(i + offset) % productImages.length]);
    }
    return [...base, ...base];
  };

  const columns = [
    { items: buildColumn(0), anim: 'xshop-reel-up' },
    { items: buildColumn(2), anim: 'xshop-reel-down' },
    { items: buildColumn(4), anim: 'xshop-reel-up-slow' },
    { items: buildColumn(6), anim: 'xshop-reel-down' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center px-4 py-12 overflow-hidden bg-black">
      {/* 1. Primary Fashion Video Background (frontend/public/fashion-bg.mp4) */}
      <video
        ref={videoRef}
        src="/fashion-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`pointer-events-none absolute inset-0 w-full h-full object-cover z-[1] transition-opacity duration-700 ${
          videoReady ? 'opacity-65 scale-[1.02]' : 'opacity-0'
        }`}
      />

      {/* 2. Fallback Runway Reel */}
      {!videoReady && productImages.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 h-[120%] -mt-8 px-3 opacity-45 scale-105 -rotate-3">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className={`flex flex-col gap-3 sm:gap-4 ${col.anim}`}>
                {col.items.map((src, idx) => (
                  <div
                    key={idx}
                    className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shrink-0"
                  >
                    <img src={src} alt="" className="w-full h-full object-cover object-top" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.62) 55%, rgba(0,0,0,0.88) 100%)',
        }}
      />

      {/* Frosted Glass Login Card */}
      <div className="relative z-10 rounded-3xl px-7 py-9 sm:px-9 max-w-[410px] w-full space-y-6 bg-[#07070b]/70 backdrop-blur-2xl border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-2xl btn-violet flex items-center justify-center font-extrabold text-lg mx-auto mb-3">
            X
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {currentState === 'Login' ? 'Sign in to X-Shop' : 'Create your account'}
          </h1>
          <p className="text-xs text-zinc-300/80">
            {redirectPath === '/place-order'
              ? 'Sign in to continue with your checkout'
              : currentState === 'Login'
              ? 'Step into the new season collection'
              : 'Join X-Shop to track orders and save favourites'}
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          {currentState === 'Sign Up' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-200 block">Full Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="John Doe"
                required
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm placeholder:text-zinc-500"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-200 block">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="name@example.com"
              required
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-200 block">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="••••••••"
              required
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm placeholder:text-zinc-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-zinc-300/80">
              {currentState === 'Login' ? 'New to X-Shop?' : 'Already have an account?'}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')
              }
              className="text-violet-400 hover:text-violet-300 font-semibold cursor-pointer transition"
            >
              {currentState === 'Login' ? 'Create account' : 'Sign in'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl btn-primary font-semibold text-sm cursor-pointer mt-2"
          >
            {currentState === 'Login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;