const { shortcutLinks } = await import('./misc.js')
const { log } = await import('./logger.js')
log('info', `[Home] Module ready!`.green)

/**
 * Go to the home page.
 * @param {import('puppeteer').Page} page The browser page
 */
export async function goHome(page) {
    log('info', '[Home] Going to the home page...'.yellow)
    await page.goto(shortcutLinks.home)
}