export function highlightNewIssues() {
    // TODO: apply to `TextView` as well

    document.querySelectorAll("ul.thumblist").forEach((thumbList) => {
        thumbList.classList.add("highlight-new-issues")
    })

    document.querySelectorAll("ul.thumblist li").forEach(function (item) {
        let comicTitle = item.querySelector(".detail h5").textContent
        let comicTitleWords = comicTitle.split(" ")
        let issueNumbers = comicTitleWords.filter((word) => {
            //return word.startsWith("#0") || word.startsWith("#1")
            if (word === "#0" || word === "#1") {
                return true
            } else if (word.startsWith("#0") || word.startsWith("#1")) {
                return /\D/.test(word[2])
            } else {
                return false
            }
        })

        if (issueNumbers.length >= 1) {
            console.debug(issueNumbers)
            console.log("Found new comic: " + comicTitle)
            item.classList.add("new-issue")
        } else {
            console.warn("Hide existing series: " + comicTitle)
            item.classList.add("existing-series")
        }
    })
}