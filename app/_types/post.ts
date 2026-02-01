// TODO サーバーサイド側api/posts/route.tsと同じにしたほうがいい？

export interface Post {
  id: string
  title: string
  content: string
  thumbnailUrl: string
  createdAt: string
  updatedAt: string
  categories: {
    id: number
    name: string
  }[]
}
