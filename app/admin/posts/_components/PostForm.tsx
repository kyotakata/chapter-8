"use client";

import { Category } from "@/app/api/admin/posts/[id]/route"

interface Props {
  mode: "new" | "edit"    // 文字列リテラル型のunion型のイメージ
  title: string
  setTitle: (title: string) => void
  titleError: string
  content: string
  setContent: (title: string) => void
  contentError: string
  thumbnailUrl: string
  setThumbnailUrl: (title: string) => void
  categories: Category[]
  setCategories: (categories: Category[]) => void
  selectedCategories: Category[]
  setSelectedCategories: (categories: Category[]) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onDelete?: () => void    // ?で引数指定なしでもよくなる
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  titleError,
  content,
  setContent,
  contentError,
  thumbnailUrl,
  setThumbnailUrl,
  categories,
  setCategories,
  selectedCategories,
  setSelectedCategories,
  onSubmit,
  onDelete,
}) => {

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
          <input name="title" id="title" type="text" className="border border-gray-300 rounded-lg p-4 w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
          {titleError && <p className="text-sm text-red-700">{titleError}</p>}
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <label htmlFor="content" className="text-gray-500">内容</label>
          <textarea name="content" id="content" rows={4} className="border border-gray-300 rounded-lg p-4 w-full" value={content} onChange={(e) => setContent(e.target.value)} />
          {contentError && <p className="text-sm text-red-700">{contentError}</p>}
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <label htmlFor="thumbnail" className="text-gray-500">サムネイルURL</label>
          <input name="thumbnail" id="thumbnail" type="text" className="w-full border border-gray-300 rounded-lg p-4" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
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
        <button type="submit" className="bg-indigo-700 text-white py-2 px-4 rounded-lg mr-4">
          {mode === 'new' ? '作成' : '更新'}
        </button>
        {mode === 'edit' && <button type="button"
          onClick={onDelete}
          className="bg-rose-700 text-white py-2 px-4 rounded-lg">
          削除
        </button>}
      </div>
    </form>
  );
};