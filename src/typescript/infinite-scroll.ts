import { debounce, getPageDom, isInViewport } from "./helpers"

interface PageHrefs {
    [key: number]: string
}

export class InfiniteScroll {
    enabled: boolean = true
    currentPage: number = 1
    pageHrefs: PageHrefs = {}
    thumbList: HTMLElement
    loadingElm: HTMLElement
    debounceQueryMoreItems: Function

    constructor() {
        this.thumbList = document.querySelector(".thumblist")
        let pager = document.querySelector(".pager")
        let isOnValidPage = Boolean(
            this.thumbList
            && pager
            && (pager.querySelector(".page.current") || {textContent:undefined}).textContent === "1"
        )

        this.debounceQueryMoreItems = debounce(this.queryMoreItems.bind(this), 250)

        if ( this.enabled && isOnValidPage ) {
            document.querySelector(".discobolus").classList.add("infinite-scroll")

            let pagePath = location.pathname
            let lastPageElm = Array.from(pager.querySelectorAll(".page a")).pop()
            if ( lastPageElm ) {
                let lastPage = parseInt(lastPageElm.textContent)
                for ( let idx = 2; idx <= lastPage; idx++ ) {
                    this.pageHrefs[idx] = `${pagePath}/${idx}`
                }
            }

            this.loadingElm = document.createElement("div")
            this.loadingElm.classList.add("infinite-scroll-loading")
            this.thumbList.insertAdjacentElement("afterend", this.loadingElm)

            this.queryMoreItems()
            window.addEventListener('scroll', (event) => {
                //console.debug("Trigger check for more items.")
                this.debounceQueryMoreItems()
            })
            // incase the loading element becomes visible do to other features (eg. Highlight New Series)
            let observer = new MutationObserver((mutationsList, observer) => {
                console.debug("mutation event", mutationsList, observer)
                this.debounceQueryMoreItems()
            })
            observer.observe(this.thumbList, { attributes: true, childList: true, subtree: true })
        }
    }

    hasMorePages(): boolean {
        let nextPage = this.currentPage + 1
        return Boolean(this.pageHrefs[nextPage])
    }

    getNextPage(): Promise<void> {
        if ( !this.hasMorePages() ) {
            return Promise.reject(new Error("No more pages."))
        }

        let nextPage = this.currentPage + 1

        return getPageDom( this.pageHrefs[nextPage] )
            .then(( responseDom ) => {
                let newThumbList = responseDom.querySelector(".thumblist")

                if ( !newThumbList ) {
                    throw new Error("No items found.")
                }

                Array.from(newThumbList.children).forEach(elm => {
                    this.thumbList.appendChild(elm)
                })

                this.currentPage = nextPage
            })
    }

    queryMoreItems() {
        let isLoading = this.loadingElm.classList.contains("active")

        if ( !isLoading && isInViewport(this.loadingElm) && this.hasMorePages() ) {
            this.loadingElm.classList.add("active")
            this.getNextPage()
                .then(() => {
                    this.loadingElm.classList.remove("active")
                })
                .catch((error) => {
                    console.error(error)
                    this.loadingElm.classList.remove("active")
                })
        }
    }
}