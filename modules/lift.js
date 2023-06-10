const { JSDOM } = await import('jsdom')
const { log } = await import('./logger.js')
const { rootURL, shortcutLinks, getPageUpperBarTitle } = await import('./misc.js')
const { getMoney } = await import('./money.js')
const { goHome } = await import('./home.js')
log('info', '[Lift] Module ready!'.green)

/**
 * Go to the lift.
 */
export async function goLift(page) {
    log('info', '[Lift] Going to the lift page...'.yellow)
    await page.goto(shortcutLinks.lift)
}
export async function doLift(page) {
    await goLift(page)
    const beforeMoney = await getMoney(page)
    const html = await page.content()
    const dom = new JSDOM(html)
    const liftText = [...dom.window.document.getElementsByClassName('ttl')][0].textContent
    console.log(liftText)
    const peopleWaitingForLift = parseInt(/(?<=Лифт \()\d*/gm.exec(liftText)[0])
    if (peopleWaitingForLift === 0) {
        log('info', '[Lift] Finished since there are no people waiting for the lift!'.yellow.bold)
        await goHome(page)
        return
    }
    await liftLoop(page)
    const afterMoney = await getMoney(page)
    log('info', `[Lift] Finished lift!`.green)
    log('info', `[Lift] Money earnt: ${parseInt(`${afterMoney.coins - beforeMoney.coins}`).toLocaleString().yellow} coins and ${parseInt(`${afterMoney.bucks - beforeMoney.bucks}`).toLocaleString().green} bucks!`)
    log('info', `  · Before:`)
    log('info', `    - Coins: ${beforeMoney.formatted.coins}`)
    log('info', `    - Bucks: ${beforeMoney.formatted.bucks}`)
    log('info', `  · After:`)
    log('info', `    - Coins: ${afterMoney.formatted.coins}`)
    log('info', `    - Bucks: ${afterMoney.formatted.bucks}`)
}
export async function liftLoop(page) {
    let html = await page.content()
    let dom = new JSDOM(html)

    let tduList = [...dom.window.document.getElementsByClassName('tdu')]
    const raiseLiftElement = tduList.filter(element => element.textContent.includes('Поднять лифт на'))[0]
    const requiredFloor = parseInt(/(?<=Поднять лифт на )\d*/gm.exec(raiseLiftElement.textContent)[0])

    log('info', `[Lift] Raising the lift to floor ${requiredFloor}...`.yellow)
    await page.goto(`${rootURL}/${raiseLiftElement.getAttribute('href')}`)
    html = await page.content()
    dom = new JSDOM(html)
    tduList = [...dom.window.document.getElementsByClassName('tdu')]
    const collectMoneyElement = tduList.filter(element => element.textContent.includes('Получить'))[0]

    const rewardAmount = dom.window.document.getElementsByClassName('nwr amount')[0].textContent.replace(/\'/g, '')

    await page.goto(`${rootURL}/${collectMoneyElement.getAttribute('href')}`)
    if (rewardAmount == '1') log('info', `[Lift] Collected ${rewardAmount.green} bucks!`)
    else log('info', `[Lift] Collected ${rewardAmount.yellow} coins!`)

    html = await page.content()
    dom = new JSDOM(html)
    let liftText = getPageUpperBarTitle(html)
    if (page.url().includes(`${rootURL}/home`) || liftText.includes('Главная')) return
    let peopleWaitingForLift = parseInt(/(?<=Лифт \()\d*/gm.exec(liftText)[0])
    if (peopleWaitingForLift === 0) {
        log('info', '[Lift] No people waiting for lift!'.yellow.bold)
        await goHome(page)
        return
    }
    await liftLoop(page)
}