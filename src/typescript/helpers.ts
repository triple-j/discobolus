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
    var bounding = elem.getBoundingClientRect()
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// thanks {@link https://davidwalsh.name/javascript-debounce-function}
export function debounce(func: Function, wait: number, immediate?: boolean) {
    var timeout: number
    return function() {
        var context = this, args = arguments
        var later = function() {
            timeout = null
            if (!immediate) func.apply(context, args)
        };
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}
