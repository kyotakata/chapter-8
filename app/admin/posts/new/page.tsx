"use client";

import { useState } from "react";
import { Category } from "@/app/api/admin/posts/[id]/route"
import { useRouter } from 'next/navigation'
import { PostForm } from "../_components/PostForm";
import { CreatePostRequestBody } from "@/app/api/admin/posts/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function PostCreatePage() {
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const router = useRouter()
  const { token } = useSupabaseSession()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    // 画面リロードを防ぐ
    if (!token) return

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


    try {
      setIsSubmitting(true);

      const body: CreatePostRequestBody = {
        title: title,
        content: content,
        categories: selectedCategories,
        thumbnailImageKey: thumbnailImageKey,
      }

      const res = await fetch(`/api/admin/posts`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify(body),
        }
      );
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
      setIsSubmitting(false);
    }
  };


  if (isSubmitting) {
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
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        onSubmit={onSubmit}
        disabled={isSubmitting}
      />
    </div>
  );
};