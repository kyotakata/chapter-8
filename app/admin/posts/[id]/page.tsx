"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { PostShowResponse } from "@/app/api/admin/posts/[id]/route";
import { Category } from "@/app/api/admin/posts/[id]/route"
import { PostForm } from "../_components/PostForm";

export default function PostEditPage() {
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("https://placehold.jp/800×400.png");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { id } = useParams()
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    // 画面リロードを防ぐ

    setIsSubmitting(true);

    // チェック
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

    // 更新
    try {
      const res = await fetch(`/api/admin/posts/${id}`,
        {
          method: "PUT",
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

      if (res.ok) {
        router.push('/admin/posts')
        alert("更新しました");
      } else {
        alert(`更新失敗${res.status}`);
      }
    } catch (e) {
      if (e instanceof Error) {
        alert(`更新失敗${e.message}`);
      } else {
        alert(`更新失敗`);
      }
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    setIsSubmitting(true);

    if (!id) {
      alert('IDがありません');
      return;
    }
    if (!confirm('このカテゴリーを本当に削除しますか？')) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push('/admin/posts')
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
    const fetcher = async () => {
      try {
        //投稿ページ取得
        const postRes = await fetch(`/api/admin/posts/${id}`)
        //カテゴリ一覧取得
        const categoriesRes = await fetch(`/api/admin/categories`)
        const { post }: { post: PostShowResponse["post"] } = await postRes.json()//分割代入して型定義しているだけ
        const { categories } = await categoriesRes.json()
        setCategories(categories)

        setTitle(post.title);
        setContent(post.content);
        setThumbnailUrl(post.thumbnailUrl);
        // postCategories は { category: { id, name } }[] の形なので
        // クライアントで扱う Category[] に変換してセットする
        setSelectedCategories((post.postCategories ?? []).map((pc) => pc.category))

      } finally {
        setIsSubmitting(false);
      }
    }
    fetcher();
  }, []);


  if (isSubmitting) {
    return <div>送信中...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-xl font-bold mb-10">記事編集</h1>
      <PostForm mode="edit"
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
        onDelete={onDelete}
        disabled={isSubmitting}
      />
    </div>

  );
};