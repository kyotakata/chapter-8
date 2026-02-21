"use client";

import { useEffect } from "react";
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { PostShowResponse } from "@/app/api/admin/posts/[id]/route";
import { PostForm } from "../_components/PostForm";
import { UpdatePostRequestBody } from "@/app/api/admin/posts/[id]/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../_libs/postSchema"
import { FormValues } from "../_components/PostForm";

export default function PostEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSupabaseSession()
  const form = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      postCategories: [],
      thumbnailImageKey: "",
    }
  })


  const onSubmit = async (values: FormValues) => {
    if (!token) return

    // 更新
    try {
      const { title, content, postCategories, thumbnailImageKey } = values;
      const body: UpdatePostRequestBody = {
        title,
        content,
        categories: postCategories,
        thumbnailImageKey: thumbnailImageKey,
      }

      const res = await fetch(`/api/admin/posts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(body),
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
  };

  const onDelete = async () => {
    if (!token) return

    if (!id) {
      alert('IDがありません');
      return;
    }
    if (!confirm('この投稿を本当に削除しますか？')) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
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
  };


  useEffect(() => {
    if (!token) return
    const fetcher = async () => {

      try {
        //投稿ページ取得
        const res = await fetch(`/api/admin/posts/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        const { post }: { post: PostShowResponse["post"] } = await res.json()//分割代入して型定義しているだけ
        if (post) {
          const { title, content, postCategories, thumbnailImageKey } = post
          form.reset({
            title,
            content,
            postCategories: (postCategories ?? []).map(pc => ({ id: pc.category.id })),
            thumbnailImageKey,
          })
        }
      } catch (e) {
        if (e instanceof Error) {
          alert(`取得失敗${e.message}`)
        } else {
          alert(`取得失敗`)
        }
      }
    }
    fetcher();
  }, [token]);


  if (form.formState.isSubmitting) {
    return <div>送信中...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-xl font-bold mb-10">記事編集</h1>
      <PostForm mode="edit"
        form={form}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </div>
  );
};