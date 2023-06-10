const { log } = await import('./logger.js')
const { shortcutLinks } = await import('./misc.js')
const { credentials } = (await import('../config.js')).default
log('info', '[Login] Module ready!'.green)
/**
* Log in into the account.
* @param {import('puppeteer').Page} page The browser page
*/
export async function login(page) {
   log('info', `[Login] Going to ${shortcutLinks.login}...`.yellow)
   await page.goto(shortcutLinks.login)
   log('info', '[Login] Entering username...'.yellow)
   await page.type('#id1 > label:nth-child(2) > input[type=text]', credentials.username)
   log('info', '[Login] Entering password...'.yellow)
   await page.type('#id1 > label:nth-child(4) > input[type=password]', credentials.password)
   log('info', '[Login] Logging in...'.yellow)
   await page.click('#id2')
   log('info', '[Login] Done!'.green)
}
