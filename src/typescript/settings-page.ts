export class SettingsPage {
    settingsPageElm: HTMLElement
    originalPageElm: HTMLElement
    settingsItem: HTMLElement

    constructor() {
        if ( location.pathname.startsWith("/account") ) {
            this.addLink()

            this.settingsPageElm = this.buildPage()
            this.originalPageElm = document.querySelector(".content-wrapper .rightcol")

            this.originalPageElm.classList.add("original-account-page")

            this.originalPageElm.insertAdjacentElement('afterend',this.settingsPageElm)

            window.addEventListener('hashchange', () => {
                if ( location.hash == "#userscript-settings" ) {
                    this.show()
                } else if ( location.hash == "" ) {
                    this.show(false)
                }
            })
        }
    }

    show( showPage = true ) {
        if ( this.settingsPageElm && this.originalPageElm ) {
            if ( showPage == true ) {
                this.settingsPageElm.classList.remove("hidden")
                this.originalPageElm.classList.add("hidden")

                this.settingsItem.parentElement.querySelector(".active").classList.remove("active")
                this.settingsItem.classList.add("active")
            } else {
                this.settingsPageElm.classList.add("hidden")
                this.originalPageElm.classList.remove("hidden")

                this.settingsItem.parentElement.querySelector(`a[href='${location.pathname}']`).parentElement.classList.add("active")
                this.settingsItem.classList.remove("active")
            }
        }
    }

    private addLink() {
        let logoffLink = document.querySelector(".sidemenu .navmenu a[href='/account/logoff']")

        if ( logoffLink && !this.settingsItem ) {
            let separator = document.createElement("li")
            separator.classList.add("separator")

            this.settingsItem = document.createElement("li")
            this.settingsItem.classList.add("userscript-settings-link")

            let settingsLink = document.createElement("a")
            settingsLink.setAttribute("href", "#userscript-settings")
            settingsLink.innerHTML = "Userscript Settings"
            this.settingsItem.appendChild(settingsLink)

            logoffLink.parentElement.insertAdjacentElement("beforebegin", this.settingsItem)
            this.settingsItem.insertAdjacentElement("afterend", separator)
        }
    }

    private buildPage(): HTMLElement {
        let root = document.createElement("div")
        root.classList.add("rightcol")
        root.classList.add("userscript-settings-page")
        root.classList.add("hidden")

        let title = document.createElement("h2")
        title.innerHTML = "Userscript Settings Page"
        root.appendChild(title)

        let body = document.createElement("div")
        body.classList.add("section")
        root.appendChild(body)

        let subSection = document.createElement("div")
        subSection.classList.add("subsection")
        let subSectionTitle = document.createElement("h4")
        subSection.appendChild(subSectionTitle)
        let subSectionHRule = document.createElement("div")
        subSectionHRule.classList.add("rule")
        subSectionHRule.classList.add("compact")
        subSection.appendChild(subSectionHRule)

        let testSection = <HTMLElement>subSection.cloneNode(true)
        testSection.querySelector("h4").innerHTML = "Testing"
        testSection.insertAdjacentText("beforeend", "This is only a test")
        body.appendChild(testSection)

        return root
    }
}