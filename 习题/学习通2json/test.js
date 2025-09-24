let html_str = "<div id='div' data-show='0'>wwwwwwwwwww</div>"
var parser = new DOMParser();

let html = parser.parseFromString(html_str, "text/xml").getElementById("div")
// console.log(html);

document.getElementsByTagName("body")[0].appendChild(html)

let div = document.getElementById("div")
div.addEventListener("click", show)
function show(e) {

    console.log(this, this.dataset);
}