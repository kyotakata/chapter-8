"use client"; // クライアントコンポーネントになると、useState,useEffect,クリックイベントonClickなど,ブラウザ依存の処理 が使えます。

import Link from "next/link";
import useSWR from "swr";
import { PostIndexResponse } from "@/app/api/admin/posts/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch"

const homeContainerStyle: React.CSSProperties = {
  marginTop: '4rem'
};

const homeListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
  margin: "2rem",
  padding: "0",
};

const homeLinkStyle: React.CSSProperties = {
  color: "#333",
  textDecoration: "none",
};

const homeTitleStyle: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: '1.2rem',
  margin: '1rem'
};


const homePostDateStyle: React.CSSProperties = {
  color: "#888",
  marginBottom: "1rem",
}

const homePostTitleStyle: React.CSSProperties = {
  fontWeight: 'bold',
}


export default function AdminPostPage() {
  const { data, isLoading, error, mutate } = useFetch<{ posts: PostIndexResponse["posts"] }>(
    '/api/admin/posts'
  )

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>読み込めませんでした</div>;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 style={homeTitleStyle}>記事一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded py-2 px-4">
          <Link href="/admin/posts/new">新規作成</Link>
        </button>
      </div>
      <div style={homeContainerStyle}>
        <ul>
          {data?.posts.map((post) => (
            <li style={homeListStyle} key={post.id}>
              <Link href={`/admin/posts/${post.id}`} style={homeLinkStyle}>
                <div>
                  <p style={homePostTitleStyle}>{post.title}</p>
                  <div style={homePostDateStyle}>{new Date(post.createdAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}</div>
                  <hr style={{ borderColor: "#ddd" }} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
