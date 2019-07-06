import { Cookie } from "./cookie"
import { debounce } from "./helpers"

const COOKIE_NAME = "HighlightNewSeries"

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget
}

export class HighlightNewSeries {
    thumbList: HTMLElement
    debounceQueryNewSeries: Function

    get enabled(): boolean {
        return Cookie.get(COOKIE_NAME) == "yes"
    }

    set enabled(enable: boolean) {
        let value = enable ? "yes" : "no"
        Cookie.set(COOKIE_NAME, value, {path: "/"})
    }

    constructor() {
        this.thumbList = document.querySelector(".thumblist")
        let controlStripElm = document.querySelector(".controlstrip")
        let isProductPage = Boolean(controlStripElm)
        let isEnabled = this.enabled

        // This binding is necessary to make `this` work in the callback
        this.settingChanged = this.settingChanged.bind(this)

        this.debounceQueryNewSeries = debounce(this.queryNewSeries.bind(this), 250)

        if ( isProductPage ) {
            // append dom
            let inputName = "highlightnewseries"
            let wrapper = document.createElement("span")
            let checkbox = document.createElement("input")
            let label = document.createElement("label")

            wrapper.classList.add("highlight-new-series-control")

            checkbox.setAttribute("id", inputName)
            checkbox.setAttribute("name", inputName)
            checkbox.setAttribute("type", "checkbox")
            checkbox.setAttribute("value", "yes")
            if ( isEnabled ) {
                checkbox.checked = true
            }
            checkbox.addEventListener("change", this.settingChanged)

            label.setAttribute("for", inputName)
            label.innerHTML = "Show New #1s"

            wrapper.appendChild(label)
            wrapper.appendChild(checkbox)

            controlStripElm.querySelector(".float-right").prepend(wrapper)


            // incase new elements becomes visible due to other features (eg. Infinite Scroll)
            let observer = new MutationObserver((mutationsList, observer) => {
                console.debug("mutation event [hns]", mutationsList, observer)
                this.debounceQueryNewSeries()
            })
            observer.observe(this.thumbList, { attributes: false, childList: true, subtree: true })
        }

        if ( isProductPage && isEnabled ) {
            this.queryNewSeries()
        }
    }

    settingChanged(event: HTMLInputEvent) {
        if (event.target.checked) {
            console.log('checked')
            this.enabled = true
            this.queryNewSeries()
        } else {
            console.log('not checked')
            this.enabled = false

            this.thumbList.classList.remove("highlight-new-series")
        }
    }

    highlightNewSeries() {
        // TODO: apply to `TextView` as well

        this.thumbList.classList.add("highlight-new-series")

        this.thumbList.querySelectorAll("li:not(.new-series):not(.existing-series)").forEach((item) => {
            let comicTitle = item.querySelector(".detail h5").textContent
            let comicTitleWords = comicTitle.split(" ")
            let issueNumbers = comicTitleWords.filter((word) => {
                //return word.startsWith("#0") || word.startsWith("#1")
                if (word === "#0" || word === "#1") {
                    return true
                } else if (word.startsWith("#0") || word.startsWith("#1")) {
                    return /\D/.test(word[2])
                } else {
                    return false
                }
            })

            if (issueNumbers.length >= 1) {
                console.debug(issueNumbers)
                console.log("Found new comic: " + comicTitle)
                item.classList.add("new-series")
            } else {
                console.warn("Hide existing series: " + comicTitle)
                item.classList.add("existing-series")
            }
        })
    }

    queryNewSeries() {
        if ( this.enabled ) {
            let requiresUpdate = Boolean(
                this.thumbList.querySelectorAll("li:not(.new-series):not(.existing-series)").length > 0
            )

            this.highlightNewSeries()
        }
    }
}