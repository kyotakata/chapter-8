"use client";

import { useRouter } from 'next/navigation'
import { PostForm } from "../_components/PostForm";
import { CreatePostRequestBody } from "@/app/api/admin/posts/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../_libs/postSchema"

export default function PostCreatePage() {
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


  const onSubmit = async (values: CreatePostRequestBody) => {
    if (!token) return

    try {
      const { title, content, postCategories, thumbnailImageKey } = values;
      const body: CreatePostRequestBody = {
        title,
        content,
        postCategories,
        thumbnailImageKey,
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
  };


  if (form.formState.isSubmitting) {
    return <div>送信中...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-xl font-bold mb-10">記事作成</h1>
      <PostForm mode="new"
        form={form}
        onSubmit={onSubmit}
      />
    </div>
  );
};