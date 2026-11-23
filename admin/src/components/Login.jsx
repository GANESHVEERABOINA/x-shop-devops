import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hasCustomVideo, setHasCustomVideo] = useState(false)
  const canvasRef = useRef(null)

  // Live 60fps Encrypted Network & Radar Motion Background (plays until custom admin-bg.mp4 is added)
  useEffect(() => {
    if (hasCustomVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const nodeCount = 68;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      radius: Math.random() * 1.8 + 1,
      accent: Math.random() > 0.72,
    }));

    let scanY = 0;
    let pulseRadius = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.fillRect(0, 0, width, height);

      // Subtle radar pulse ring from center
      pulseRadius = (pulseRadius + 0.9) % Math.max(width, height) * 0.55;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(139, 92, 246, ${Math.max(0, 0.16 - pulseRadius / 3200)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Slow horizontal security scanner beam
      scanY = (scanY + 0.85) % height;
      const beam = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      beam.addColorStop(0, 'rgba(139, 92, 246, 0)');
      beam.addColorStop(0.5, 'rgba(139, 92, 246, 0.08)');
      beam.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = beam;
      ctx.fillRect(0, scanY - 40, width, 80);

      // Move & draw nodes + connecting network edges
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < 0 || a.x > width) a.vx *= -1;
        if (a.y < 0 || a.y > height) a.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 155) {
            const alpha = (1 - dist / 155) * 0.28;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.accent
              ? `rgba(167, 139, 250, ${alpha})`
              : `rgba(99, 102, 241, ${alpha * 0.85})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.fillStyle = a.accent ? 'rgba(196, 181, 253, 0.9)' : 'rgba(129, 140, 248, 0.7)';
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [hasCustomVideo]);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
      if (response.data.success) {
        setToken(response.data.token)
        toast.success("X-Shop Admin Logged In Successfully!")
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <div className='relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden bg-black'>
      {/* 1. Built-in Live Animated Cyber Network Canvas */}
      {!hasCustomVideo && (
        <canvas
          ref={canvasRef}
          className='pointer-events-none absolute inset-0 w-full h-full z-0'
        />
      )}

      {/* 2. Auto-Switch Local Video Slot (Drop your own video at: admin/public/admin-bg.mp4) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setHasCustomVideo(true)}
        onError={() => setHasCustomVideo(false)}
        className={`pointer-events-none absolute inset-0 w-full h-full object-cover z-[1] transition-opacity duration-700 ${
          hasCustomVideo ? 'opacity-50 scale-105' : 'opacity-0'
        }`}
      >
        <source src='/admin-bg.mp4' type='video/mp4' />
      </video>

      {/* Dark Security Grid + Vignette Overlay */}
      <div
        className='pointer-events-none absolute inset-0 z-[2] opacity-25'
        style={{
          backgroundImage:
            'linear-gradient(rgba(139,92,246,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.12) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div
        className='pointer-events-none absolute inset-0 z-[2]'
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(139,92,246,0.14) 0%, rgba(0,0,0,0.62) 55%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Restricted Admin Console Glass Card */}
      <div className='relative z-10 rounded-3xl px-7 py-9 sm:px-9 max-w-[420px] w-full space-y-6 bg-[#07070b]/82 backdrop-blur-2xl border border-violet-400/25 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_45px_-15px_rgba(139,92,246,0.4)]'>
        
        {/* Restricted Badge */}
        <div className='flex justify-center'>
          <span className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-400/30 text-[10px] font-bold tracking-[0.2em] text-violet-300 uppercase'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
            Restricted Admin Console
          </span>
        </div>

        {/* Header */}
        <div className='text-center space-y-2'>
          <div className='w-12 h-12 rounded-2xl btn-violet flex items-center justify-center mx-auto mb-2'>
            <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
            </svg>
          </div>
          <h2 className='text-xl font-bold tracking-tight text-white'>X-Shop Control Center</h2>
          <p className='text-xs text-zinc-400'>Authorized administrators only. All sessions are encrypted.</p>
        </div>

        <form onSubmit={onSubmitHandler} className='space-y-4'>
          <div className='space-y-1.5'>
            <label className='text-[11px] font-semibold tracking-wider text-zinc-400 uppercase block'>
              Admin Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              required
              placeholder="admin@xshop.com"
              className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm placeholder:text-zinc-600'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-[11px] font-semibold tracking-wider text-zinc-400 uppercase block'>
              Access Key / Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              required
              placeholder="••••••••"
              className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm placeholder:text-zinc-600'
            />
          </div>

          <button
            type='submit'
            className='w-full py-3 px-4 rounded-xl btn-primary font-semibold text-sm cursor-pointer mt-2'
          >
            Authenticate & Enter Console
          </button>
        </form>

        <div className='pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-500'>
          <span>X-Shop Cloud Node</span>
          <span className='font-mono text-zinc-400'>TLS 1.3 • JWT</span>
        </div>
      </div>
    </div>
  )
}

export default Login