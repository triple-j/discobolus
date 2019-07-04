import { h, Component } from 'preact';


interface ClockState {
    time: number
}

export class Clock extends Component {
    state: ClockState
    timer: number

    constructor() {
        super();
        // set initial time:
        this.state.time = Date.now();
    }

    componentDidMount() {
        // update time every second
        this.timer = setInterval(() => {
            this.setState({ time: Date.now() });
        }, 1000);
    }

    componentWillUnmount() {
        // stop when not renderable
        clearInterval(this.timer);
    }

    render(props: any, state: ClockState) {
        let time = new Date(state.time).toLocaleTimeString();
        return <span>{ time }</span>;
    }
}