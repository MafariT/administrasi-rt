'use client'

import { useState } from 'react'
import { login, signup } from '@/app/(auth)/login/action'

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setMessage(null)
    const action = isSignUp ? signup : login
    const result = await action(formData)

    if (result?.error) {
      setMessage({ type: 'error', content: result.error })
    }
    if (result?.success) {
      setMessage({ type: 'success', content: result.success })
      setIsSignUp(false);
    }
  }

  return (
    <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        {isSignUp ? 'Daftar Akun Baru' : 'Masuk ke Akun Anda'}
      </h1>

      {/* The form action now calls our server action handler */}
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input id="email" name="email" type="email" required className="w-full px-4 py-2 mt-1 border rounded-md text-gray-700" />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <input id="password" name="password" type="password" required className="w-full px-4 py-2 mt-1 border rounded-md text-gray-700" />
        </div>
        {isSignUp && (
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required className="w-full px-4 py-2 mt-1 border rounded-md text-gray-700" />
          </div>
        )}

        {message && (
          <p className={`text-sm text-center ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
            {message.content}
          </p>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
        >
          {isSignUp ? 'Daftar' : 'Masuk'}
        </button>
      </form>

      <div className="text-center">
        <button onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }} className="text-sm text-blue-600 hover:underline">
          {isSignUp ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
        </button>
      </div>
    </div>
  )
}