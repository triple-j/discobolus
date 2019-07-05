import { sayHello } from "./greet"
import { highlightNewSeries } from "./highlight-new-series"
import { initialize as highlightNewSeriesInit } from "./highlight-new-series"
import { Cookie } from "./cookie"
import { OrderHistoryStatus } from "./order-history-status"
import { SettingsPage } from "./settings-page"


console.log(sayHello("TypeScript"))
highlightNewSeriesInit()
let orderHistoryStatus = new OrderHistoryStatus()
let settingsPage = new SettingsPage()

/* -------------------------------------------------------------------------- */

declare global {
    interface Window {
        discobolus: any
    }
}

window.discobolus = {}
window.discobolus.highlightNewSeries = highlightNewSeries
window.discobolus.Cookie = Cookie
window.discobolus.orderHistoryStatus = orderHistoryStatus
window.discobolus.settingsPage = settingsPage