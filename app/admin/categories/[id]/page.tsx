"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation'
import { CategoryForm } from "../_components/CategoryForm";
import { useRouter } from 'next/navigation'
import { UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import { CategoryShowResponse } from "@/app/api/admin/categories/[id]/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function CategoryEditPage() {
  const [categoryNameError, setCategoryNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSupabaseSession()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    // 画面リロードを防ぐ
    if (!token) return

    let hasError = false;

    if (categoryName.trim() === "") {
      setCategoryNameError("カテゴリー名を入力してください。");
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsSubmitting(true);
      const body: UpdateCategoryRequestBody = { name: categoryName }

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

  const onDelete = async () => {
    if (!token) return

    if (!id) {
      alert('IDがありません');
      return;
    }
    if (!confirm('このカテゴリーを本当に削除しますか？')) return;

    try {
      setIsSubmitting(true);

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
    finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (!token) return

    const fetcher = async () => {

      try {
        const res = await fetch(`/api/admin/categories/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        const { category }: { category: CategoryShowResponse["category"] } = await res.json()

        if (category) {
          const { name } = category;
          setCategoryName(name);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
    fetcher();
  }, [token]);


  if (isSubmitting) {
    return <div>送信中...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-xl font-bold mb-10">カテゴリー編集</h1>
      <CategoryForm
        mode="edit"
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoryNameError={categoryNameError}
        onSubmit={onSubmit}
        onDelete={onDelete}
        disabled={isSubmitting} />
    </div>
  );
};