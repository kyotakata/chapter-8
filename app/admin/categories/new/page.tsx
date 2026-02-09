"use client";

import { useState } from "react";
import { CategoryForm } from "../_components/CategoryForm";
import { useRouter } from 'next/navigation'
import { CreateCategoryRequestBody } from "@/app/api/admin/categories/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function CategoryCreatePage() {
  const [categoryNameError, setCategoryNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const router = useRouter()
  const { token } = useSupabaseSession()

  if (!token) return

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    // 画面リロードを防ぐ

    let hasError = false;

    if (categoryName.trim() === "") {
      setCategoryNameError("カテゴリー名を入力してください。");
      hasError = true;
    }

    if (hasError) return;


    const body: CreateCategoryRequestBody = { name: categoryName }// categoryNameをnameにすると{ name }という書き方(省略)ができる

    try {
      setIsSubmitting(true);

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
    finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <div>送信中...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-xl font-bold mb-10">カテゴリー作成</h1>
      <CategoryForm
        mode="new"
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoryNameError={categoryNameError}
        onSubmit={onSubmit}
        disabled={isSubmitting} />
    </div>
  );
};