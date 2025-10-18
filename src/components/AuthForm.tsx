'use client'

import { createClient } from '@/lib/supabase/client'
import { AuthFormProps } from '@/lib/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const isRegisterMode = mode === 'register';

  const canSubmit = isRegisterMode ? agreedToTerms && !loading : !loading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (isRegisterMode && password !== confirmPassword) {
      setError('Password tidak cocok.')
      return
    }

    setLoading(true)

    if (isRegisterMode) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        // options: { emailRedirectTo: `${location.origin}/auth/callback` },
      })
      if (error) setError(error.message)
      else {
        // alert('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.')
        router.push('/login')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else {
        router.push('/dashboard')
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl border border-gray-200 shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        {isRegisterMode ? 'Daftar' : 'Masuk'}
      </h1>
      <p className="text-center text-gray-500 text-sm">
        {isRegisterMode ? 'Mulai dengan membuat akun anda' : 'Masuk dengan akun anda'}
      </p>

      {isRegisterMode && (
        <p className="text-xs text-red-500">* wajib diisi.</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="text-sm font-medium text-gray-600">Alamat email {isRegisterMode && '*'}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-gray-600" />
        </div>

        {/* Password Input */}
        <div className="relative">
          <label className="text-sm font-medium text-gray-600">{isRegisterMode ? 'Buat password *' : 'Password'}</label>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-gray-600" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 hover:text-primary">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirm Password Input */}
        {isRegisterMode && (
          <div className="relative">
            <label className="text-sm font-medium text-gray-600">Tulis ulang password *</label>
            <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-gray-600" />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 hover:text-primary">
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        )}

        {/* Terms & Conditions Checkbox */}
        {isRegisterMode && (
          <div className="flex items-center">
            <input id="terms" name="terms" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              Saya setuju dengan <a href="#" className="font-medium text-primary hover:underline">syarat dan ketentuan</a> *
            </label>
          </div>
        )}

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        
        {/* Submit Button */}
        <button type="submit" disabled={!canSubmit} className="w-full px-4 py-3 font-bold text-white bg-primary rounded-lg hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
          {loading ? 'Memproses...' : (isRegisterMode ? 'Daftar' : 'Masuk')}
        </button>
      </form>

      {/* Footer Links */}
      <div className="text-center text-sm">
        {isRegisterMode ? (
          <p className="text-gray-600">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">Masuk</Link>
          </p>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              Belum punya akun?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">Daftar</Link>
            </p>
            <p>
              <Link href="#" className="font-medium text-primary hover:underline">Lupa password?</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}