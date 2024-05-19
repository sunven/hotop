type WeiboHotSearch = {
  ok: number
  data: {
    realtime: RealtimeType[]
  }
}

type RealtimeType = {
  ad_type: string
  word: string
  category: string
}

function getHotSearch() {
  return fetch('https://weibo.com/ajax/side/hotSearch')
    .then<WeiboHotSearch>(res => res.json())
    .then(({ data }) => {
      return data.realtime.filter(c => !['商业投放', '资源投放'].includes(c.ad_type))
    })
}

export default async function Home() {
  const data = await getHotSearch()
  return (
    <div className="flow-root p-2">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        {data.map((item: RealtimeType, index: number) => (
          <div key={index} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900 flex gap-1 items-center">
              {item.word}
              <span className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-sm text-green-600">
                {item.category}
              </span>
            </dt>
          </div>
        ))}
      </dl>
    </div>
  )
}
