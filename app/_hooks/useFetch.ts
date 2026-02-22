import React from 'react'
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"
import useSWR from "swr";

const fetcher = async ([url, token]: [string, string]) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  })

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const useFetch = <ResponseType>(endpoint: string) => {
  const { token } = useSupabaseSession()

  const { data, isLoading, error, mutate } = useSWR<ResponseType>(
    token ? [endpoint, token] : null,
    fetcher)

  return { data, isLoading, error, mutate }
}
