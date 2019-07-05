export function getPageDom( resource: string|Request ): Promise<Document> {
    let init: RequestInit = {
        credentials: "same-origin"
    }

    return fetch( resource, init )
        .then(( response ) => {
            if ( !response.ok ) {
                throw new Error(`HTTP error, status = ${response.status}`)
            }

            return response.text()
        })
        .then(( responseText ) => {
            let responseDom = (new DOMParser()).parseFromString(responseText, "text/html")

            return responseDom
        })
}

export function isInViewport( elem: HTMLElement ): boolean {
    // thanks {@link https://gomakethings.com/how-to-test-if-an-element-is-in-the-viewport-with-vanilla-javascript/}
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
}
