"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation'
import { Category } from "@/app/_types/category"
import { redirect } from 'next/navigation'

export default function CategoryEditPage() {
  const [catNameError, setCatNameError] = useState("");
  const [loading, setLoading] = useState(false);

  const [catNameText, setCatNameText] = useState("");
  const onChangeCategoryText = (event: React.ChangeEvent<HTMLInputElement>) => setCatNameText(event.target.value);
  const { id } = useParams()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    // 画面リロードを防ぐ

    let hasError = false;

    if (catNameText.trim() === "") {
      setCatNameError("カテゴリー名を入力してください。");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: catNameText,
          }),
        }
      );
      console.log(res.status);
      if (res.ok) {
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
      setLoading(false);
      redirect('/admin/categories')
    }
  };

  const onClickDelete = async () => {
    if (!id) {
      alert('IDがありません');
      return;
    }
    if (!confirm('このカテゴリーを本当に削除しますか？')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("削除しました");
        setCatNameText("");
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
      setLoading(false);
      redirect('/admin/categories')
    }
  };


  const [category, setCategory] = useState<Category>();
  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`)
        const data = await res.json()
        setCategory(data.category)

        if (data.category) {
          const { name } = data.category;
          setCatNameText(name);
        }

      } finally {
        setLoading(false);
      }
    }
    fetcher();
  }, []);


  if (loading) {
    return <div>送信中...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-xl font-bold mb-10">カテゴリー編集</h1>
      <form onSubmit={onSubmit}>
        <div className="flex justify-between items-center mb-6">
          <div className="w-full">
            <label htmlFor="category" className="text-gray-500">カテゴリー名</label>
            <input name="category" id="category" type="text" className="border border-gray-300 rounded-lg p-4 w-full" value={catNameText} onChange={onChangeCategoryText} />
            {catNameError && <p className="text-sm text-red-700">{catNameError}</p>}
          </div>
        </div>
        <div className="flex mt-5">
          <button type="submit" className="bg-indigo-700 text-white py-2 px-4 rounded-lg mr-4">更新</button>
          <button type="button" onClick={onClickDelete} className="bg-rose-700 text-white py-2 px-4 rounded-lg">削除</button>
        </div>
      </form>
    </div>
  );
};