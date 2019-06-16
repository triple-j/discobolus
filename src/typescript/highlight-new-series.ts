import { Cookie } from "./cookie";

const COOKIE_NAME = "HighlightNewSeries"

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget
}

function settingChanged(event: HTMLInputEvent) {
    if (event.target.checked) {
        console.log('checked')
        Cookie.set(COOKIE_NAME, "yes", {path: "/"})
        highlightNewSeries()
    } else {
        console.log('not checked')
        Cookie.set(COOKIE_NAME, "no", {path: "/"})

        document.querySelectorAll("ul.thumblist").forEach((thumbList) => {
            thumbList.classList.remove("highlight-new-series")
        })
    }
}

export function highlightNewSeries() {
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

export function initialize() {
    let controlStripElm = document.querySelector(".controlstrip")
    let isProductPage = Boolean(controlStripElm)
    let isEnabled = Cookie.get(COOKIE_NAME) == "yes"

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
        checkbox.addEventListener("change", settingChanged)

        label.setAttribute("for", inputName)
        label.innerHTML = "Show New #1s"

        wrapper.appendChild(label)
        wrapper.appendChild(checkbox)

        controlStripElm.querySelector(".float-right").prepend(wrapper)
    }

    if ( isProductPage && isEnabled ) {
        highlightNewSeries()
    }
}