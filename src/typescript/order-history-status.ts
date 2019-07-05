
interface OrderStatus {
    processing: number
    filled: number
    shipped: number
    cancelled: number
    total: number
}

interface OrderStatusEvent extends OrderStatus {
    link: string
}

export class OrderHistoryStatus {

    constructor() {
        if ( location.pathname === "/account/orders" ) {
            //pass
        }
    }

    getStatus( orderUrl: string ): Promise<OrderStatus> {
        let init: RequestInit = {
            credentials: "same-origin"
        }

        return fetch( orderUrl, init )
            .then(( response ) => {
                if ( !response.ok ) {
                    throw new Error(`HTTP error, status = ${response.status}`)
                }

                return response.text()
            })
            .then(( responseText ) => {
                let responseDom = (new DOMParser()).parseFromString(responseText, "text/html")
                let productRows = Array.from(responseDom.querySelectorAll(".carttable input.cartqty")).map(( elm ) => {
                    while ( elm.parentElement && elm.tagName !== "TR" ) {
                        elm = elm.parentElement
                    }
                    return elm
                })
                let totals = {
                    processing: 0,
                    filled: 0,
                    shipped: 0,
                    cancelled: 0,
                    total: 0,
                }

                productRows.forEach((productRow) => {
                    totals.total++

                    let statusElm = productRow.querySelector(".statusimg")
                    if ( statusElm ) {
                        let statusText = statusElm.getAttribute("title")
                        switch ( statusText.toUpperCase() ) {
                            case "PROCESSING":
                                totals.processing++
                                break
                            case "FILLED":
                                totals.filled++
                                break
                            case "SHIPPED":
                                totals.shipped++
                                break
                            case "CANCELLED":
                                totals.cancelled++
                                break
                        }
                    }
                })

                return totals
            })
    }

    queryOrders() {
        let orderLinks = Array.from(
                document.querySelectorAll("a[href*='/account/order/'")
            ).map(elm => elm.getAttribute("href"))

        orderLinks.forEach(link => {
            this.getStatus(link)
                .then(status => {
                    let eventDetails: OrderStatusEvent = Object.assign({link: link}, status)
                    let statusEvent = new CustomEvent("order-status", {
                        detail: eventDetails
                    })
                    document.dispatchEvent(statusEvent)
                })
        })
    }
}