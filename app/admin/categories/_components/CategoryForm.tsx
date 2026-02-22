"use client";
import { UseFormReturn } from "react-hook-form"

export type FormValues = {
  name: string
}

interface Props {
  mode: "new" | "edit"    // 文字列リテラル型のunion型のイメージ
  form: UseFormReturn<FormValues>
  onSubmit: (values: FormValues) => void
  onDelete?: () => void    // ?で引数指定なしでもよくなる
}

export const CategoryForm: React.FC<Props> = ({
  mode,
  onSubmit,
  onDelete,
  form,
}) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-6">
          <div className="w-full">
            <label htmlFor="category" className="text-gray-500">カテゴリー名</label>
            <input id="category" type="text" className="border border-gray-300 rounded-lg p-4 w-full" {...register("name")} disabled={isSubmitting} />
            {errors.name && <p className="text-sm text-red-700">{errors.name.message}</p>}
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
    </div>
  )
}
