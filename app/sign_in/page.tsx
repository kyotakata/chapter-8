'use client'

import { supabase } from '@/app/_libs/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from "react-hook-form"

export default function Page() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (values: any) => {
    setIsLoading(true)
    const { email, password } = values;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('ログインに失敗しました')
    } else {
      router.replace('/admin/posts')
    }
    setIsLoading(false)
  }

  return (
    <div className="flex justify-center pt-60">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-100" autoComplete="off">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            required
            autoComplete="off"
            disabled={isLoading}
            {...form.register("email")}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            autoComplete="new-password"
            disabled={isLoading}
            {...form.register("password")}
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isLoading}
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  )
}