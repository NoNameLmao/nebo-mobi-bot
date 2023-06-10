const { log } = await import('./logger.js')
const { JSDOM } = await import('jsdom')
const { getMoney } = await import('./money.js')
const { getPageUpperBarTitle, shortcutLinks, rootURL } = await import('./misc.js')
log('info', '[Buy] Module ready!'.green)

/**
 * Buy products for all floors.
 * @param {import('puppeteer').Page} page
 * */
export async function doBuy(page) {
    log('info', '[Buy] Starting to buy...'.yellow)
    const beforeMoney = await getMoney(page)
    await buyLoop(page)
    const afterMoney = await getMoney(page)
    log('info', `[Buy] Finished buying.`)
    log('info', `[Buy] Coins spent: ${parseInt(`${afterMoney.coins - beforeMoney.coins}`).toLocaleString().red}`)
    log('info', `  · Before:`)
    log('info', `    - Coins: ${beforeMoney.formatted.coins}`)
    log('info', `  · After:`)
    log('info', `    - Coins: ${afterMoney.formatted.coins}`)
}
/** @param {import('puppeteer').Page} page */
export async function buyLoop(page) {
    await page.goto(shortcutLinks.buyProducts)
    log('info', '[Buy] Getting html content...'.yellow)
    let html = await page.content()
    let dom = new JSDOM(html)
    if (getPageUpperBarTitle(html).includes('Главная')) {
        log('info', '[Buy] Finished since there is nothing left to buy!'.yellow.bold)
        return
    }
    if (!getPageUpperBarTitle(html).includes('Этажи')) {
        log('error', '[Buy] Wrong page! Going back!'.red)
        await page.goto(shortcutLinks.buyProducts)
        html = await page.content()
        dom = new JSDOM(html)
    }
    log('info', '[Buy] Picking floor...'.yellow)
    const buyFloorElement = [...dom.window.document.getElementsByTagName('li')][0]
    let buyFloorElementDestructured
    try {
        log('info', '[Buy] Destructuring it\'s html...'.yellow)
        buyFloorElementDestructured = buyFloorElement.childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes
    } catch (error) {
        log('error', `[Buy] Error during destructuring html!`)
        console.log(dom.window.document.body)
        console.error(error)
        process.exit(1)
    }
    log('info', '[Buy] Getting full name...'.yellow)
    const buyFloorFullName = buyFloorElement.childNodes[1].childNodes[1].childNodes[1].textContent
    log('info', '[Buy] Getting number...'.yellow)
    const buyFloorNumber = parseInt(/\d*/.exec(buyFloorFullName)[0])
    log('info', '[Buy] Finding it\'s buy button...'.yellow)
    const buyFloorButton = buyFloorElementDestructured[5]
    log('info', '[Buy] Clicking the button...'.yellow)
    await page.goto(`${rootURL}/${buyFloorButton.getAttribute('href')}`)

    log('info', '[Buy] Getting html content again...'.yellow)
    html = await page.content()
    dom = new JSDOM(html)
    log('info', '[Buy] Getting floor product list...'.yellow)
    const buyFloorProductList = [...dom.window.document.getElementsByTagName('li')].filter((_, index) => index < 3)
    for (const buyFloorProduct of buyFloorProductList) {
        if (typeof buyFloorProduct.childNodes[3].childNodes[8].childNodes[4] === 'undefined') continue
        const buyFloorProductPrice = parseInt(buyFloorProduct.childNodes[3].childNodes[8].childNodes[4].childNodes[2].textContent.replace(/\'/g, '')).toLocaleString()
        const buyFloorProductButton = buyFloorProduct.childNodes[3].childNodes[8].childNodes[4]
        await page.goto(`${rootURL}/${buyFloorProductButton.getAttribute('href')}`)
        log('info', `[Buy] Bought a product at floor ${buyFloorNumber.toString().underline} for ${buyFloorProductPrice.yellow.underline} coins`)
        break
    }
    await buyLoop(page)
}
