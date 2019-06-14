//.thumblist .detail h5

//ul.thumblist li
//document.querySelectorAll("ul.thumblist li").forEach(console.log.bind(console))
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
    } else {
        console.warn("Hide existing series: " + comicTitle)
        item.style.display = "none"
    }
})