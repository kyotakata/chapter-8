import { prisma } from '@/app/_libs/prisma'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { supabase } from '@/app/_libs/supabase'

export type CategoryIndexResponse = {
  categories: {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
  }[]
}

export const GET = async (request: NextRequest) => {
  // GET関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get('Authorization') ?? ''

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token)

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    const categories = await prisma.category.findMany()

    // べた書きすると、以下になる。
    // const body: CategoryIndexResponse = {
    //   categories: categories,
    // }
    // return NextResponse.json(body, {
    //   status: 200,
    // })

    return NextResponse.json<CategoryIndexResponse>({ categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}


export type CreateCategoryRequestBody = {
  name: string
}

export type CreateCategoryResponse = {
  id: number
}


export const POST = async (request: Request) => {
  // GET関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get('Authorization') ?? ''

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token)

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    // リクエストのbodyを取得
    const body = await request.json()
    // nameを取り出す
    const { name }: CreateCategoryRequestBody = body

    // DBに登録
    const data = await prisma.category.create({
      data: {
        name,
      }
    })

    return NextResponse.json<CreateCategoryResponse>({ id: data.id })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}