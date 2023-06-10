const { JSDOM } = await import('jsdom')
const { log } = await import('./logger.js')
const { rootURL, shortcutLinks } = await import('./misc.js')
log('info', '[Doors] Module ready!'.green)
/**
 * Do doors.
 * @param {import('puppeteer').Page} page The browser page
 */
export async function doDoors(page) {
    await goDoors(page)
    await doorLoop(page)
}
/**
 * A loop function to do the doors.
 * @param {import('puppeteer').Page} page The browser page
 * @returns {Promise<void>}
 */
export async function doorLoop(page) {
    const html = await page.content()
    const dom = new JSDOM(html)
    const door = dom.window.document.getElementsByClassName('door')[0].parentElement
    await page.goto(`${rootURL}/${door.getAttribute('href')}`)
    if ([...dom.window.document.getElementsByClassName('notify')].filter(element => element.tagName === 'SPAN').length > 0) {
        try {
            if ([...dom.window.document.getElementsByClassName('small')][1].childNodes[2].textContent == 0) {
                log('info', `[Doors] Finished because there are no more keys left!`.yellow.bold)
                return
            }
        } catch (error) {
            log('error', `[Doors] Error getting amount of keys left!`.red)
            console.log(await page.evaluate(() => { return window.location.href }))
            console.log(dom.window.document.body.childNodes)
            console.error(error)
            process.exit(1)
        }
        await doDoors(page)
    } else {
        await doorLoop(page)
    }
}
/**
 * Go to the doors.
 * @param {import('puppeteer').Page} page The browser page
 */
export async function goDoors(page) {
    log('info', '[Doors] Going to the doors page...'.yellow)
    await page.goto(shortcutLinks.doors)
}
