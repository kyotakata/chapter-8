"use client"; // クライアントコンポーネントになると、useState,useEffect,クリックイベントonClickなど,ブラウザ依存の処理 が使えます。

import Link from "next/link";
import useSWR from "swr";
import { CategoryIndexResponse } from "@/app/api/admin/categories/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

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
  marginBottom: "1rem",
}




export default function AdminCategoryPage() {
  const { token } = useSupabaseSession()

  const { data, isLoading } = useSWR<{ categories: CategoryIndexResponse["categories"] }>(
    token ? ['/api/admin/categories', token] : null,
    ([url, token]: [string, string]) => fetch(url, {
      headers: { 'Content-Type': 'application/json', Authorization: token },
    }).then(res => res.json())
  )
  const categories = data?.categories ?? []

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 style={homeTitleStyle}>カテゴリー一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded py-2 px-4">
          <Link href="/admin/categories/new">新規作成</Link>
        </button>
      </div>
      <div style={homeContainerStyle}>
        <ul>
          {categories.map((cat) => (
            <li style={homeListStyle} key={cat.id}>
              <Link href={`/admin/categories/${cat.id}`} style={homeLinkStyle}>
                <div>
                  <p style={homePostTitleStyle}>{cat.name}</p>
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
