"use client"; // クライアントコンポーネントになると、useState,useEffect,クリックイベントonClickなど,ブラウザ依存の処理 が使えます。

import Link from "next/link";
import { useState, useEffect } from "react";
import type { MicroCmsPost } from "../_types/MicroCmsPost";

const homeContainerStyle: React.CSSProperties = {
  margin: "40px auto",
  maxWidth: "800px",
  padding: "0 1rem",
};

const homeListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
  margin: "0 auto",
  padding: "0",
  maxWidth: "800px",
};

const homeLinkStyle: React.CSSProperties = {
  color: "#333",
  textDecoration: "none",
};

const homePostStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  display: "flex",
  flexDirection: "row",
  marginBottom: "2rem",
  padding: "1rem",
};

const homePostInfoStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
}

const homePostDateStyle: React.CSSProperties = {
  color: "#888",
  fontSize: ".8rem",
}

const homePostCategoriesStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
}

const homePostCategoryStyle: React.CSSProperties = {
  border: "1px solid #06c",
  borderRadius: ".2rem",
  color: "#06c",
  fontSize: ".8rem",
  marginRight: ".5rem",
  padding: ".2rem .4rem",
}

const homePostTitleStyle: React.CSSProperties =  {
  fontSize: "1.5rem",
  marginBottom: "1rem",
  marginTop: ".5rem",
}

const homePostBodyStyle: React.CSSProperties = {
  fontSize: "1rem",
  lineHeight: "1.5",
  WebkitBoxOrient: "vertical",
  display: "-webkit-box",
  overflow: "hidden",
  maxHeight: "60px",
}



export const HomePage = () => {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  useEffect(() => {
    const fetcher = async () => {
      try{
        const res = await fetch('https://xecvneb0ei.microcms.io/api/v1/posts', {　// 管理画面で取得したエンドポイントを入力してください。
          headers: {　// fetch関数の第二引数にheadersを設定でき、その中にAPIキーを設定します。
            'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_APY_KEY as string, // 管理画面で取得したAPIキーを入力してください。
          },
        })
        const { contents } = await res.json()
        setPosts(contents)
      }finally{
        setLoading(false);
      }
    }
    fetcher();
  }, []);

  if(loading){
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <div style={homeContainerStyle}>
        <ul>
          {posts.map((post) => (
            <li style={homeListStyle} key={post.id}>
              <Link href={`/detail/${post.id}`} style={homeLinkStyle}>
                <div style={homePostStyle}>
                  <div>
                    <div style={homePostInfoStyle}>
                      <div style={homePostDateStyle}>{new Date(post.createdAt).toISOString().slice(0, 10)}</div>
                      <div style={homePostCategoriesStyle}>
                        {post.categories.map((cat, index) => (
                          <div style={homePostCategoryStyle} key={index}>{cat.name}</div>
                        ))}
                      </div>
                    </div>
                    <p style={homePostTitleStyle}>{post.title}</p>
                    <div style={homePostBodyStyle} dangerouslySetInnerHTML={{ __html: post.content }}/>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
