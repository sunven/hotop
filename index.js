import fs from 'fs-extra'
import * as cheerio from 'cheerio'
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TRENDING_URL = 'https://m.weibo.cn/api/container/getIndex?containerid=106003type%3D25%26t%3D3%26disable_hot%3D1%26filter_type%3Drealtimehot'
const TRENDING_DETAIL_URL = 'https://m.s.weibo.com/topic/detail?q='

let RETRY_TIME = 5

async function saveRawJson(data) {
  const date = format(new TZDate(Date.now(), "Asia/Shanghai"), 'yyyy-MM-dd');
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
      const res = await fetch(TRENDING_URL).then(res => res.json())
      const list = res.data.cards[0].card_group
        .filter((k) => !k.pic.includes('img_search_stick') && k.desc && !k.actionlog?.ext.includes("ads_word"))
        .map((k) => {
          return {
            title: k.desc,
            icon: k.icon,
            scheme: k.scheme,
          }
        })
      const detailList = await Promise.all(list.map(c => fetchTrendingDetail(c.desc)))
      const result = []
      detailList.forEach((detail, index) => {
        const item = list[index]
        item.category = detail.category
        item.description = detail.description
        result.push(item)
      })
      await saveRawJson(result)
      RETRY_TIME = 0
    } catch (err) {
      console.log(err)
      RETRY_TIME -= 1
    }
  }
  process.exit(0)
}

bootstrap()