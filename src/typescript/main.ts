import { sayHello } from "./greet"
import { highlightNewSeries } from "./highlight-new-series"
import { initialize as highlightNewSeriesInit } from "./highlight-new-series"
import { Cookie } from "./cookie"

console.log(sayHello("TypeScript"))
highlightNewSeriesInit()

declare global {
    interface Window {
        highlightNewSeries: any
        Cookie: any
    }
}

window.highlightNewSeries = highlightNewSeries
window.Cookie = Cookie
