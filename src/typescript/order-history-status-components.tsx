import { h, render, Component } from 'preact'
import { OrderStatusEvent } from './order-history-status'
import { renderElement } from './render-element'

interface StatusProps {
    href: string
}

interface StatusState {
    processing: number | string
    filled: number | string
    shipped: number | string
    cancelled: number | string
}

class StatusHeader extends Component {
    render() {
        return (
            <th class="order-status righted">Status</th>
        )
    }
}

class Status extends Component<StatusProps, any> {
    state: StatusState

    constructor(props: StatusProps) {
        super(props);

        this.state.processing = "-"
        this.state.filled = "-"
        this.state.shipped = "-"
        this.state.cancelled = "-"

        // This binding is necessary to make `this` work in the callback
        this.handleStatus = this.handleStatus.bind(this)
    }

    handleStatus(event: OrderStatusEvent) {
        if ( event.detail.link == this.props.href ) {
            this.setState({
                processing: event.detail.processing,
                filled: event.detail.filled,
                shipped: event.detail.shipped,
                cancelled: event.detail.cancelled,
            });
        }
    }

    componentDidMount() {
        document.addEventListener("order-status", this.handleStatus)
    }

    componentWillUnmount() {
        document.removeEventListener("order-status", this.handleStatus)
    }

    render(props: StatusProps, state: StatusState) {
        let processingTitle = `Processing: ${state.processing}`
        let filledTitle = `Filled: ${state.filled}`
        let shippedTitle = `Shipped: ${state.shipped}`
        let cancelledTitle = `Cancelled: ${state.cancelled}`

        return (
            <td class="order-status righted">
                <span title={processingTitle}>P:{state.processing}</span>
                <span title={filledTitle}>F:{state.filled}</span>
                <span title={shippedTitle}>S:{state.shipped}</span>
                <span title={cancelledTitle}>C:{state.cancelled}</span>
            </td>
        )
    }
}

interface TotalProps {
    href: string
}

interface TotalState {
    total: number | string
}

class TotalHeader extends Component {
    render() {
        return (
            <th class="order-items righted">Items</th>
        )
    }
}

class Total extends Component<TotalProps, any> {
    state: TotalState

    constructor(props: TotalProps) {
        super(props);

        this.state.total = "-"

        // This binding is necessary to make `this` work in the callback
        this.handleStatus = this.handleStatus.bind(this)
    }

    handleStatus(event: OrderStatusEvent) {
        if ( event.detail.link == this.props.href ) {
            this.setState({
                total: event.detail.total,
            });
        }
    }

    componentDidMount() {
        document.addEventListener("order-status", this.handleStatus)
    }

    componentWillUnmount() {
        document.removeEventListener("order-status", this.handleStatus)
    }

    render(props: TotalProps, state: TotalState) {
        return (
            <td class="order-items righted">
                <span>{state.total}</span>
            </td>
        )
    }
}

export function addToHeaderRow(row: HTMLElement) {
    row.appendChild(renderElement(
        <StatusHeader />
    ))
    row.appendChild(renderElement(
        <TotalHeader />
    ))
}

export function addToRow(row: HTMLElement, href: string) {
    row.appendChild(renderElement(
        <Status href={href} />
    ))
    row.appendChild(renderElement(
        <Total href={href} />
    ))
}