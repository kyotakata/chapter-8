"use client";

interface Props {
  mode: "new" | "edit"    // 文字列リテラル型のunion型のイメージ
  categoryName: string
  setCategoryName: (categoryName: string) => void
  categoryNameError: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onDelete?: () => void    // ?で引数指定なしでもよくなる
  disabled: boolean
}

export const CategoryForm: React.FC<Props> = ({
  mode,
  categoryName,
  setCategoryName,
  categoryNameError,
  onSubmit,
  onDelete,
  disabled,
}) => {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="flex justify-between items-center mb-6">
          <div className="w-full">
            <label htmlFor="category" className="text-gray-500">カテゴリー名</label>
            <input name="category" id="category" type="text" className="border border-gray-300 rounded-lg p-4 w-full" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} disabled={disabled} />
            {categoryNameError && <p className="text-sm text-red-700">{categoryNameError}</p>}
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
    </div>
  )
}
