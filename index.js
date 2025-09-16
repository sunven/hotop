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

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.69',
  Cookie: 'SUB=_2AkMflEwGf8NxqwFRmvsXxG7ia4h2wwrEieKpyL3dJRM3HRl-yT9yqk4mtRB6NBRi6maz6YaTyfIClrCyCUrm0-7nB1R9; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WhR9EPgz3BDPWy-YHwFuiIb; MLOGIN=0; _T_WM=32026405228; WEIBOCN_FROM=1110006030; XSRF-TOKEN=4f0061; mweibo_short_token=7c696d3a05; M_WEIBOCN_PARAMS=luicode%3D10000011%26lfid%3D106003type%253D25%2526t%253D3%2526disable_hot%253D1%2526filter_type%253Drealtimehot%26fid%3D106003type%253D25%2526t%253D3%2526disable_hot%253D1%2526filter_type%253Drealtimehot%26uicode%3D10000011',
}

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
    const res = await fetch(TRENDING_DETAIL_URL + title, { headers })
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
      const res = await fetch(TRENDING_URL, {
        headers,
      }).then(res => res.json())
      const list = res.data.cards[0].card_group
        .filter((k) => !k.pic.includes('img_search_stick') && k.desc && !k.actionlog?.ext.includes("ads_word"))
        .map((k) => {
          return {
            title: k.desc,
            icon: k.icon,
            scheme: k.scheme,
          }
        })
      // const detailList = await Promise.all(list.map(c => fetchTrendingDetail(c.desc)))
      const result = list
      // detailList.forEach((detail, index) => {
      //   const item = list[index]
      //   item.category = detail.category
      //   item.description = detail.description
      //   result.push(item)
      // })
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