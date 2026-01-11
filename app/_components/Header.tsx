"use client"; // クライアントコンポーネントになると、useState,useEffect,クリックイベントonClickなど,ブラウザ依存の処理 が使えます。


import Link from "next/link";

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


export const Header = () => {
  return (
      <header style={headerStyle}>
        <Link href="/" style={headerLinkStyle}>Blog</Link>
        <Link href="/contact" style={headerLinkStyle}>お問い合わせ</Link>
      </header>
  );
};