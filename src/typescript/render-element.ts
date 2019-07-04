import { render } from 'preact'

export function renderElement( vnode: any ): HTMLElement {
    let fragment = document.createElement("div");
    render(vnode, fragment)
    return <HTMLElement>fragment.children[0]
}