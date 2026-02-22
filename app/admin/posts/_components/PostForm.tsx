"use client";

import { ChangeEvent, useMemo } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { supabase } from '@/app/_libs/supabase'
import { v4 as uuidv4 } from 'uuid'  // 固有IDを生成するライブラリ
import Image from "next/image"
import { CategoryIndexResponse } from "@/app/api/admin/categories/route"
import { UseFormReturn } from "react-hook-form";
import useSWR from "swr";

export type FormValues = {
  title: string,
  content: string,
  postCategories: { id: number }[],
  thumbnailImageKey: string,
}

interface Props {
  mode: "new" | "edit"    // 文字列リテラル型のunion型のイメージ
  form: UseFormReturn<FormValues>
  onSubmit: (values: FormValues) => void
  onDelete?: () => void    // ?で引数指定なしでもよくなる
}

const fetcher = async ([url, token]: [string, string]) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  })

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const PostForm: React.FC<Props> = ({
  mode,
  form,
  onSubmit,
  onDelete,
}) => {
  const { token } = useSupabaseSession()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, watch, setValue } = form
  const thumbnailImageKey = watch("thumbnailImageKey")
  const postCategories = watch("postCategories") || []

  // SWRでカテゴリー一覧を取得
  const { data, isLoading, error, mutate } = useSWR<{ categories: CategoryIndexResponse["categories"] }>(
    token ? ['/api/admin/categories', token] : null,
    fetcher
  )


  // thumbnailImageKeyからSupabaseの画像URLを導出
  const thumbnailImageUrl = useMemo(() => {
    if (!thumbnailImageKey) return null
    const { data } = supabase.storage
      .from('post_thumbnail')
      .getPublicUrl(thumbnailImageKey)
    return data.publicUrl
  }, [thumbnailImageKey])



  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return
    }

    const file = event.target.files[0] // 選択された画像を取得
    const filePath = `private/${uuidv4()}` // ファイルパスを指定

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_thumbnail') // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message)
      return
    }

    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setValue("thumbnailImageKey", data.path)
  }

  const toggleCategory = (id: number) => {
    const exists = postCategories.some((category) => category.id === id)

    if (exists) {// 選択カテゴリに同じカテゴリIDがある場合
      setValue("postCategories", postCategories.filter((category) => category.id !== id))
      return
    }
    // 選択カテゴリに同じカテゴリIDがない場合
    const category = categories?.find((c) => c.id === id)
    if (!category) return
    setValue("postCategories", [...postCategories, { id: category.id }])
  }

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>読み込めませんでした</div>;
  const categories = data?.categories

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <label htmlFor="title" className="text-gray-500">タイトル</label>
          <input {...register("title")} id="title" type="text" className="border border-gray-300 rounded-lg p-4 w-full" disabled={isSubmitting} />
          {errors.title && <p className="text-sm text-red-700">{errors.title.message}</p>}
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <label htmlFor="content" className="text-gray-500">内容</label>
          <textarea {...register("content")} id="content" rows={4} className="border border-gray-300 rounded-lg p-4 w-full" disabled={isSubmitting} />
          {errors.content && <p className="text-sm text-red-700">{errors.content.message}</p>}
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <label htmlFor="thumbnail" className="text-gray-500">サムネイル画像</label>
          {thumbnailImageUrl && (
            <div className="mt-2">
              <Image
                src={thumbnailImageUrl}
                alt="thumbnail"
                width={400}
                height={400}
              />
            </div>
          )}
          <input name="thumbnail"
            id="thumbnailImageKey"
            type="file"
            className="w-full border border-gray-300 rounded-lg p-4"
            onChange={handleImageChange}
            accept="image/*"
            disabled={isSubmitting} />
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <label htmlFor="thumbnail" className="text-gray-500 flex">カテゴリー</label>
          {categories?.map((category) => {
            const isSelected = postCategories.some((selected) => selected.id === category.id)
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                disabled={isSubmitting}
                className={isSelected
                  ? 'rounded-full border px-3 py-1 text-sm border-blue-600 bg-blue-600 text-white'
                  : ' rounded-full border px-3 py-1 text-sm border-gray-300 bg-white text-gray-800'
                }>
                {category.name}
              </button>)
          })}
        </div>
      </div>
      <div className="flex mt-5">
        <button type="submit" className="bg-indigo-700 text-white py-2 px-4 rounded-lg mr-4" disabled={isSubmitting}>
          {mode === 'new' ? '作成' : '更新'}
        </button>
        {mode === 'edit' && <button type="button"
          onClick={onDelete}
          className="bg-rose-700 text-white py-2 px-4 rounded-lg" disabled={isSubmitting}>
          削除
        </button>}
      </div>
    </form>
  );
};