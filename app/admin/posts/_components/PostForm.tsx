"use client";

import { Category } from "@/app/api/admin/posts/[id]/route"
import { ChangeEvent, useEffect, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { supabase } from '@/app/_libs/supabase'
import { v4 as uuidv4 } from 'uuid'  // 固有IDを生成するライブラリ
import Image from "next/image"
import { CategoryIndexResponse } from "@/app/api/admin/categories/route"
import { CreateCategoryResponse } from "@/app/api/admin/categories/route";

interface Props {
  mode: "new" | "edit"    // 文字列リテラル型のunion型のイメージ
  title: string
  setTitle: (title: string) => void
  titleError: string
  content: string
  setContent: (title: string) => void
  contentError: string
  thumbnailImageKey: string
  setThumbnailImageKey: (title: string) => void
  categories: Category[]
  setCategories: (categories: Category[]) => void
  selectedCategories: Category[]
  setSelectedCategories: (categories: Category[]) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onDelete?: () => void    // ?で引数指定なしでもよくなる
  disabled: boolean
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  titleError,
  content,
  setContent,
  contentError,
  thumbnailImageKey,
  setThumbnailImageKey,
  categories,
  setCategories,
  selectedCategories,
  setSelectedCategories,
  onSubmit,
  onDelete,
  disabled,
}) => {
  const { token } = useSupabaseSession()
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  )

  useEffect(() => {
    if (!token) return

    const fetchCategories = async () => {
      //カテゴリ一覧取得
      const res = await fetch(`/api/admin/categories`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      const { categories }: { categories: CategoryIndexResponse["categories"] } = await res.json()
      setCategories(categories)
    }

    fetchCategories();
  }, [token])


  useEffect(() => {
    if (!thumbnailImageKey) return

    const { data } = supabase.storage
      .from('post_thumbnail')
      .getPublicUrl(thumbnailImageKey)

    setThumbnailImageUrl(data.publicUrl)
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
    setThumbnailImageKey(data.path)
  }

  const toggleCategory = (id: number) => {
    const exists = selectedCategories.some((category) => category.id === id)
    // console.log(exists)

    if (exists) {// 選択カテゴリに同じカテゴリIDがある場合
      setSelectedCategories(
        selectedCategories.filter((category) => category.id !== id)
      )
      return
    }

    // 選択カテゴリに同じカテゴリIDがない場合
    const category = categories.find((c) => c.id === id)
    if (!category) return
    setSelectedCategories([...selectedCategories, category])
  }


  return (
    <form onSubmit={onSubmit}>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <label htmlFor="title" className="text-gray-500">タイトル</label>
          <input name="title" id="title" type="text" className="border border-gray-300 rounded-lg p-4 w-full" value={title} onChange={(e) => setTitle(e.target.value)} disabled={disabled} />
          {titleError && <p className="text-sm text-red-700">{titleError}</p>}
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <label htmlFor="content" className="text-gray-500">内容</label>
          <textarea name="content" id="content" rows={4} className="border border-gray-300 rounded-lg p-4 w-full" value={content} onChange={(e) => setContent(e.target.value)} disabled={disabled} />
          {contentError && <p className="text-sm text-red-700">{contentError}</p>}
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
            disabled={disabled} />
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <label htmlFor="thumbnail" className="text-gray-500 flex">カテゴリー</label>
          {categories?.map((category) => {
            const isSelected = selectedCategories.some((selected) => selected.id === category.id)
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                disabled={disabled}
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
        <button type="submit" className="bg-indigo-700 text-white py-2 px-4 rounded-lg mr-4" disabled={disabled}>
          {mode === 'new' ? '作成' : '更新'}
        </button>
        {mode === 'edit' && <button type="button"
          onClick={onDelete}
          className="bg-rose-700 text-white py-2 px-4 rounded-lg" disabled={disabled}>
          削除
        </button>}
      </div>
    </form>
  );
};