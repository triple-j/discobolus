import { h, render, Component } from 'preact'
import { Clock } from './Clock'
import { renderElement } from './render-element'

interface SubSectionProps {
    title: string
    children?: any
}

class SubSection extends Component<SubSectionProps, any> {
    render (props: SubSectionProps) {
        return (
            <div class="subsection">
                <h4>{props.title}</h4>
                <div class="rule compact"></div>
                {props.children}
            </div>
        )
    }
}

interface SettingsProps {
    title: string
    element: HTMLElement
}

class Settings extends Component<any, any> {
    render (props: any) {
        return (
            <div class="userscript-settings-app">
                <h2>Userscript Settings</h2>
                <div class="section">
                    <SubSection title="Testing">
                        This is only a test.
                    </SubSection>

                    <SubSection title="Clock">
                        <Clock />
                    </SubSection>
                </div>
            </div>
        )
    }
}



export class SettingsPage {
    settingsPageElm: HTMLElement
    originalPageElm: HTMLElement
    settingsItem: HTMLElement

    constructor() {
        if ( location.pathname.startsWith("/account") ) {
            this.addLink()

            this.settingsPageElm = renderElement(<div class="rightcol userscript-settings-page hidden"></div>)
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

            render(<Settings />, this.settingsPageElm)
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
            let separator = renderElement(
                <li class="separator"></li>
            )

            this.settingsItem = renderElement(
                <li class="userscript-settings-link">
                    <a href="#userscript-settings">Userscript Settings</a>
                </li>
            )

            logoffLink.parentElement.insertAdjacentElement("beforebegin", this.settingsItem)
            this.settingsItem.insertAdjacentElement("afterend", separator)
        }
    }
}