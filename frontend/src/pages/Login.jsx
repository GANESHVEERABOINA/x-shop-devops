import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Account created successfully!');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Logged in successfully!');
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
      navigate('/');
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-95 sm:max-w-md m-auto mt-12 sm:mt-16 gap-4 text-white pb-20 px-4"
    >
      {/* Header Title */}
      <div className="inline-flex items-center gap-2 mb-2 mt-2">
        <p className="prata-regular text-3xl sm:text-4xl font-extrabold tracking-wide uppercase text-white">
          {currentState}
        </p>
        <hr className="border-none h-[3px] w-10 bg-[#ffc200] rounded-full" />
      </div>

      {/* Modern Card Container */}
      <div className="w-full bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
        {currentState === 'Sign Up' && (
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Full Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="w-full bg-black border border-neutral-700 rounded-2xl px-4 py-3 text-sm text-white focus:border-[#ffc200] outline-none transition"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Email Address</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="w-full bg-black border border-neutral-700 rounded-2xl px-4 py-3 text-sm text-white focus:border-[#ffc200] outline-none transition"
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="w-full bg-black border border-neutral-700 rounded-2xl px-4 py-3 text-sm text-white focus:border-[#ffc200] outline-none transition"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex justify-between text-xs text-gray-400 pt-1">
          <p className="cursor-pointer hover:text-[#ffc200] transition">Forgot your password?</p>
          {currentState === 'Login' ? (
            <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer text-[#ffc200] font-bold hover:underline">
              Create account
            </p>
          ) : (
            <p onClick={() => setCurrentState('Login')} className="cursor-pointer text-[#ffc200] font-bold hover:underline">
              Login here
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-3.5 rounded-2xl bg-[#ffc200] hover:bg-[#ffcf33] text-black font-extrabold text-sm uppercase tracking-wider transition cursor-pointer shadow-[0_4px_20px_rgba(255,194,0,0.3)]"
        >
          {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
};

export default Login;