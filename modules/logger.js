import winston from 'winston';
const logger = winston
const { transports: { Console } } = logger

logger.remove(Console)
logger.add(Console, {
    timestamp() { return `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}` },
    colorize: true
})
/**
 * @param {'info' | 'warn' | 'error' | 'debug'} level 
 * @param {string} text
 * @returns {void}
 */
export function log(level, text) {
    logger.log(level, text)
}
