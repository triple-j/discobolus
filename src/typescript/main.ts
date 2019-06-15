import { sayHello } from "./greet";
import { highlightNewIssues } from "./highlight-new-issues";

console.log(sayHello("TypeScript"));

declare global {
    interface Window { highlightNewIssues: any; }
}

window.highlightNewIssues = highlightNewIssues;
