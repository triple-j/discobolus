import { Cookie } from "./cookie";

const COOKIE_NAME = "HighlightNewSeries"

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget
}

export class HighlightNewSeries {
    get enabled(): boolean {
        return Cookie.get(COOKIE_NAME) == "yes"
    }

    set enabled(enable: boolean) {
        let value = enable ? "yes" : "no"
        Cookie.set(COOKIE_NAME, value, {path: "/"})
    }

    constructor() {
        let controlStripElm = document.querySelector(".controlstrip")
        let isProductPage = Boolean(controlStripElm)
        let isEnabled = this.enabled

        // This binding is necessary to make `this` work in the callback
        this.settingChanged = this.settingChanged.bind(this)

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
        }

        if ( isProductPage && isEnabled ) {
            this.highlightNewSeries()
        }
    }

    settingChanged(event: HTMLInputEvent) {
        if (event.target.checked) {
            console.log('checked')
            this.enabled = true
            this.highlightNewSeries()
        } else {
            console.log('not checked')
            this.enabled = false

            document.querySelectorAll("ul.thumblist").forEach((thumbList) => {
                thumbList.classList.remove("highlight-new-series")
            })
        }
    }

    highlightNewSeries() {
        // TODO: apply to `TextView` as well

        document.querySelectorAll("ul.thumblist").forEach((thumbList) => {
            thumbList.classList.add("highlight-new-series")
        })

        document.querySelectorAll("ul.thumblist li").forEach(function (item) {
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
}