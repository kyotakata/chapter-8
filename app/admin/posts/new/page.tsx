"use client";

import { useState, useEffect } from "react";
import { Category } from "@/app/api/admin/posts/[id]/route"
import { useRouter } from 'next/navigation'
import { PostForm } from "../_components/PostForm";

export default function PostCreatePage() {
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("https://placehold.jp/800×400.png");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    // 画面リロードを防ぐ

    let hasError = false;

    if (title.trim() === "") {
      setTitleError("タイトルは必須です。");
      hasError = true;
    }

    if (content.trim() === "") {
      setContentError("内容は必須です。");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            content: content,
            categories: selectedCategories,
            thumbnailUrl: thumbnailUrl,
          }),
        }
      );
      console.log(res.status);
      if (res.ok) {
        router.push('/admin/posts')
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
    }
  };



  useEffect(() => {
    const fetcher = async () => {
      try {
        const categoriesRes = await fetch(`/api/admin/categories`)
        const categoriesData = await categoriesRes.json()

        setCategories(categoriesData.categories)
        if (categoriesData.categories) {
          setCategories(categoriesData.categories);
          console.log(categories)
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
      <h1 className="text-xl font-bold mb-10">記事作成</h1>
      <PostForm mode="new"
        title={title}
        setTitle={setTitle}
        titleError={titleError}
        content={content}
        setContent={setContent}
        contentError={contentError}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        setCategories={setCategories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        onSubmit={onSubmit}
      />
    </div>
  );
};