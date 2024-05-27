import { Metadata } from 'next'

type BiliTopSearch = {
  data: { list: WordType[] }
}

type WordType = {
  keyword: string
}

function getHotSearch() {
  return fetch('https://app.bilibili.com/x/v2/search/trending/ranking')
    .then<BiliTopSearch>(res => res.json())
    .then(({ data }) => {
      return data.list
    })
}

export const revalidate = 0

export const metadata: Metadata = {
  title: 'B站-HoTop',
  description: 'Generated by create next app',
}

export default async function Home() {
  const data = await getHotSearch()
  return (
    <div className="flow-root p-2">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        {data.map((item: WordType, index: number) => (
          <div key={index} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900 flex gap-1 items-center">{item.keyword}</dt>
          </div>
        ))}
      </dl>
    </div>
  )
}