"use Client"

import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().min(1, { message: "お名前は必須です。" }),
  email: z.string().email({ message: "メールアドレスの形式が正しくありません。" }),
  content: z.string()
    .min(1, { message: "本文は必須です。" })
    .max(500, { message: "本文は500文字以内にしてください。" }),
})