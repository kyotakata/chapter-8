"use client"; // クライアントコンポーネントになると、useState,useEffect,クリックイベントonClickなど,ブラウザ依存の処理 が使えます。

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import type { MicroCmsPost } from "../_types/MicroCmsPost";
import Image from "next/image";

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

const detailPostTitleStyle: React.CSSProperties =  {
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
  const [post, setPost] = useState<MicroCmsPost>(); 
  const [loading, setLoading] = useState<boolean>(true); 
  const params = useParams();
  const id = params?.id as string | undefined;

  useEffect(() => {
    if (!id) return;
    const fetcher = async () => {
      try{
        const res = await fetch(`https://xecvneb0ei.microcms.io/api/v1/posts/${encodeURIComponent(id)}`, {　// 管理画面で取得したエンドポイントを入力してください。
          headers: {　// fetch関数の第二引数にheadersを設定でき、その中にAPIキーを設定します。
            'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_APY_KEY as string, // 管理画面で取得したAPIキーを入力してください。
          },
        });
        console.log(res);
        const data = await res.json();
        console.log(data);

        setPost(data);
      }finally{
        setLoading(false);
      }
    }
    fetcher();
  }, [id]);

  if(loading){
    return <div>読み込み中...</div>;
  }

  if (!post) {
    return <div>記事が見つかりませんでした</div>;
  }
  return (
    <div style={detailContainerStyle}>
      <div style={detailPostStyle}>
        <div style={detailPostImageStyle}>
          <Image src={post.thumbnail.url} alt="" width={post.thumbnail.width} height={post.thumbnail.height}/>
        </div>
        <div style={detailPostContentStyle}>
          <div style={detailPostInfoStyle}>
            <div style={detailPostDateStyle}>{new Date(post.createdAt).toISOString().slice(0, 10)}</div>
            <div style={detailPostCategoriesStyle}>
              {post.categories.map((cat, index) => (
                <div style={detailPostCategoryStyle} key={index}>{cat.name}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={detailPostTitleStyle}>{post.title}</div>
        <div style={detailPostBodyStyle} dangerouslySetInnerHTML={{ __html: post.content }}/>
      </div>
    </div>
  );
};