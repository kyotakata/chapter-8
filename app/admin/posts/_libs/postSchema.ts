"use Client"

import { z } from "zod"

export const postSchema = z.object({
  title: z.string().min(1, { message: "タイトルを入力してください。" }),
  content: z.string().min(1, { message: "内容を入力してください。" }),
  postCategories: z.array(z.object({ id: z.number() })),
  thumbnailImageKey: z.string(),
})

