const { log } = await import('./logger.js')
const { JSDOM } = await import('jsdom')
await import('colors')
log('info', '[Money] Module ready!'.green)
/**
 * Get the amount of money.
 * @param {import('puppeteer').Page} page The browser page
 * @param {boolean = false} display Output to console
 * @returns {Promise<{ coins: number, bucks: number, formatted: { coins: string, bucks: string, both: string } }>} Object representing amount of coins and bucks
 */
export async function getMoney(page, display = false) {
    const html = await page.content()
    const dom = new JSDOM(html)
    await page.waitForNetworkIdle()
    const nodeList = [...dom.window.document.getElementsByClassName('nwr')]
    const coins = parseInt(nodeList[0].textContent.replace(/\'/g, ''))
    const bucks = parseInt(nodeList[1].textContent.replace(/\'/g, ''))
    const object = {
        coins: coins,
        bucks: bucks,
        formatted: {
            coins: coins.toLocaleString(),
            bucks: bucks.toLocaleString(),
            both: `${coins.toLocaleString().yellow} coins, ${bucks.toLocaleString().green} bucks`
        }
    }
    if (display) log('info', `[Money] ${object.formatted.coins.yellow.underline} money, ${object.formatted.bucks.green.underline} bucks`)
    return object
}
