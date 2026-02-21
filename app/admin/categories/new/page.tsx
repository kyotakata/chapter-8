"use client";

import { CategoryForm } from "../_components/CategoryForm";
import { useRouter } from 'next/navigation'
import { CreateCategoryRequestBody } from "@/app/api/admin/categories/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useForm } from "react-hook-form"
import { categorySchema } from "../_libs/categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues } from "../_components/CategoryForm"

export default function CategoryCreatePage() {
  const router = useRouter()
  const { token } = useSupabaseSession()

  const form = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    }
  })

  if (!token) return

  const onSubmit = async (values: FormValues) => {
    if (!token) return

    const { name } = values
    const body: CreateCategoryRequestBody = { name }

    try {
      const res = await fetch(`/api/admin/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // Header に token を付与
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

  if (form.formState.isSubmitting) {
    return <div>送信中...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-xl font-bold mb-10">カテゴリー作成</h1>
      <CategoryForm
        mode="new"
        form={form}
        onSubmit={onSubmit}
      />
    </div>
  );
};