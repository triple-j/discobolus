import { sayHello } from "./greet";
import { highlightNewSeries } from "./highlight-new-series";

console.log(sayHello("TypeScript"));

declare global {
    interface Window { highlightNewSeries: any; }
}

window.highlightNewSeries = highlightNewSeries;
