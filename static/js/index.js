



if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    let root = document.getElementById("root")
    root.addEventListener("click", (e) => {
        if (!e.isTrusted) {
            return
        }
        if (e.target.closest("#nav-box")){
            return 
        }
/*         if (e.target.id == "nav" || e.target.id == "menu" || e.target.parentNode.id == "menu" || e.target.parentNode.parentNode.id == "menu" || e.target.id == "menu_input") {
            return
        } */
        let menu_input = document.getElementById("menu_input")
        let check_state = menu_input.checked
        // console.log(e.target, e.target.id, check_state);
        if (check_state == true) {
            menu.click()
        }
    })
}



// page2
{
    function scroll_text_fun() {
        let book_div = document.getElementById("scroll_text")
        let scroll_text_wrap = document.getElementById("scroll_text_wrap")
        scroll_text_wrap.style.display = "block"
        const obj = [["14年的小主治", "5年本科+3年硕士+3年博士+3年规范化培训+主治考试+论文基金"], ["19年的副主任医师", "5年+几篇SCI论文+省厅级别课题至少2项+考试通过"], ["24年的牛X的主任医师", "5年+国家自然+3分以上SCI论文几篇+考试顺利"], ["0", "患者菜刀"]]
        let l = obj.length
        let count = 0
        for (let i = 0; i <= l; i++) {
            div = document.createElement("div")
            div.className = "div-wrap"
            if (i == 0) {
                add_text(obj[i][1], 100, div, count)
                count = count + obj[i][1].length
                book_div.append(div)
            } else if (i == l) {
                add_text("=0", 100, div, count)
                count = count + "=0".length
                book_div.append(div)
            } else {
                add_text("=" + obj[i - 1][0] + "+" + obj[i][1], 100, div, count)
                count = count + (obj[i - 1][0] + "+" + obj[i][1]).length
                book_div.append(div)
            }
        }
        let flag = Math.random()
        if (flag >= 0.5) {
            setTimeout(() => {
                for (let i = 2; i > -1; i--) {
                    setTimeout(() => {
                        document.getElementsByClassName("div-wrap")[4].innerHTML = document.getElementsByClassName("div-wrap")[4].innerHTML.slice(0, i)
                    }, 117 * 100 + 2500 + (2 - i) * 250);
                }
                for (let i = 17; i > 11; i--) {
                    setTimeout(() => {
                        document.getElementsByClassName("div-wrap")[3].innerHTML = document.getElementsByClassName("div-wrap")[3].innerHTML.slice(0, i)
                    }, 117 * 100 + 3500 + (17 - i) * 250);
                }
            }, 250)
        }

    }

    function add_text(text, time, div, count) {
        for (let i = 0; i <= text.length; i++) {
            let text_a = text.slice(0, i);
            (function (x, count) { setTimeout(function () { count = count + 1; div.innerHTML = x; }, (count + i + 1) * time); })
                (text_a, count);
        }
    }


}
{
    function scroll_text_wrap_fun() {
        let pages = document.getElementById("pages")
        let page_2 = document.getElementsByClassName("page")[1]
        let clientTop = page_2.offsetTop
        let scrollTop = pages.scrollTop
        console.log(clientTop, scrollTop);
        if (clientTop - 20 <= scrollTop <= clientTop + 20) {
            // if (clientTop == scrollTop) {
            scroll_text_fun()
            document.getElementById("pages").removeEventListener("scroll", scroll_text_wrap_fun)
        } else {
        }
    }
}
{
    // document.getElementById("pages").addEventListener("scroll", scroll_text_wrap_fun)


}

{
    
    //alert("域名更换为:南华大学.icu，qq群：532147305")
}

