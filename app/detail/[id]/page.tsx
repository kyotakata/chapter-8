"use client"; // クライアントコンポーネントになると、useState,useEffect,クリックイベントonClickなど,ブラウザ依存の処理 が使えます。

import { Detail } from "../../_components/Detail";

export default function DetailPage() {
  return (
    <div>
      <Detail />
    </div>
  );
}
