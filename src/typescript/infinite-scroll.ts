import { getPageDom, isInViewport } from "./helpers"

interface PageHrefs {
    [key: number]: string
}

export class InfiniteScroll {
    enabled: boolean = true
    currentPage: number = 1
    pageHrefs: PageHrefs = {}
    thumbList: HTMLElement
    loadingElm: HTMLElement

    constructor() {
        this.thumbList = document.querySelector(".thumblist")
        let pager = document.querySelector(".pager")
        let isOnValidPage = Boolean(
            this.thumbList
            && pager
            && pager.querySelector(".page.current").textContent === "1"
        )
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
            let ticking = false;
            window.addEventListener('scroll', (event) => {
                if (!ticking) {
                    // Since scroll events can fire at a high rate, the event
                    // handler shouldn't execute computationally expensive
                    // operations such as DOM modifications. Instead, it is
                    // recommended to throttle the event.
                    window.requestAnimationFrame(() => {
                        //console.debug("Trigger check for more items.")
                        this.queryMoreItems()
                        ticking = false;
                    });

                    ticking = true;
                }
            })
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