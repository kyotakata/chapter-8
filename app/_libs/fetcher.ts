/**
 * adminページ用fetcher(認証が必要)
 * @param param0 url token
 * @returns APIレスポンスのJSONオブジェクト
 */
export const authFetcher = async ([url, token]: [string, string]) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  })

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

/**
 * 公開ページ用fetcher(認証不要)
 * @param param0 url
 * @returns APIレスポンスのJSONオブジェクト
 */
export const publicFetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}