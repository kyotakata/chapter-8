"use client";

import { useEffect } from "react";
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { PostShowResponse } from "@/app/api/admin/posts/[id]/route";
import { PostForm } from "../_components/PostForm";
import { UpdatePostRequestBody } from "@/app/api/admin/posts/[id]/route";
import { CreatePostRequestBody } from "@/app/api/admin/posts/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../_libs/postSchema"
import { useFetch } from "@/app/_hooks/useFetch"


export default function PostEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSupabaseSession()
  const form = useForm<CreatePostRequestBody>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      postCategories: [],
      thumbnailImageKey: "",
    }
  })

  // SWRで投稿データを取得
  const { data, isLoading, error, mutate } = useFetch<{ post: PostShowResponse["post"] }>(
    id ? `/api/admin/posts/${id}` : ""
  )


  // 取得データをフォームに反映
  useEffect(() => {
    if (!data?.post) return
    const { title, content, postCategories, thumbnailImageKey } = data.post
    form.reset({
      title,
      content,
      postCategories: (postCategories ?? []).map(pc => ({ id: pc.category.id })),
      thumbnailImageKey,
    })
  }, [data])

  const onSubmit = async (values: CreatePostRequestBody) => {
    if (!token) return

    // 更新
    try {
      const { title, content, postCategories, thumbnailImageKey } = values;
      const body: UpdatePostRequestBody = {
        title,
        content,
        postCategories,
        thumbnailImageKey,
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


  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>読み込めませんでした</div>;

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