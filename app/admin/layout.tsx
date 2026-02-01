import Link from 'next/link'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <aside className='fixed bg-gray-100 w-70 left-0 bottom-0 top-18'>
        <Link href="/admin/posts" className='p-4 block hover:bg-blue-100'>記事一覧</Link>
        <Link href="/admin/categories" className='p-4 block hover:bg-blue-100'>カテゴリー一覧</Link>
      </aside>
      <div className='ml-70 p-4'>{children}</div>
    </>
  )
}
