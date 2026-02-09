"use client"; // クライアントコンポーネントになると、useState,useEffect,クリックイベントonClickなど,ブラウザ依存の処理 が使えます。


import Link from "next/link";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { supabase } from "../_libs/supabase";
import { useRouter } from "next/navigation";

const headerStyle: React.CSSProperties = {
  backgroundColor: "#333",
  display: "flex",
  alignItems: 'center',
  justifyContent: 'space-between',
  color: '#FFF',
  fontWeight: 700,
  padding: '24px',
};

const headerLinkStyle: React.CSSProperties = {
  color: '#FFF',
  textDecoration: 'none',
};


export const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await router.replace('/')
  }

  const { session, isLoading } = useSupabaseSession()


  return (
    <header style={headerStyle}>
      <Link href="/" style={headerLinkStyle}>Blog</Link>
      {!isLoading && (
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/admin" className="header-link">
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" style={headerLinkStyle}>お問い合わせ</Link>
              <Link href="/sign_in" className="header-link">
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};