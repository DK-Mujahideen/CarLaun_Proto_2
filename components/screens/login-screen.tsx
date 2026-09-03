'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, User, ArrowRight, Loader2, Lock, Eye, EyeOff } from 'lucide-react'
import { Logo } from '@/components/logo'
import { useStore } from '@/lib/store'

export function LoginScreen() {
  const { login, signup, socialLogin, toast } = useStore()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!email) {
      toast('Please enter your email', 'error')
      return
    }
    if (mode === 'signup' && !name) {
      toast('Please enter your name', 'error')
      return
    }
    if (!password) {
      toast('Please enter your password', 'error')
      return
    }
    if (mode === 'signup' && password !== confirmPassword) {
      toast('Passwords do not match', 'error')
      return
    }

    setLoading(true)
    // Simulate network delay
    setTimeout(() => {
      if (mode === 'login') {
        const success = login(email, password)
        if (!success) {
          toast('Invalid credentials', 'error')
        } else {
          toast('Welcome back!', 'success')
        }
      } else {
        signup(email, name, password)
        toast('Account created successfully', 'success')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="flex min-h-[90dvh] flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="flex flex-col items-center text-center">
          <Logo className="h-16 w-16 text-primary" />
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground text-pretty">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            {mode === 'login'
              ? 'Enter your details to access your account'
              : 'Join CARLAUN for premium garment care'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-2xl bg-muted p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
              mode === 'login' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
              mode === 'signup' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative overflow-hidden"
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-2xl border-0 bg-card py-4 pl-12 pr-4 text-foreground ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="email"
                className="block w-full rounded-2xl border-0 bg-card py-4 pl-12 pr-4 text-foreground ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="block w-full rounded-2xl border-0 bg-card py-4 pl-12 pr-12 text-foreground ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="relative"
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full rounded-2xl border-0 bg-card py-4 pl-12 pr-4 text-foreground ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
              <label htmlFor="remember" className="text-xs text-muted-foreground">Remember me</label>
            </div>
            {mode === 'login' && (
              <button type="button" className="text-xs font-semibold text-primary hover:underline">
                Forgot password?
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-2xl bg-primary px-3 py-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs font-medium uppercase">
            <span className="bg-background px-4 text-muted-foreground tracking-widest text-pretty">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => socialLogin('google')}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-bold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
          >
            <img src="https://www.google.com/favicon.ico" className="h-4 w-4" alt="" />
            Google
          </button>
          <button
            onClick={() => socialLogin('apple')}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-bold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
          >
            <AppleIcon className="h-4 w-4 fill-current" />
            Apple
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            By continuing, you agree to our <br />
            <button className="font-semibold text-foreground underline">Terms of Service</button> and <button className="font-semibold text-foreground underline">Privacy Policy</button>.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function AppleIcon(props: any) {
  return (
    <svg viewBox="0 0 384 512" {...props}>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-82.3-20.2-41.2.6-78.9 23.9-100.1 63.8-43.2 79-11.1 196.5 30.9 261.3 20.6 31.4 44.1 65.5 76.5 64.9 31.1-.6 44.4-20.2 81.6-20.2 37.1 0 50.7 20.2 82.3 19.6 32.2-.6 54.1-30.8 74.4-60.4 23.4-34.1 32.9-67.1 33.1-68.8-.7-.4-63.7-24.5-64-97.4zM249.1 82c15.4-18.6 25.5-44.4 22.7-70.1-23.1 1-50.7 15.4-67.3 34.7-14.9 17.1-27.9 43.7-25.1 68.7 25.6 1.9 51.6-13.6 69.7-33.3z" />
    </svg>
  )
}
