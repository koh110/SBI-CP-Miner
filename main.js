const puppeteer = require('puppeteer')
const { WebClient } = require('@slack/client')
const { SLACK_TOKEN, SLACK_POST_CHANNEL } = process.env
let slack = null
if (SLACK_TOKEN) {
  slack = new WebClient(SLACK_TOKEN)
}

const main = async () => {
  const browser = await puppeteer.launch({
    headless: true, slowMo: 10,
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.goto('https://site2.sbisec.co.jp/ETGate/', { waitUntil: 'networkidle2' })

  await page.waitForSelector('.sb-box-sub-02-content', { visible: true })
  await page.type('#user_input input', process.env.SBI_ID)
  await page.type('#password_input input', process.env.SBI_PASS)
  await page.click('.sb-position-c input')

  await page.waitForSelector('#link02 img', { visible: true })
  await page.click('#link02 img[alt="取引"]')

  await page.waitForSelector('.md-l-tab-01', { visible: true })
  await page.click('.md-l-tab-01 td:nth-child(6)')

  await page.waitForSelector('.md-l-mainarea-01', { visible: true })
  const elements = await page.$$('img[alt="申込"]')
  for (const el of elements) {
    await el.click({ button: 'middle' })
    await page.waitFor(1000)
  }

  let counter  = 0
  const pages = await browser.pages()
  for (const page of pages) {
    if (page.url().indexOf('/oeapw011?') === -1) {
      continue
    }

    await page.bringToFront()
    await page.waitForSelector('input[name="suryo"]', { visible: true })

    const n = await page.$$eval('td', (elements) => {
      const e = elements.filter(e => e.innerText.includes('（売買単位/')).shift()
      return /（売買単位\/([0-9]+)株）/.test(e.textContent.trim()) && RegExp.$1
    })

    await page.type('input[name="suryo"]', n)

    await page.click('#strPriceRadio')
    await page.type('input[type="password"][name="tr_pass"]', process.env.SBI_ORDER_PASS)
    await page.click('input[type="submit"][name="order_kakunin"]')
    await page.waitFor(1000)

    await page.click('input[name="order_btn"]')
    await page.waitFor(1000)
    counter++
  }

  browser.close()

  if (slack) {
    const res = await slack.chat.postMessage({ channel: SLACK_POST_CHANNEL, text: `done miner: ${counter}件` })
    console.log('post slack:', JSON.stringify(res))
  }
}

if (!process.env.SBI_ID || !process.env.SBI_PASS || !process.env.SBI_ORDER_PASS) {
  console.log('You need to set environment variables: SBI_ID, SBI_PASS, SBI_ORDER_PASS')
  process.exit(1)
}

main().catch((err) => {
  console.error(err)
  if (slack) {
    slack.chat.postMessage({ channel: SLACK_POST_CHANNEL, text: `error miner: ${err}` })
      .then(() => process.exit(1))
      .catch((err) => {
        console.error('failed error post to slack:', err)
        process.exit(1)
      })
  } else {
    process.exit(1)
  }
})
