"use client";

import { useEffect } from "react";
import { useParams } from 'next/navigation'
import { CategoryForm } from "../_components/CategoryForm";
import { useRouter } from 'next/navigation'
import { UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import { CategoryShowResponse } from "@/app/api/admin/categories/[id]/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useForm } from "react-hook-form"
import { categorySchema } from "../_libs/categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues } from "../_components/CategoryForm"
import useSWR from "swr";


export default function CategoryEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSupabaseSession()
  const form = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    }
  })

  // SWRでカテゴリーデータを取得
  const { data } = useSWR<{ category: CategoryShowResponse["category"] }>(
    token ? [`/api/admin/categories/${id}`, token] : null,
    ([url, token]: [string, string]) => fetch(url, {
      headers: { 'Content-Type': 'application/json', Authorization: token },
    }).then(res => res.json())
  )

  // 取得データをフォームに反映
  useEffect(() => {
    if (!data?.category) return
    form.reset({ name: data.category.name })
  }, [data])


  const onSubmit = async (values: FormValues) => {
    if (!token) return

    const { name } = values

    try {
      const body: UpdateCategoryRequestBody = { name }
      const res = await fetch(`/api/admin/categories/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(body),
        }
      );
      console.log(res.status);
      if (res.ok) {
        router.push('/admin/categories')
        alert("送信しました");
        form.reset()
      } else {
        alert(`送信失敗${res.status}`);
      }
    } catch (e) {
      if (e instanceof Error) {
        alert(`送信失敗${e.message}`);
      } else {
        alert(`送信失敗`);
      }
    }
  };

  const onDelete = async () => {
    if (!token) return

    if (!id) {
      alert('IDがありません');
      return;
    }
    if (!confirm('このカテゴリーを本当に削除しますか？')) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (res.ok) {
        router.push('/admin/categories')
        alert("削除しました");
      } else {
        alert(`削除失敗${res.status}`);
      }
    } catch (e) {
      if (e instanceof Error) {
        alert(`削除失敗${e.message}`);
      } else {
        alert(`削除失敗`);
      }
    }
  };


  if (form.formState.isSubmitting) {
    return <div>送信中...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-xl font-bold mb-10">カテゴリー編集</h1>
      <CategoryForm
        mode="edit"
        form={form}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </div>
  );
};