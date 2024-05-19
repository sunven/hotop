type ZhihuTopSearch = {
  top_search: {
    words: WordType[]
  }
}

type WordType = {
  query: string
}

function getHotSearch() {
  return fetch('https://www.zhihu.com/api/v4/search/top_search')
    .then<ZhihuTopSearch>(res => res.json())
    .then(({ top_search }) => {
      return top_search.words
    })
}

export default async function Home() {
  const data = await getHotSearch()
  return (
    <div className="flow-root p-2">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        {data.map((item: WordType, index: number) => (
          <div key={index} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900 flex gap-1 items-center">
              {item.query}
              {/* <span className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-sm text-green-600">
                {item.category}
              </span> */}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  )
}
