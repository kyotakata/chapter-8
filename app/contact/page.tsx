"use client"; // クライアントコンポーネントになると、useState,useEffect,クリックイベントonClickなど,ブラウザ依存の処理 が使えます。

import { Contact } from "../_components/Contact";

export default function ContactPage() {
  return (
    <div>
      <Contact />
    </div>
  );
}
