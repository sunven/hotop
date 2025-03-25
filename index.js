import fs from 'fs-extra'
import * as cheerio from 'cheerio'
import { pick } from 'es-toolkit'
import { format } from "date-fns";
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TRENDING_URL = 'https://weibo.com/ajax/side/hotSearch'
const TRENDING_DETAIL_URL = 'https://m.s.weibo.com/topic/detail?q='

let RETRY_TIME = 5

async function saveRawJson(data) {
  const date = format(Date.now(), 'yyyy-MM-dd')
  const apiDir = path.join(__dirname, 'api')
  // 确保 api 目录存在，如果不存在则创建
  await fs.ensureDir(apiDir)
  // 写入文件
  await fs.writeFile(path.join(apiDir, `${date}.json`), JSON.stringify(data))
}

function getText(str) {
  const newStr = str.replace(/\s+/g, '')
  return newStr === '暂无' ? '' : newStr
}

async function fetchTrendingDetail(title) {
  try {
    const res = await fetch(TRENDING_DETAIL_URL + title)
    const data = await res.text()
    const $ = cheerio.load(data)
    return {
      category: getText($('#pl_topicband dl>dd').first().text()),
      description: getText($('#pl_topicband dl:eq(1)').find('dd:not(.host-row)').last().text()),
    }
  } catch {
    return {}
  }
}

async function bootstrap() {
  while (RETRY_TIME > 0) {
    try {
      const { data: { realtime } } = await fetch(TRENDING_URL).then(res => res.json())
      const detailList = await Promise.all(realtime.map(c => fetchTrendingDetail(c.word)))
      const list = []
      detailList.forEach((detail, index) => {
        const item = realtime[index]
        item.category = detail.category
        item.description = detail.description
        list.push(pick(item, ['word', 'word_scheme', 'num', 'icon_desc', 'ad_type', 'flag_desc', 'rank', 'category', 'description']))
      })
      await saveRawJson(list)
      RETRY_TIME = 0
    } catch (err) {
      console.log(err)
      RETRY_TIME -= 1
    }
  }
  process.exit(0)
}

bootstrap()