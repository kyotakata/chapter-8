"use client"; // クライアントコンポーネントになると、useState,useEffect,クリックイベントonClickなど,ブラウザ依存の処理 が使えます。

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [post, setPost] = useState<PostShowResponse["post"]>();
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
  const id = params?.id as string | undefined;
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  )

  useEffect(() => {
    if (!id) return;
    const fetcher = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/posts/${id}`);

        const { post }: { post: PostShowResponse["post"] } = await res.json();
        setPost(post);

        if (!post.thumbnailImageKey) return

        // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
        const {
          data: { publicUrl },
        } = await supabase.storage
          .from('post_thumbnail')
          .getPublicUrl(post.thumbnailImageKey)

        setThumbnailImageUrl(publicUrl)

      } finally {
        setLoading(false);
      }


    }
    fetcher();
  }, [id]);

  if (loading) {
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