import { prisma } from '@/app/_libs/prisma'
import { NextResponse } from 'next/server'

export type PostsIndexResponse = {
  posts: {
    id: number
    title: string
    content: string
    thumbnailUrl: string
    createdAt: string
    updatedAt: string
    categories: {
      id: number
      name: string
    }[]
  }[]
}

export async function GET() {
  try {
    // Postの一覧をDBから取得
    const posts = await prisma.post.findMany({
      include: {
        // カテゴリーも含めて取得
        postCategories: {
          include: {
            category: {
              // カテゴリのidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      //作成日時の降順で取得
      orderBy: {
        createdAt: 'desc'
      },
    })

    // DB形式をクライアント型に変換
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      thumbnailUrl: post.thumbnailUrl,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      categories: post.postCategories.map(pc => ({
        id: pc.category.id,
        name: pc.category.name
      }))
    }))

    console.log(formattedPosts)
    //レスポンスを返す
    return NextResponse.json<PostsIndexResponse>({ posts: formattedPosts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }

}
