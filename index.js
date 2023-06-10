const { log } = await import('./modules/logger.js')
await import('colors')
log('info', 'Starting...'.yellow)

const importPackagesTime = new Date()
const puppeteer = (await import('puppeteer')).default
log('info', 'Imported puppeteer'.green)
const { JSDOM } = await import('jsdom')
log('info', 'Imported JSDOM'.green)
log('info', `Finished importing packages in ${new Date() - importPackagesTime}ms.`.green)

await import('dotenv/config')
log('info', 'Imported credentials from .env')

log('info', 'Imporing bot modules...'.yellow)
const importModulesTime = new Date()
const { doBuy } = await import('./modules/buy.js')
const { doDoors } = await import('./modules/doors.js')
const { login } = await import('./modules/login.js')
const { getMoney } = await import('./modules/money.js')
const { rootURL, shortcutLinks, getPageUpperBarTitle, finish } = await import('./modules/misc.js')
const { headless } = (await import('./config.js')).default
const { doLift } = await import('./modules/lift.js')
log('info', `Finished importing bot modules! Took ${new Date() - importModulesTime}ms.`.green)

log('info', 'Starting the browser...'.yellow)
const browser = await puppeteer.launch({ headless: headless })
log('info', 'Using the already opened tab...'.yellow)
const page = (await browser.pages())[0]
log('info', `Going to ${rootURL}...`.yellow)

await page.goto(rootURL)
await login(page)
await doStuff()
await finish()

async function doStuff() {
    await doTodo()
    await doDoors(page)
    await doCollectQuests()
    await doLift(page)
}

async function getTodo() {
    const html = await page.content()
    const dom = new JSDOM(html)
    const todoActionElement = [...dom.window.document.getElementsByClassName('tdn')].filter(element => {
        !element.innerHTML.includes('tb_lift.png')
    })[0]
}
async function doTodo() {
    await doCollectMoney()
    await doUnpack()
    await doBuy(page)
}
async function doUnpack() {
    log('info', '[doUnpack()] Starting to unpack...'.yellow)
    await page.goto(shortcutLinks.unpackProducts)
    await unpackLoop()
}
async function unpackLoop() {
    const html = await page.content()
    const dom = new JSDOM(html)
    if (getPageUpperBarTitle(html).includes('Главная')) {
        log('info', '[unpackLoop()] Finished since there is nothing left to unpack!'.yellow.bold)
        return
    }
    const unpackFloorElement = [...dom.window.document.getElementsByTagName('li')][0]
    let unpackFloorElementDestructured
    try {
        unpackFloorElementDestructured = [...[...[...[...unpackFloorElement.childNodes][1].childNodes][3].childNodes][3].childNodes][1].childNodes
    } catch (error) {
        log('error', '[unpackLoop()] Error destructuring unpack floor element!')
        console.log(dom.window.document.body)
        console.error(error)
        process.exit(1)
    }
    const unpackFloorFullName = [...[...[...unpackFloorElement.childNodes][1].childNodes][1].childNodes][1].textContent
    const unpackFloorNumber = parseInt(/\d*/.exec(unpackFloorFullName)[0])
    const unpackFloorButton = unpackFloorElementDestructured[5]
    await page.goto(`${rootURL}/${unpackFloorButton.getAttribute('href')}`)
    log('info', `[unpackLoop()] Unpacked product at floor ${unpackFloorNumber}`.green)
    await unpackLoop()
}

async function doCollectMoney() {
    log('info', '[doCollectMoney()] Starting to collect money...'.yellow)
    await page.goto(shortcutLinks.collectMoney)
    await collectMoneyLoop()
}
async function collectMoneyLoop() {
    let html = await page.content()
    let dom = new JSDOM(html)
    if (getPageUpperBarTitle(html).includes('Главная')) {
        log('info', '[collectMoneyLoop()] Finished since there is nothing left to collect!'.yellow.bold)
        return
    }
    const collectMoneyFloorElement = [...dom.window.document.getElementsByTagName('li')][0]
    const collectMoneyFloorElementDestructured = [...[...[...[...collectMoneyFloorElement.childNodes][1].childNodes][3].childNodes][3].childNodes][1].childNodes
    const earnedCoins = parseInt(collectMoneyFloorElementDestructured[1].textContent.replace(/\'/g, ''))
    const collectMoneyButton = collectMoneyFloorElementDestructured[7]
    await page.goto(`${rootURL}/${collectMoneyButton.getAttribute('href')}`)
    log('info', `[collectMoneyLoop()] Collected ${earnedCoins.toLocaleString().yellow} coins!`)
    await collectMoneyLoop()
}
async function doCollectQuests() {
    await page.goto(`${rootURL}/quests`)
    await collectQuestLoop()
}
async function collectQuestLoop() {
    const html = await page.content()
    const dom = new JSDOM(html)
    
    const completedQuestsCollectButtonArray = [...dom.window.document.getElementsByClassName('btng btn60')]
    if (completedQuestsCollectButtonArray.length > 0) {
        await page.goto(`${rootURL}/${completedQuestsCollectButtonArray[0].getAttribute('href')}`)
        await collectQuestLoop()
    } else {
        log('info', `[collectQuestLoop()] Finished because there are no more quests to collect the rewards from!`.yellow.bold)
        return
    }
}
