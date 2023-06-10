const { JSDOM } = await import('jsdom')
const { exit } = process
const { log } = await import('./logger.js')
log('info', '[Misc] Module ready!'.green)
export const rootURL = 'https://nebo.mobi'
export const shortcutLinks = {
    collectMoney: `${rootURL}/floors/0/5`,
    unpackProducts: `${rootURL}/floors/0/3`,
    buyProducts: `${rootURL}/floors/0/2`,
    ongoingProductsDeliveries: `${rootURL}/floors/0/1`,
    doors: `${rootURL}/doors`,
    login: `${rootURL}/login`,
    lift: `${rootURL}/lift`,
    home: `${rootURL}/home`
}
/** @param {string} html */
export function getPageUpperBarTitle(html) {
    const dom = new JSDOM(html)
    return [...dom.window.document.getElementsByClassName('ttl')][0].textContent
}
/**
 * Finish and gracefully exit.
 */
export async function finish() {
    log('info', '[Misc] Stopping the bot...'.red)
    exit(0)
}