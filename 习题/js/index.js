window.onbeforeunload = function (e) {
    // localStorage.clear()
}

g_file = './json/'
g_fast_search_saved = {
    "school_year": 0,
    "term": 2
}
g_course_info = "./static/json/课程信息.json"
get_path()

let search_input = document.getElementById("search_input")
var url = location.search
if (url.match(/\?name=.*&path=.*$/)) {
    // 作业/题目
    let container_find_debounce = debounce(container_find, 200)
    // search_input.addEventListener("change", container_find_debounce)
    search_input.addEventListener("input", container_find_debounce)

} else {
    // 课程
    let bookshelf_find_debounce = debounce(bookshelf_find, 200)
    // search_input.addEventListener("change", bookshelf_find_debounce)
    search_input.addEventListener("input", bookshelf_find_debounce)
    let fast_search = document.getElementById("fast_search")
    fast_search.style.display = "flex"
    fast_search.addEventListener("click", fast_search_fun)
}

function unfind() {
    document.getElementById("search_input").value = ""
    if (url.match(/\?name=.*&path=.*$/)) {
        let container = document.getElementById("container")
        let a_div = container.getElementsByClassName("a_div")
        for (let i = 0; i < a_div.length; i++) {
            let a_div_each = a_div[i]
            a_div_each.style.display = "block"
        }
    } else {
        let bookshelf = document.getElementById("bookshelf")
        let book_div = bookshelf.getElementsByClassName("book_div")
        for (let i = 0; i < book_div.length; i++) {
            let book_div_each = book_div[i]
            book_div_each.style.display = "block"
        }
    }

}

function startAnimation() {
    document.querySelector('body').style.animationPlayState = ''
    // console.log('动画开始');
}

function stopAnimation() {
    document.querySelector('body').style.animationPlayState = 'paused'
    // console.log('动画停止');
}

// 监听visibilitychange事件
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        startAnimation();
    } else {
        stopAnimation();
    }
});


function bookshelf_find() {
    let match_num = 0
    let search_input = document.getElementById("search_input")
    let search_value = search_input.value
    let bookshelf = document.getElementById("bookshelf")
    let book_simplify_name = bookshelf.getElementsByClassName("book_simplify_name")
    if (search_value == "") {
        for (let i = 0; i < book_simplify_name.length; i++) {
            let book_simplify_name_each = book_simplify_name[i]
            book_simplify_name_each.parentNode.style.display = "block"
        }
        return
    }
    for (let i = 0; i < book_simplify_name.length; i++) {
        let book_simplify_name_each = book_simplify_name[i]
        // console.log(book_each.innerText, search_value);
        // 1.字符匹配率（正向，反向）
        let match_raw_rate = strSimilarity2Percent([book_simplify_name_each.innerText, search_value], [0, 0])
        let match_processed_rate = strSimilarity2Percent([book_simplify_name_each.innerText.replace(/大.[上下中末始] /, ""), search_value], [0, 0])
        // 2.正则表达式原始字符匹配（正向，反向）
        let reg_raw_forward = book_simplify_name_each.innerText.match(search_value)
        let reg_raw_back = search_value.match(book_simplify_name_each.innerText)
        // 2.正则表达式删减字符匹配（正向，反向）
        let reg_processed_forward = book_simplify_name_each.innerText.replace(/大.[上下中末始] /, "").match(search_value)
        let reg_processed_back = search_value.match(book_simplify_name_each.innerText.replace(/大.[上下中末始] /, ""))
        /*      match() 方法将字符串与正则表达式进行匹配。
                提示：如果搜索值为字符串，则转换为正则表达式。
                match() 方法返回包含匹配项的数组。
                如果未找到匹配项，则 match() 方法返回 null。 */

        // console.log(match_raw_rate, match_processed_rate, reg_raw_forward, reg_raw_back, reg_processed_forward, reg_processed_back)
        if (match_raw_rate >= 0.5 || match_processed_rate > 0.5 || reg_raw_forward != null || reg_raw_back != null || reg_processed_forward != null || reg_processed_back != null) {
            match_num += 1
            book_simplify_name_each.parentNode.style.display = "block"

        } else {
            book_simplify_name_each.parentNode.style.display = "none"
        }
    }
    if (match_num == 0) {

        for (let i = 0; i < book_simplify_name.length; i++) {
            let book_simplify_name_each = book_simplify_name[i]
            book_simplify_name_each.parentNode.style.display = "block"
        }
    }
}

function fast_search_fun(e) {
    if (!e.target.classList.contains("fast_search_wrap_item")) {
        return
    }

    let school_year, term

    // console.log(children_index);

    if (e.target.parentNode.id == "school_year_wrap") {
        // 0为全部 1-5为

        school_year = children_index_fun(e.target.parentNode, e.target)
        term = g_fast_search_saved["term"]
        fast_search_display_fun("school_year_wrap", school_year, g_fast_search_saved["school_year"])
        g_fast_search_saved["school_year"] = school_year
    } else if (e.target.parentNode.id == "term_wrap") {
        // 2为全部 0-1为

        school_year = g_fast_search_saved["school_year"]
        term = children_index_fun(e.target.parentNode, e.target)
        fast_search_display_fun("term_wrap", term, g_fast_search_saved["term"])
        g_fast_search_saved["term"] = term
    }

    let search_input = document.getElementById("search_input")
    search_input.value = ["", "大一", "大二", "大三", "大四", "大五"][school_year] + ["上", "下", ""][term]
    bookshelf_find()
}

function children_index_fun(parent, child) {
    /*     var parent = document.getElementById('parent');
        var child = document.getElementById('child'); */
    // console.log(parent, child);
    var children = parent.children;
    for (var i = 0; i < children.length; i++) {
        if (children[i] === child) {
            return i
            break;
            console.log('子元素是父元素的第 ' + (i + 1) + ' 个子元素');
        }
    }
    return null
}

function fast_search_display_fun(id, new_index, old_index) {
    // console.log(id, new_index, old_index);
    let parent = document.getElementById(id)

    if (parent.children[new_index] && parent.children[old_index]) {
        var new_child = parent.children[new_index];
        var old_child = parent.children[old_index];

        // 设置样式
        old_child.style.color = '#0D47A1'; // 设置文字颜色为红色
        new_child.style.color = 'red'; // 设置文字颜色为红色


    } else {
        console.log('父元素没有这么多子元素');
    }
}


function container_find() {
    let match_num = 0
    let search_input = document.getElementById("search_input")
    let search_value = search_input.value
    let container = document.getElementById("container")
    let a_tag = container.getElementsByClassName("a_tag")
    if (search_value == "") {
        for (let i = 0; i < a_tag.length; i++) {
            let a_tag_each = a_tag[i]
            a_tag_each.parentNode.style.display = "block"
        }
        return
    }
    for (let i = 0; i < a_tag.length; i++) {
        let a_tag_each = a_tag[i]
        // console.log(a_tag_each.innerText, search_value);
        // 1.字符匹配率（正向，反向）
        let match_raw_rate = strSimilarity2Percent([a_tag_each.innerText, search_value], [0, 0])
        let match_processed_rate = strSimilarity2Percent([a_tag_each.innerText.replace(/\d+=> /, ""), search_value], [0, 0])
        // 2.正则表达式原始字符匹配（正向，反向）
        let reg_raw_forward = a_tag_each.innerText.match(search_value)
        let reg_raw_back = search_value.match(a_tag_each.innerText)
        // 2.正则表达式删减字符匹配（正向，反向）
        let reg_processed_forward = a_tag_each.innerText.replace(/\d+=> /, "").match(search_value)
        let reg_processed_back = search_value.match(a_tag_each.innerText.replace(/\d+=> /, ""))
        /*      match() 方法将字符串与正则表达式进行匹配。
                提示：如果搜索值为字符串，则转换为正则表达式。
                match() 方法返回包含匹配项的数组。
                如果未找到匹配项，则 match() 方法返回 null。 */

        // console.log(match_raw_rate, match_processed_rate, reg_raw_forward, reg_raw_back, reg_processed_forward, reg_processed_back)
        if (match_raw_rate >= 0.85 || match_processed_rate > 0.85 || reg_raw_forward != null || reg_raw_back != null || reg_processed_forward != null || reg_processed_back != null) {
            match_num += 1
            a_tag_each.parentNode.style.display = "block"

        } else {
            a_tag_each.parentNode.style.display = "none"
        }
    }
    if (match_num == 0) {

        for (let i = 0; i < a_tag.length; i++) {
            let a_tag_each = a_tag[i]
            a_tag_each.parentNode.style.display = "block"
        }
    }
}


// 防抖函数
function debounce(fn, duration = 200) {
    let timer
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn(...args)
        }, duration)
    }
}
function truncateString(str, targetChar) {
    const index = str.indexOf(targetChar);
    if (index !== -1) {
        return str.substring(index);
    }
    return str;
}

function get_path() {
    // 第二页
    var url = location.search
    if (url.match(/\?name=.*&path=.*$/)) {
        let container = document.getElementById("container")
        container.id = "container"
        container.style.display = "block"

        let bookshelf = document.getElementById("bookshelf")
        bookshelf.style.display = "none"
        const queryString = truncateString(url, "?");
        const params = queryString.split('&');
        let name, path;
        params.forEach(param => {
            const [key, value] = param.split('=');
            if (key === '?name') {
                name = decodeURIComponent(value);
            } else if (key === 'path') {
                path = decodeURIComponent(value);
            }
        });
        var xmlhttp = new XMLHttpRequest();
        // console.log(path.replace(/^../,"."));
        xmlhttp.open("GET", path + "/path_info.json")

        xmlhttp.send()
        xmlhttp.onload = function () {
            if (xmlhttp.status >= 200 && xmlhttp.status < 400) {
                // 请求成功，解析JSON数据
                if (xmlhttp.responseText != "" && xmlhttp.responseText != [] && xmlhttp.responseText != "[]") {
                    let json = JSON.parse(xmlhttp.responseText);
                    json2path(json)
                } else {
                    swal({
                        title: "该课程暂时没有题目。",
                        text: "又出错了...",
                        icon: "error",
                    })
                }

            }
        }
    } else {



        // 定义两个 JSON 文件的 URL
        const url1 = g_file + "dir_info.json";
        const url2 = g_course_info;

        // 使用 Promise.all 同时请求两个文件
        Promise.all([
            fetch(url1).then(response => response.json()),
            fetch(url2).then(response => response.json())
        ])
            .then(([course_raw_json, course_info_raw_json]) => {
                // 两个 JSON 文件都已加载完毕
                console.log('Data from first file:', course_raw_json);
                console.log('Data from second file:', course_info_raw_json);


                for (let k = 0; k < course_raw_json.length; k++) {
                    let course_name = course_raw_json[k]["name"].replace(/^[\s\S]{3}/, "").replace(" ", "")
                    // console.log(course_name);
                    for (let p = 0; p < course_info_raw_json.length; p++) {
                        let course_info_each = course_info_raw_json[p]
                        // console.log(course_name, course_info_each["name"]);
                        if (course_name == course_info_each["name"] || course_info_each["name"].includes(course_name)) {
                            // console.log(course_name);
                            course_raw_json[k]["credit"] = course_info_each["credit"]
                            break
                        } else {
                            course_raw_json[k]["credit"] = "0"
                        }

                    }
                }

                // 请求成功，解析JSON数据
                let school_year = ["", "大一", "大二", "大三", "大四", "大五"]
                let term = ["上", "下", ""]
                course_raw_json.sort((a, b) => {
                    let a_name = a["name"]
                    let b_name = b["name"]
                    /*                     let a_text_3 = a_name.slice(0, 3)
                                        let b_text_3 = b_name.slice(0, 3) */
                    let a_school_year = a_name.slice(0, 2)
                    let a_term = a_name.slice(2, 3)
                    let b_school_year = b_name.slice(0, 2)
                    let b_term = b_name.slice(2, 3)

                    let a_credit = Number(a["credit"])
                    let b_credit = Number(b["credit"])

                    // 学年比较
                    if (school_year.indexOf(a_school_year) > school_year.indexOf(b_school_year)) {
                        return -1
                    } else if (school_year.indexOf(a_school_year) < school_year.indexOf(b_school_year)) {
                        return 1
                    }

                    // 学期比较
                    if (term.indexOf(a_term) > term.indexOf(b_term)) {
                        return -1
                    } else if (term.indexOf(a_term) < term.indexOf(b_term)) {
                        return 1
                    }

                    // 学分比较
                    if (a_credit > b_credit) {
                        return -1
                    } else if (a_credit < b_credit) {
                        return 1
                    }

                    return 0

                })



                let local_file = {
                    "name": "读取本地json文件",
                    "path": "",
                }
                var json = []
                json.push(local_file)
                json.push(...course_raw_json);
                let bookshelf = document.getElementById("bookshelf")
                for (let i = 0; i < json.length; i++) {
                    // 创建元素

                    // 课程包裹 book_div 
                    let book_div = document.createElement("div")
                    book_div.className = "book_div"
                    // 课程连接元素 book_a
                    let book_a = document.createElement("a")
                    book_a.className = "book_a"
                    // 课程完整名称 book_full_name
                    let book_full_name = document.createElement("div")
                    book_full_name.className = "book_full_name"
                    // 课程简化名称 book_simplify_name
                    let book_simplify_name = document.createElement("div")
                    book_simplify_name.className = "book_simplify_name"
                    // 课程学分 book_credit
                    let book_credit = document.createElement("div")
                    book_credit.className = "book_credit"


                    var href = window.location.href;
                    if (!json[i]["path"] == "") {
                        book_a.href = href + "?name=" + json[i]["name"] + "&path=" + json[i]["path"]
                    } else {
                        book_a.href = "exercise.html"
                    }
                    book_div.append(book_a)

                    // 完整名称添加
                    book_div.appendChild(book_full_name)

                    // 简化名称添加
                    book_simplify_name.innerText = json[i]["name"].replace("-sep", "").replace("-ign", "")
                    book_div.appendChild(book_simplify_name)

                    // 课程学分添加
                    if (json[i].hasOwnProperty("credit") && json[i]["credit"] != "") {
                        let credit = Number(json[i]["credit"])
                        book_credit.innerText = credit
                        if (credit <= 1) {
                            // 0--2
                            book_credit.classList.add("credit_one")
                        } else if (credit <= 2.5) {
                            // 2--3
                            book_credit.classList.add("credit_two")
                        } else {
                            book_credit.classList.add("credit_three")
                        }

                    }
                    book_div.appendChild(book_credit)


                    bookshelf.append(book_div)
                }

                // 调用函数以初始化 3D 悬停效果
                card_3d_hover()

                // 在这里可以继续处理两个 JSON 数据
            })
            .catch(error => {
                // 处理错误
                console.error('There was an error fetching the JSON files:', error);

                swal({
                    title: "请求的文件溜走了",
                    text: "网络或者网站的原因" + error,
                    icon: "error",
                })

            });

    }
}



function json2path(json) {
    if (json == null || json == []) { return }
    let container = document.getElementById("container")
    var str = ''
    for (let i = 0; i < json.length; i++) {
        let a_div = document.createElement("div")
        a_div.className = "a_div"
        let a = document.createElement("a")
        a.className = "a_tag"
        let name = json[i]["name"]
        a.innerText = i + 1 + "=>" + " " + extractBeforeMatch(name)
        let path = json[i]["path"];
        str = path.join("@")
        a.href = "./exercise.html?name=" + json[i]["name"] + "&path=" + str
        a.target = "_blank"
        a_div.append(a)
        container.append(a_div)
    }
}
function extractBeforeMatch(str) {
    var str = str.replace("-sep", "").replace("-ign", "")
    var regex = /-\d+年\d+月\d+日\d+小时\d+分\d+秒\.json/;
    var matchResult = str.match(regex);
    if (matchResult == null) {
        if (str.match(/\.json/) != null) return str.replace(/\.json/, "")
        return str
    } else {
        return str.replace(matchResult, "")
    }
}


// js匹配两个字符串
function strSimilarity2Number([s, t], [s_re, t_re]) {
    // console.log(s, t, s_re, t_re)
    if (s_re !== 0) {
        s_re = new RegExp(s_re, "mg")
        // console.log(s,s_re)
        s = s.replace(s_re, "")
        // console.log(s)
    }
    if (t_re !== 0) {
        t_re = new RegExp(t_re, "mg")
        t = t.replace(t_re, "")
        // console.log(t)
    }

    var n = s.length, m = t.length, d = [];
    var i, j, s_i, t_j, cost;
    if (n == 0) return m;
    if (m == 0) return n;
    for (i = 0; i <= n; i++) {
        d[i] = [];
        d[i][0] = i;
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j;
    }
    for (i = 1; i <= n; i++) {
        s_i = s.charAt(i - 1);
        for (j = 1; j <= m; j++) {
            t_j = t.charAt(j - 1);
            if (s_i == t_j) {
                cost = 0;
            } else {
                cost = 1;
            }
            d[i][j] = Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    return d[n][m];
}
//两个字符串的相似程度，并返回相似度百分比
function strSimilarity2Percent([s, t], [s_re = 0, t_re = 0]) {
    var l = s.length > t.length ? s.length : t.length;
    var d = strSimilarity2Number(...arguments);
    return (1 - d / l).toFixed(4);
}
function Minimum(a, b, c) {
    return a < b ? (a < c ? a : c) : (b < c ? b : c);
}




function card_3d_hover() {
    const cards = document.querySelectorAll('.book_div'); // 选择所有卡片元素
    const yRange = [-20, 20];
    const xRange = [-20, 20];

    cards.forEach(card => {

        card.addEventListener('mousemove', (e) => {
            const { offsetX, offsetY } = e;
            const { offsetWidth, offsetHeight } = card;
            const ry = -getRotate(yRange, offsetX, offsetWidth);
            const rx = getRotate(xRange, offsetY, offsetHeight);
            card.style.setProperty('--rx', `${rx}deg`);
            card.style.setProperty('--ry', `${ry}deg`);
            card.classList.add('hover3d');
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rx', `0deg`);
            card.style.setProperty('--ry', `0deg`);
            card.classList.remove('hover3d');
        });
    });
}

function getRotate(range, value, max) {
    return (value / max) * (range[1] - range[0]) + range[0];
}
