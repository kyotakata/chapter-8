import { prisma } from '@/app/_libs/prisma'
import { NextResponse } from 'next/server'


export const GET = async () => {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json({ categories }, { status: 200 })
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
  try {
    const body: CreateCategoryRequestBody = await request.json()
    const { name } = body

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