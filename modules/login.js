const { log } = await import('./logger.js')
const { shortcutLinks } = await import('./misc.js')

log('info', '[Login] Module ready!'.green)
/**
* Log in into the account.
* @param {import('puppeteer').Page} page The browser page
*/
export async function login(page) {
   await import('dotenv/config')
   log('info', '[Login] Imported credentials from .env')
   log('info', `[Login] Going to ${shortcutLinks.login}...`.yellow)
   await page.goto(shortcutLinks.login)
   log('info', '[Login] Entering username...'.yellow)
   await page.type('#id1 > label:nth-child(2) > input[type=text]', process.env.USERNAME)
   log('info', '[Login] Entering password...'.yellow)
   await page.type('#id1 > label:nth-child(4) > input[type=password]', process.env.PASSWORD)
   log('info', '[Login] Logging in...'.yellow)
   await page.click('#id2')
   log('info', '[Login] Done!'.green)
}
