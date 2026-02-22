"use client"; // クライアントコンポーネントになると、useState,useEffect,クリックイベントonClickなど,ブラウザ依存の処理 が使えます。

import { useParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";
import type { PostShowResponse } from "@/app/api/posts/[id]/route";
import Image from "next/image";
import { supabase } from "@/app/_libs/supabase";

const detailContainerStyle: React.CSSProperties = {
  margin: "40px auto",
  maxWidth: "800px",
};

const detailPostStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
};

const detailPostImageStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
};

const detailPostContentStyle: React.CSSProperties = {
  padding: "1rem"
};

const detailPostInfoStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
}

const detailPostDateStyle: React.CSSProperties = {
  color: "#888",
  fontSize: ".8rem",
};

const detailPostCategoriesStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
}

const detailPostCategoryStyle: React.CSSProperties = {
  border: "1px solid #06c",
  borderRadius: ".2rem",
  color: "#06c",
  fontSize: ".8rem",
  marginRight: ".5rem",
  padding: ".2rem .4rem",
}

const detailPostTitleStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  marginBottom: "1rem",
  marginTop: ".5rem",
}

const detailPostBodyStyle: React.CSSProperties = {
  fontSize: "1rem",
  lineHeight: "1.5",
  WebkitBoxOrient: "vertical",
  display: "-webkit-box",
  overflow: "hidden",
}

export const Detail = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const { data, isLoading } = useSWR<{ post: PostShowResponse["post"] }>(
    id ? `/api/posts/${id}` : null,
    (url: string) => fetch(url).then(res => res.json())
  )
  const post = data?.post

  // thumbnailImageKeyからSupabaseの画像URLを導出
  const thumbnailImageUrl = useMemo(() => {
    if (!post?.thumbnailImageKey) return null
    const { data: { publicUrl } } = supabase.storage
      .from('post_thumbnail')
      .getPublicUrl(post.thumbnailImageKey)
    return publicUrl
  }, [post?.thumbnailImageKey])

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (!post) {
    return <div>記事が見つかりませんでした</div>;
  }
  return (
    <div style={detailContainerStyle}>
      <div style={detailPostStyle}>
        <div style={detailPostImageStyle}>
          <Image src={thumbnailImageUrl || ""} alt="thumbnail" width={400} height={400} />
        </div>
        <div style={detailPostContentStyle}>
          <div style={detailPostInfoStyle}>
            <div style={detailPostDateStyle}>{new Date(post.createdAt).toLocaleDateString("ja-JP")}</div>
            <div style={detailPostCategoriesStyle}>
              {post.postCategories?.map((cat, index) => (
                <div style={detailPostCategoryStyle} key={index}>{cat.category.name}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={detailPostTitleStyle}>{post.title}</div>
        <div style={detailPostBodyStyle} dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
};