import { Metadata } from 'next'
import Link from 'next/link'

export const runtime = 'edge'

type WeiboHotSearch = {
  ok: number
  data: {
    realtime: RealtimeType[]
  }
}

type RealtimeType = {
  ad_type: string
  word: string
  flag_desc: string
  word_scheme: string
}

function getHotSearch() {
  return fetch('https://weibo.com/ajax/side/hotSearch')
    .then<WeiboHotSearch>(res => res.json())
    .then(({ data }) => {
      return data.realtime
        .filter(c => !['商业投放', '资源投放'].includes(c.ad_type))
        .filter(c => !['综艺', '剧集', '盛典'].includes(c.flag_desc))
    })
}

export const revalidate = 0

export const metadata: Metadata = {
  title: '微博-HoTop',
  description: 'Generated by create next app',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black',
  },
}

export default async function Home() {
  const data = await getHotSearch()
  return (
    <div className="flow-root p-2">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        {data.map((item: RealtimeType, index: number) => (
          <Link
            key={index}
            href={`https://m.weibo.cn/search?containerid=${encodeURIComponent(
              `100103type=1&t=10&q=${item.word_scheme}`
            )}`}
          >
            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900 flex gap-1 items-center">
                {item.word}
                {item.flag_desc && (
                  <span className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-sm text-green-600">
                    {item.flag_desc}
                  </span>
                )}
              </dt>
            </div>
          </Link>
        ))}
      </dl>
    </div>
  )
}
