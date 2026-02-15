"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { contactSchema } from "../_libs/contactSchema";
import { useForm } from "react-hook-form"

export const Contact = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
    }
  })

  const onSubmit = async (values: any) => {
    setLoading(true);

    const { name, email, content } = values
    try {
      const res = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            content,
          }),
        }
      );
      console.log(res.status);
      if (res.ok) {
        alert("送信しました");
        onClickClear();
      } else {
        alert(`送信失敗${res.status}`);
      }
    } catch (e) {
      if (e instanceof Error) {
        alert(`送信失敗${e.message}`);
      } else {
        alert(`送信失敗`);
      }
    }
    finally {
      setLoading(false);
    }
  };

  const onClickClear = () => {
    form.reset()
  };

  if (loading) {
    return <div>送信中...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-xl font-bold mb-10">問合わせフォーム</h1>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-6">
          <label htmlFor="name" className="w-[240px]">お名前</label>
          <div className="w-full">
            <input id="name" type="text" className="border border-gray-300 rounded-lg p-4 w-full" {...form.register("name")} />
            {form.formState.errors.name && <p className="text-sm text-red-700">{form.formState.errors.name.message}</p>}
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <label htmlFor="email" className="w-[240px]">メールアドレス</label>
          <div className="w-full">
            <input id="email" type="email" className="border border-gray-300 rounded-lg p-4 w-full" {...form.register("email")} />
            {form.formState.errors.email && <p className="text-sm text-red-700">{form.formState.errors.email.message}</p>}
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <label htmlFor="message" className="w-[240px]">本文</label>
          <div className="w-full">
            <textarea id="message" rows={8} className="w-full border border-gray-300 rounded-lg p-4" {...form.register("content")} />
            {form.formState.errors.content && <p className="text-sm text-red-700">{form.formState.errors.content.message}</p>}
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <button type="submit" className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-4">送信</button>
          <button type="button" onClick={onClickClear} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">クリア</button>
        </div>
      </form>
    </div>
  );
};