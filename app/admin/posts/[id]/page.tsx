"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation'
import { Post } from "@/app/_types/post"
import { Category } from "@/app/api/admin/posts/[id]/route"
import { redirect } from 'next/navigation'
import { PostShowResponse } from "@/app/api/admin/posts/[id]/route";

export default function PostEditPage() {
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [loading, setLoading] = useState(false);

  const [titleText, setTitleText] = useState("");
  const [contentText, setContentText] = useState("");
  const [thumbnailUrlText, setThumbnailUrlText] = useState("https://placehold.jp/800×400.png");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const onChangeTitleText = (event: React.ChangeEvent<HTMLInputElement>) => setTitleText(event.target.value);
  const onChangeContextText = (event: React.ChangeEvent<HTMLTextAreaElement>) => setContentText(event.target.value);
  const onChangeThumbnailUrlText = (event: React.ChangeEvent<HTMLInputElement>) => setThumbnailUrlText(event.target.value);
  const { id } = useParams()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    // 画面リロードを防ぐ

    let hasError = false;

    if (titleText.trim() === "") {
      setTitleError("お名前は必須です。");
      hasError = true;
    }

    if (contentText.trim() === "") {
      setContentError("本文は必須です。");
      hasError = true;
    }

    if (hasError) return;

    // console.log(selectedCategories)
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: titleText,
            content: contentText,
            categories: selectedCategories,
            thumbnailUrl: thumbnailUrlText,
          }),
        }
      );
      // console.log(res.status);
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
      redirect('/admin/posts')
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
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
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
      setLoading(false);
      redirect('/admin/posts')
    }
  };

  const toggleCategory = (id: number) => {
    const exists = selectedCategories.some((category) => category.id === id)
    // console.log(exists)

    if (exists) {// 選択カテゴリに同じカテゴリIDがある場合
      setSelectedCategories(
        selectedCategories.filter((category) => category.id !== id)
      )
      return
    }

    // 選択カテゴリに同じカテゴリIDがない場合
    const category = categories.find((c) => c.id === id)
    if (!category) return
    setSelectedCategories([...selectedCategories, category])
  }


  const [post, setPost] = useState<Post>();
  useEffect(() => {
    const fetcher = async () => {
      try {
        //投稿ページ取得
        const postRes = await fetch(`/api/admin/posts/${id}`)
        //カテゴリ一覧取得
        const categoriesRes = await fetch(`/api/admin/categories`)
        const { post }: { post: PostShowResponse["post"] } = await postRes.json()
        const categoriesData = await categoriesRes.json()

        setCategories(categoriesData.categories)

        if (post) {
          setTitleText(post.title);
          setContentText(post.content);
          setThumbnailUrlText(post.thumbnailUrl);
          // postCategories は { category: { id, name } }[] の形なので
          // クライアントで扱う Category[] に変換してセットする
          setSelectedCategories((post.postCategories ?? []).map((pc) => pc.category))
          console.log(post.postCategories)
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
      <h1 className="text-xl font-bold mb-10">記事編集</h1>
      <form onSubmit={onSubmit}>
        <div className="flex justify-between items-center mb-6">
          <div className="w-full">
            <label htmlFor="title" className="text-gray-500">タイトル</label>
            <input name="title" id="title" type="text" className="border border-gray-300 rounded-lg p-4 w-full" value={titleText} onChange={onChangeTitleText} />
            {titleError && <p className="text-sm text-red-700">{titleError}</p>}
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="w-full">
            <label htmlFor="content" className="text-gray-500">内容</label>
            <textarea name="content" id="content" rows={4} className="border border-gray-300 rounded-lg p-4 w-full" value={contentText} onChange={onChangeContextText} />
            {contentError && <p className="text-sm text-red-700">{contentError}</p>}
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="w-full">
            <label htmlFor="thumbnail" className="text-gray-500">サムネイルURL</label>
            <input name="thumbnail" id="thumbnail" type="text" className="w-full border border-gray-300 rounded-lg p-4" value={thumbnailUrlText} onChange={onChangeThumbnailUrlText} />
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="w-full">
            <label htmlFor="thumbnail" className="text-gray-500 flex">カテゴリー</label>
            {categories?.map((category) => {
              const isSelected = selectedCategories.some((selected) => selected.id === category.id)
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={isSelected
                    ? 'rounded-full border px-3 py-1 text-sm border-blue-600 bg-blue-600 text-white'
                    : ' rounded-full border px-3 py-1 text-sm border-gray-300 bg-white text-gray-800'
                  }>
                  {category.name}
                </button>)
            })}
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