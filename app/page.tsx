"use client"; // クライアントコンポーネントになると、useState,useEffect,クリックイベントonClickなど,ブラウザ依存の処理 が使えます。

import Link from "next/link";
import useSWR from "swr";
import type { PostsIndexResponse } from "@/app/api/posts/route";

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
  marginLeft: "1rem"
}

const homePostCategoryStyle: React.CSSProperties = {
  border: "1px solid #06c",
  borderRadius: ".2rem",
  color: "#06c",
  fontSize: ".8rem",
  marginRight: ".5rem",
  padding: ".2rem .4rem",
}

const homePostTitleStyle: React.CSSProperties = {
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

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export default function Page() {
  const { data, isLoading, error, mutate } = useSWR<{ posts: PostsIndexResponse["posts"] }>(
    '/api/posts',
    fetcher
  )

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>読み込めませんでした</div>;

  return (
    <div>
      <div style={homeContainerStyle}>
        <ul>
          {data?.posts?.map((post) => (
            <li style={homeListStyle} key={post.id}>
              <Link href={`/detail/${post.id}`} style={homeLinkStyle}>
                <div style={homePostStyle}>
                  <div>
                    <div style={homePostInfoStyle}>
                      <div style={homePostDateStyle}>{new Date(post.createdAt).toISOString().slice(0, 10)}</div>
                      <div style={homePostCategoriesStyle}>
                        {post.categories?.map((category, index) => (
                          <div style={homePostCategoryStyle} key={index}>{category.name}</div>
                        ))}
                      </div>
                    </div>
                    <p style={homePostTitleStyle}>{post.title}</p>
                    <div style={homePostBodyStyle} dangerouslySetInnerHTML={{ __html: post.content }} />
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