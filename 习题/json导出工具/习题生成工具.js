
json = {}
json_str = []
g_rules_default = []
g_rules = {}
g_rules_id = ["wrap_re", "type_code_input_re", "type_re", "q_re", "options_wrap_re", "option_re", "answer_true_re", "analysis_re", "answer_true_row_input_re"]
g_head_info_id = ["head_info_author", "head_info_filename", "head_info_course", "head_info_source"]
g_output_rules_json = {}
g_head_info_json = {}
document.oncontextmenu = function () {
    return false;
}

// 防抖函数
function debounce(fn, duration = 500) {
    let timer
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn(...args)
        }, duration)
    }
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, String(this.getFullYear()).slice(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).slice(("" + o[k]).length)));
        }
    }
    return fmt;
}


// 下载函数
let handleDownload = function (content, name = "未命名的文件") {
    let download = document.createElement("a")
    // download.style.display = 'block'
    download.style.display = 'none'
    download.download = name + '.json';
    var data = JSON.stringify(content, undefined, 4);
    var blob = new Blob([data], { type: "text/json" });
    download.href = URL.createObjectURL(blob);
    download.click()
}

let textarea1_handleDownload_debounce = debounce(() => {
    let textarea1_value = textarea1.value
    if (isJSON(textarea1_value)) {
        var json_temp = JSON.parse(textarea1_value)
        var filename = json_temp["head"]["filename"]
        var time = new Date().format("yy年MM月dd日hh小时mm分ss秒")
        if (filename == "") {
            var file_name = "测试数据"
        } else {
            let type_re = document.getElementById("type_re")
            let type_re_value = type_re.innerText
            if (type_re_value.match(/^@/)) {
                type_re_value = type_re_value.replace(/^@/, "")
            }
            var file_name = filename + " " + type_re_value
        }
        json_temp["head"]["time"] = time
        json_temp["head"]["id"] = 'id-' + new Date().getTime().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
        handleDownload(json_temp, file_name)
    } else {
        hide_download()
        console.log("因为不是json格式所以不下载")
    }
}, 250)

let download_div = document.getElementById("download_div")
download_div.addEventListener("click", textarea1_handleDownload_debounce)





// 起用或取消编辑
function is_edit(textarea1, is_edit_svg_parent) {
    if (is_edit_svg_parent.classList.contains("edit")) {
        is_edit_svg_parent.classList.remove("edit")
        is_edit_svg_parent.classList.add("cancel")
        textarea1.disabled = true
        is_edit_svg_parent.innerHTML = `
        <svg t="1700932335024" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8111" data-spm-anchor-id="a313x.search_index.0.i11.27ff3a81fQ3o9Y" width="32" height="32"><path d="M938.4689664 270.87121067l-74.46309547-74.42705067c-9.16411733-9.15428693-20.25280853-13.7035776-33.32396373-13.7035776-13.0187264 0-24.16093867 4.54929067-33.26716587 13.7035776l-45.05381546 45.03415467 141.05422506 140.97995093 45.05381547-45.0297856c9.10731947-9.10185813 13.71450027-20.24297813 13.71450027-33.30757973 0-13.00998827-4.60827307-24.1467392-13.71450027-33.2496896zM391.82117547 601.77667413v140.97995094H532.92782933l329.1480064-328.97652054-141.11102293-140.97995093-329.14363733 328.97652053z m121.49828266 94.0212224h-27.426816v-47.01006506h-47.03627946v-27.41807787l56.84046506-56.8098816 74.4095744 74.42814293-56.786944 56.8098816z m215.03781547-336.31218346L556.9314816 530.82740053c-5.5738368 5.51376213-10.98492587 5.6754176-16.1808384 0.48278187-5.24834133-5.2461568-5.09105493-10.60154027 0.48278187-16.171008l171.43125333-171.33841067c5.56837547-5.57056 10.92703573-5.73330773 16.17537707-0.48278186 5.19591253 5.193728 5.03862613 10.60263253-0.48278187 16.1677312z m-36.11579733 411.0548992c-2.85190827 4.15389013-6.1669376 8.11881813-9.9549184 11.8915072-15.32122453 15.36928427-33.8034688 23.02498133-55.34078294 23.02498133H219.4243584c-21.53294507 0-40.01518933-7.65569707-55.34078293-23.02498133-15.37256107-15.31357867-23.03153493-33.78490027-23.03153494-55.312384V319.81131093c0-21.5220224 7.65897387-39.99552853 23.03153494-55.312384 15.3255936-15.3649152 33.80783787-23.02170453 55.34078293-23.02170453h407.5225088c7.17728427 0 14.51840853 0.96556373 22.02118827 2.9458432 5.89277867 1.98027947 11.14112 0.638976 15.6925952-3.91031467l24.00256-23.9894528c3.91140693-3.91031467 5.4099968-8.6736896 4.39309653-14.18635946-0.96447147-5.25052587-3.91140693-8.99700053-8.78619307-11.2984064-17.6226304-8.13847893-36.749312-12.2093568-57.32215466-12.2093568H219.4243584c-38.84100267 0-72.05464747 13.76146773-99.6442112 41.33573973C92.13924693 247.79270827 78.37013333 280.98996907 78.37013333 319.81131093v407.30842454c0 38.82134187 13.7691136 72.0175104 41.41001387 99.59287466 27.58956373 27.63106987 60.80320853 41.3925376 99.6442112 41.3925376h407.5225088c38.84100267 0 72.05573973-13.76146773 99.70210133-41.3925376a153.87962027 153.87962027 0 0 0 13.53427627-15.4238976c-19.5035136-8.92381867-36.0906752-23.1112704-47.94176853-40.74810026z" fill="#2c2c2c" p-id="8112" data-spm-anchor-id="a313x.search_index.0.i12.27ff3a81fQ3o9Y" class="selected"></path><path d="M892.98152107 601.75373653v-0.3080192c-47.53762987-47.42403413-124.54024533-47.3530368-171.9926784 0.15510187-47.448064 47.5103232-47.38143573 124.46706347 0.15619413 171.89218987 47.9199232 44.50440533 122.48787627 43.1423488 168.74755413-3.0900224 46.25749333-46.2323712 47.62282667-120.75226453 3.08893014-168.64925014z m-166.02781014 43.8272c15.56370773-29.9401216 46.497792-48.73693867 80.248832-48.78390613-0.0458752 0-0.09065813-0.0032768-0.13653333-0.0032768h0.30911147c-0.05789013 0-0.114688 0.00218453-0.17257814 0.0032768a89.99185067 89.99185067 0 0 1 51.9733248 16.73898667L733.2429824 739.393536c-19.45545387-27.6463616-21.88356267-63.82114133-6.28927147-93.81259947z m160.5500928 85.18478507c-15.6401664 30.08320853-46.83093333 48.86145707-80.75127466 48.61569707l0.31238826-1.2419072a89.97874347 89.97874347 0 0 1-52.10985813-15.499264l125.927424-125.85751894c19.70230613 27.5972096 22.25821013 63.90306133 6.62132053 93.98299307z" fill="#FC5043" p-id="8113"></path></svg>
        `
    } else {
        is_edit_svg_parent.classList.remove("cancel")
        is_edit_svg_parent.classList.add("edit")
        textarea1.disabled = false
        is_edit_svg_parent.innerHTML = `
            <svg t="1700931057455" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2851"
            width="32" height="32">
            <path
            d="M862.709333 116.042667a32 32 0 1 1 45.248 45.248L455.445333 613.813333a32 32 0 1 1-45.258666-45.258666L862.709333 116.053333zM853.333333 448a32 32 0 0 1 64 0v352c0 64.8-52.533333 117.333333-117.333333 117.333333H224c-64.8 0-117.333333-52.533333-117.333333-117.333333V224c0-64.8 52.533333-117.333333 117.333333-117.333333h341.333333a32 32 0 0 1 0 64H224a53.333333 53.333333 0 0 0-53.333333 53.333333v576a53.333333 53.333333 0 0 0 53.333333 53.333333h576a53.333333 53.333333 0 0 0 53.333333-53.333333V448z"
            fill="#000000" p-id="2852"></path>
            </svg>
        `
    }
}

// 隐藏下载
function hide_download() {
    let download = document.getElementById("download")
    download.style.display = 'none'
}
// 判断是否为json
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log('error：' + e);
            return false;
        }
    } else {
        console.log('It is not a string!')
    }

}
// json重复过滤
function json_filter(json) {     // 使用 Set 来追踪已经出现的对象
    const uniqueObjects = new Set();

    // 过滤数组，只保留第一次出现的每个对象
    json = json.filter(obj => {
        const serializedObj = JSON.stringify(obj);
        if (!uniqueObjects.has(serializedObj)) {
            uniqueObjects.add(serializedObj);
            return true;
        }
        return false;
    });
    return json
}

// js匹配两个字符串

function strSimilarity2Number([s, t], [s_re, t_re]) {
    if (s_re !== 0) {
        s_re = new RegExp(s_re, "mg")
        s = s.replace(s_re, "")
    }
    if (t_re !== 0) {
        t_re = new RegExp(t_re, "mg")
        t = t.replace(t_re, "")
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

/* var xmlhttp;
xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        let textarea0 = document.getElementById("textarea0")
        textarea0.value = xmlhttp.responseText
        main()
    }
}
xmlhttp.open("GET", "http://127.0.0.1:5500/json_test/test/1.txt", true);
xmlhttp.send(); */



function textarea0_empty() {
    let textarea0 = document.getElementById("textarea0")
    textarea0.value = ""
    let textarea1 = document.getElementById("textarea1")
    textarea1.value = ""
    swal_toast("原始文本清空成功!")
}

async function textarea0_paste_fun() {
    const text = await navigator.clipboard.readText();
    swal_toast("原始文本粘贴成功!")
    let textarea0 = document.getElementById("textarea0")
    textarea0.value = text
    main()
}

function swal_toast(title, icon = "success", text) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: icon,
        title: title
    });
}

// 复制结果
function textarea0_copy() {
    let textarea0 = document.getElementById("textarea0")
    navigator.clipboard.writeText(textarea0.value).then(() => {
        swal_toast("原始文本复制成功!")
    })

}



// 粘贴处理方法
let main_debounce = debounce(main, 1200)
// 起用或取消编辑
function textarea1_is_edit(is_edit_svg_parent) {
    let textarea1 = document.getElementById("textarea1")
    is_edit(textarea1, is_edit_svg_parent)
}
// 复制结果
function textarea1_copy() {
    let textarea1 = document.getElementById("textarea1")
    navigator.clipboard.writeText(textarea1.value).then(() => {
        swal_toast("json复制成功!")
    })
}
// 预览
function textarea1_preview() {

    let textarea1_value = textarea1.value
    if (isJSON(textarea1_value)) {
        var json_temp = JSON.parse(textarea1_value)
        json_str = JSON.stringify(json_temp)
        localStorage.setItem("json_str", json_str)
        window.open("../exercise.html?preview")
        // window.open("exercise.html?preview")
    } else {
        console.log("因为不是json格式所以无法预览")
    }


}

/* let contenteditable = document.getElementsByClassName("contenteditable")
Array.from(contenteditable).forEach((e) => {
    e.addEventListener("input",
        main_debounce
    )
}) */

document.getElementById("page1_right").addEventListener("input", (e) => {
    if (e.target.classList.contains("contenteditable")) {
        main_debounce()
    }
})

let textarea0 = document.getElementById("textarea0")
textarea0.addEventListener("input",
    main_debounce
)


let type_code_input_re = document.getElementsByClassName("type_code_input_re")[0]
type_code_input_re.addEventListener("input",
    type_code_change
)
/* type_code_input_re.change(()=>{
   
    
}) */
let radio_input_re = $("#page1 input[type='radio']")
for (let i = 0; i < radio_input_re.length; i++) {
    radio_input_re[i].addEventListener("change",
        main_debounce
    )
}
let answers_matching_type = document.getElementsByClassName("answers_matching_type")[0]
answers_matching_type.addEventListener("input",
    main_debounce
)


function disableTest(element, val) {
    element.disabled = val;
}

function error_log(key, error_text_arr) {
    json["head"]["dev"][key] = json["head"]["dev"][key] + 1
    // console.error("%c"+error_text_arr["describe"] + "匹配失败。\n"+"正则表达式："+ error_text_arr["re"]+"\n"+error_text_arr["describe"] + "单位：" + error_text_arr["unit"]+"\n匹配结果："+ error_text_arr["result"])
    console.error("%c" + error_text_arr["describe"] + "匹配失败。\n" + "正则表达式：" + "%c\n" + error_text_arr["re"] + "\n" + "%c匹配结果：" + "%c" + error_text_arr["result"] + "\n%c" + error_text_arr["describe"] + "单位：" + "\n" + "%c" + error_text_arr["unit"], "font-size:16px;color:tan;", "color:white;", "font-size:16px;color:tan;", "color:white;", "font-size:16px;color:tan;", "color:white;")
}
/* let error_text_arr = {
    "describe": "",
    "re": "",
    "unit": "",
    "result": ""

} */
class ErrorTextArr {
    constructor(describe, re, unit, result) {
        this.describe = describe
        this.re = re
        this.unit = unit
        this.result = result
    }
}



function main() {
    console.clear();

    json = {
        "head": {
            "version": "1.0.0",
            "author": "听雨荷",
            "course": "未知",
            "source": "未知",
            "filename": "",
            "type_all_num": 0,
            "dev": {
                "wrap_num": 0,
                "error_questions_num": 0,
                "error_type_num": 0,
                "error_type_code_num": 0,
                "error_options_num": 0,
                "error_answers_true_num": 0,
                "error_analysis_num": 0
            }
        },
        "body": [
        ]
    }
    // let main = []
    let all = document.getElementById("textarea0")
    let all_value = all.value.replace(/\u00A0/g, ' ')
    let wrap_re = ""
    let q_re = ""
    let options_wrap_re = ""
    let option_re = ""
    let answer_true_re = ""
    let analysis_re = ""

    if (all.value == "") {
        return
    }

    let textarea1 = document.getElementById("textarea1")
    textarea1.value = ""
    disableTest(textarea1, true)

    let author = document.getElementById("head_info_author").innerText
    if (author) {
        json["head"]["author"] = author
    }

    let course = document.getElementById("head_info_course").innerText
    if (course) {
        json["head"]["course"] = course
    }

    let filename = document.getElementById("head_info_filename").innerText
    if (filename) {
        json["head"]["filename"] = filename
    }

    let source = document.getElementById("head_info_source").innerText
    if (source) {
        json["head"]["source"] = source
    }



    type_re_temp = document.getElementById("type_re").innerText
    // 建立正则表达式
    try {
        if (document.getElementById("wrap_re").innerText.replace("\n", "")) {
            wrap_re = new RegExp(document.getElementById("wrap_re").innerText, "mg")
        }
        if (document.getElementById("type_re").innerText.replace("\n", "")) {
            type_re = new RegExp(document.getElementById("type_re").innerText, "mg")
        }
        if (document.getElementById("q_re").innerText.replace("\n", "")) {
            q_re = new RegExp(document.getElementById("q_re").innerText, "mg")
        }

        if (document.getElementById("options_wrap_re").innerText.replace("\n", "")) {
            options_wrap_re = new RegExp(document.getElementById("options_wrap_re").innerText, "mg")
        }
        if (document.getElementById("option_re").innerText.replace("\n", "")) {
            option_re = new RegExp(document.getElementById("option_re").innerText, "mg")
        }
        if (document.getElementById("answer_true_re").innerText.replace("\n", "")) {
            answer_true_re = new RegExp(document.getElementById("answer_true_re").innerText, "mg")
        }
        if (document.getElementById("analysis_re").innerText.replace("\n", "")) {
            analysis_re = new RegExp(document.getElementById("analysis_re").innerText, "mg")
        }
    } catch (error) {

        console.error("正则表达式错误", error);
        return
    }


    if (wrap_re && wrap_re.test(all_value)) {
        wrap = all_value.match(wrap_re)
        wrap_input = document.getElementById("wrap_input")
        if (!wrap_input.checked) {
            all_value = all_value.replace(wrap_re, "")
        }

        json["head"]["dev"]["wrap_num"] = wrap.length

        for (let v = 0; v < wrap.length; v++) {
            var e = wrap[v]
            var index = v
            var wrap_each = e
            var q = []
            var type = []
            var type_code = []
            var option = []
            var answer_true = []
            var analysis = []
            // console.log(v, "wrap_each：", wrap_each)
            let vv = v + 1

            console.group("%c" + vv + ".第" + vv + "个问题;" + "第" + v + "个wrap。", "font-size:10px;color:green;")
            console.log("Wrap：" + e);

            if (type_re) {
                if (type_re_temp.match(/^@/)) {
                    type.push(type_re_temp.replace(/^@/, ""))
                } else {
                    let v = e.match(type_re)
                    if (e) {
                        type = v
                    } else {
                        type = ""
                    }
                    type_input = document.getElementById("type_input")
                    if (!type_input.checked) {
                        e = e.replace(type_re, "")
                    }
                }
            }

            let type_code_input_re = document.getElementsByClassName("type_code_input_re")[0].value
            type_code = type_code_input_re
            if (q_re) {
                let v = e.match(q_re)
                if (v) {
                    q = v
                    if (q.length >= 2) {
                        console.error("问题数量大于1\n", e, q)
                    }
                } else {
                    /*  json["head"]["dev"]["error_questions_num"] = json["head"]["dev"]["error_questions_num"] + 1
                     console.error("问题匹配失败。\n", "正则表达式：", q_re, "\n问题单位：" + e, "\n匹配结果：", v) */
                    let error_text_arr = new ErrorTextArr("问题", q_re, e, v)
                    error_log("error_questions_num", error_text_arr)
                    q = ""
                }
                var q_input = document.getElementById("q_input");
                if (!q_input.checked) {
                    e = e.replace(q_re, "")
                }
            }

            if (options_wrap_re) {
                if (e.match(options_wrap_re)) {
                    options_wrap = e.match(options_wrap_re)[0]
                    option = e.match(options_wrap_re)
                } else {
                    /*                     let error_text_arr = new ErrorTextArr("选项", options_wrap_re, e, options_wrap)
                                        error_log("error_options_num", error_text_arr) */
                    options_wrap = ""
                }
                options_wrap_input = document.getElementById("options_wrap_input")
                if (!options_wrap_input.checked) {
                    e = e.replace(options_wrap_re, "")
                }
            } else {
                options_wrap = e
            }

            if (option_re) {
                option = options_wrap.match(option_re)

                option_wrap_input = document.getElementById("options_wrap_input")

                if (!option_wrap_input.checked) {
                    e = e.replace(option_re, "")
                }
            }

            if (answer_true_re) {

                let v = e.match(answer_true_re)
                if (v) {
                    answer_true = v
                } else {
                    let error_text_arr = new ErrorTextArr("正确答案", answer_true_re, e, v)
                    error_log("error_answers_true_num", error_text_arr)
                    answer_true = ""
                }
                answer_true_input = document.getElementById("answer_true_input")
                if (!answer_true_input.checked) {
                    e = e.replace(answer_true_re, "")
                }
            }

            if (analysis_re) {
                let v = e.match(analysis_re)
                if (v) {
                    analysis = v
                } else {
                    let error_text_arr = new ErrorTextArr("解析", analysis_re, e, v)
                    error_log("error_analysis_num", error_text_arr)
                    analysis = ""
                }
                analysis_input = document.getElementById("analysis_input")
                if (!analysis_input.checked) {
                    e = e.replace(analysis_re, "")
                }
            }
            /*             if (q != null && q != "") {
                            q = q.forEach((e) => {
                                e.replace(/\n/gm, "")
                            })
                        }
                        if (option != null && q != "") {
                            option = option.forEach((e) => {
                                e.replace(/\n/gm, "")
                            })
                        }
                        if (answer_true != null && q != "") {
                            answer_true = answer_true.forEach((e) => {
                                e.replace(/\n/gm, "")
                            })
                        }
                        if (analysis != null && q != "") {
                            analysis = analysis.forEach((e) => {
                                e.replace(/\n/gm, "")
                            })
                        } */

            wrap_obj = {
                // "wrap": wrap,
                "questions": q,
                "type": type,
                "type_code": type_code,
                "options": option,
                "answers": answer_true,
                "analysis": analysis
            }
            // console.log(index, wrap, wrap_obj)
            if (type_code == "1" || type_code == "2") {
                // 答案与选项的匹配度
                // 获取答案匹配类型
                let answers_matching_type = document.getElementsByClassName("answers_matching_type")[0].value
                let replace_contenteditable = $("#page1_right").find(".replace_contenteditable")
                if (replace_contenteditable[0].innerText) {
                    s_re = replace_contenteditable[0].innerText
                } else {
                    s_re = ":;；：  ,，.。", "gm"
                }
                if (wrap_obj["options"] != null) {
                    options_length = wrap_obj["options"].length
                } else {
                    console.log("选项包裹为空", wrap_obj)
                    // continue
                }

                if (option == null || option.length == 0) {
                    console.log("选项为空", wrap_obj, option, option_re)
                    // continue
                } else if (option != null && option.length >= 6) {
                    console.log("选项个数大于6", wrap_obj, option, option_re)
                }

                if (wrap_obj["answers"] != null) {
                    answers_length = wrap_obj["answers"].length
                    // continue
                } else {
                    console.log("答案为空", wrap_obj)
                }

                answers_matching_rate = []
                answers_matching_index = []
                // 1为匹配字母，2为匹配具体内容
                answers_char = wrap_obj["answers"].toString().replace(s_re, '')

                if (answers_char == null) {
                    console.error("answers_char等于null\n", wrap_obj, wrap_obj["answers"]);
                }

                if (answers_matching_type == "1" && 0 < answers_char.length < option.length + 3 && answers_char.match(/[A-Z]/mg)) {
                    for (let i = 0; i < answers_char.length; i++) {
                        answers_matching_index.push(answers_char[i].charCodeAt(0) - 65)
                        answers_matching_rate.push("100%")
                    }
                } else if (answers_matching_type == "2") {
                    for (let i = 0; i < answers_length; i++) {
                        let answers_each = wrap_obj["answers"][i]
                        matching_rate = []
                        for (let j = 0; j < options_length; j++) {
                            let options_each = wrap_obj["options"][j]
                            matching_rate.push(strSimilarity2Percent([answers_each, options_each], [s_re]))
                        }
                        answers_matching_rate.push(Math.max(...matching_rate).toFixed(4))
                        answers_matching_index.push(matching_rate.indexOf(Math.max(...matching_rate).toFixed(4)))
                    }
                }
                wrap_obj["answers_matching_rate"] = answers_matching_rate
                wrap_obj["answers_matching_index"] = answers_matching_index
            } else if (type_code == "3") {
                wrap_obj["options"] = ["错误", "正确"]
                let replace_contenteditable = $("#page1_right").find(".replace_contenteditable")[0].innerText
                if (replace_contenteditable) {
                    let replace_contenteditable_re = new RegExp(replace_contenteditable, "gm")
                    // 判断题只有一个答案，下标取0
                    if (replace_contenteditable_re.test(wrap_obj["answers"][0])) {
                        wrap_obj["answers_matching_index"] = [1]
                    } else {
                        wrap_obj["answers_matching_index"] = [0]
                    }
                }
            } else if (type_code == "4" || type_code == "5") {
                let replace_contenteditable = $("#page1_right").find(".replace_contenteditable")
                if (replace_contenteditable) {
                    s_re = new RegExp(replace_contenteditable[0].innerText, "gm")
                    answers_new = []
                    for (let i = 0; i < wrap_obj["answers"].length; i++) {
                        let answers_each = wrap_obj["answers"][i]
                        // console.log(answers_each)
                        console.log(answers_each.match(s_re))
                        answers_each_match = answers_each.match(s_re)
                        for (let j = 0; j < answers_each_match.length; j++) {
                            answers_new.push(answers_each_match[j])
                        }
                    }
                    // console.log(answers_new)
                    wrap_obj["answers"] = answers_new
                }
            }

            json["head"]["type_all_num"] = json["head"]["type_all_num"] + 1
            if (json["head"]["type_" + type_code + "_num"]) {
                json["head"]["type_" + type_code + "_num"] += 1
            } else {
                json["head"]["type_" + type_code + "_num"] = 1
            }
            // console.log(wrap_obj)
            /*             for (var a in wrap_obj) {
                            // console.log(a, ":", wrap_obj[a]);
                            if (!Array.isArray(wrap_obj[a])) {
                                continue
                            }
                            wrap_obj[a].forEach((e,index) => {
                                wrap_obj[a][index].replace(/\n/gm, "")
                                // console.log(e);
                            })
            
                        } */
            console.log(wrap_obj);
            json["body"].push(wrap_obj)

            console.groupEnd()
        }

        // TODO 导出全部， 默认

        let answer_true_row_input = document.getElementById("answer_true_row_input").textContent
        if (answer_true_row_input != "") {
            let answer_true_row_input_re = document.getElementById("answer_true_row_input_re").textContent
            if (answer_true_row_input_re == "") {
                answer_true_row_input_re = `[A-H]`
                // TODO 答案小写转大写
            }

            let answer_true_row_re = new RegExp(answer_true_row_input_re, "mg")

            console.log(answer_true_row_input, answer_true_row_re);
            let answer_true_row_arr = answer_true_row_input.match(answer_true_row_re)

            if (answer_true_row_arr) {
                if (answer_true_row_arr.length != json["body"].length) {
                    swal_toast("题目数量和答案数量不相等", "error")
                } else {
                    swal_toast("题目数量和答案匹配", "success")
                }
                json["body"].forEach((json_each, index) => {
                    json_each["answers"].push(answer_true_row_arr[index])
                    json_each["answers_matching_index"].push(answer_true_row_arr[index].charCodeAt(0) - 65)

                })
            } else {
                console.error(answer_true_row_arr)
            }

        }


        json["body"] = json_filter(json["body"])
        let json_ = JSON.stringify(json, undefined, 4)
        textarea1.value = json_.replace(/\\n/gm, "")

        let textarea1_status = document.getElementById("textarea1_status")
        if (textarea1_status.classList.contains("edit")) {
            disableTest(textarea1, false)
        } else {
            disableTest(textarea1, true)
        }
    } else {
        if (!wrap_re) {

        } else {
            console.error("wrap匹配失败。\n", "正则表达式：", wrap_re, "。\n", "匹配结果:：", wrap_re.test(all_value) + "。")
        }

    }
}



function clear_rules() {
    g_output_rules_json = {}
    for (let i = 0; i < g_rules_id.length; i++) {
        if (g_rules_id[i] == "type_code_input_re") {
            continue
        }
        let rule_div = document.getElementById(g_rules_id[i])

        rule_div.innerText = ""
    }
    main()
    swal_toast("规则清空成功!")
}

function clear_all() {
    clear_rules()
    document.getElementById("textarea0").value = ""
    document.getElementById("answer_true_row_input").innerText = ""
    swal_toast("全部内容清空成功!")
}


async function input_rules(is_paste = true, g_output_rules_json) {
    if (is_paste) {
        try {
            g_output_rules_json = JSON.parse(await navigator.clipboard.readText())
        } catch (error) {
            console.log(error);
            swal_toast("规则导入失败!")
            return
        }
    } else {
        g_output_rules_json = g_output_rules_json
    }

    for (let i = 0; i < g_rules_id.length; i++) {

        let rule_div = document.getElementById(g_rules_id[i])
        if (g_rules_id[i] == "type_code_input_re") {
            rule_div.value = g_output_rules_json[g_rules_id[i]]
            continue
        }
        rule_div.innerText = g_output_rules_json[g_rules_id[i]]
    }

    swal_toast("规则导入成功!")
    main()
}

function output_rules(is_copy = true) {
    g_output_rules_json = {}
    for (let i = 0; i < g_rules_id.length; i++) {
        let rule_div = document.getElementById(g_rules_id[i])
        if (g_rules_id[i] == "type_code_input_re") {
            g_output_rules_json[g_rules_id[i]] = rule_div.value
            continue
        }
        g_output_rules_json[g_rules_id[i]] = rule_div.innerText
    }
    if (is_copy) {
        output_rules_copy(g_output_rules_json)
    }

    main()

}
async function input_all(is_paste = true, g_output_all_json) {
    if (is_paste) {
        try {
            g_output_all_json = JSON.parse(await navigator.clipboard.readText())
        } catch (error) {
            console.log(error);
            swal_toast("全部内容导入失败!")
            return
        }
    } else {
        g_output_all_json = g_output_all_json
    }

    console.log(g_output_all_json);

    g_output_rules_json = g_output_all_json["rules"]
    g_head_info_json = g_output_all_json["head_info"]

    document.getElementById("textarea0").value = g_output_all_json["raw_text"]
    document.getElementById("answer_true_row_input").textContent = g_output_all_json["answer_true_row"]

    for (let i = 0; i < g_rules_id.length; i++) {

        let rule_div = document.getElementById(g_rules_id[i])
        if (g_rules_id[i] == "type_code_input_re") {
            rule_div.value = g_output_rules_json[g_rules_id[i]]
            continue
        }
        rule_div.innerText = g_output_rules_json[g_rules_id[i]]
    }

    for (let i = 0; i < g_head_info_id.length; i++) {
        if (g_head_info_json != null) {
            let g_head_info_id_item = document.getElementById(g_head_info_id[i])
            g_head_info_id_item.innerText = g_head_info_json[g_head_info_id[i]]
        } else {
            console.log(g_head_info_id[i]);
        }

    }

    swal_toast("全部内容导入成功!")
    main()
}

function download_output_all() {
    let g_output_all_json = output_all(false)
    let name_1 = document.getElementById("head_info_course").innerText
    let name_2 = document.getElementById("head_info_filename").innerText
    let name = ""
    if (name_1 == "" || name_2 == "") {
        name = "未命名"
    } else {
        name = name_1 + "_" + name_2
    }
    handleDownload(g_output_all_json, name + "_全部")
    swal_toast("全部内容开始下载")
}

function output_all(is_copy = true) {
    let raw_text = document.getElementById("textarea0").value
    let answer_true_row = document.getElementById("answer_true_row_input").textContent
    let g_head_info_json = {}
    // g_head_info_id


    g_output_rules_json = {}
    g_output_all_json = {
        rules: g_output_rules_json,
        answer_true_row: answer_true_row,
        head_info: g_head_info_json,
        raw_text: raw_text,
    }

    for (let i = 0; i < g_rules_id.length; i++) {
        let rule_div = document.getElementById(g_rules_id[i])
        if (g_rules_id[i] == "type_code_input_re") {
            g_output_rules_json[g_rules_id[i]] = rule_div.value
            continue
        }
        g_output_rules_json[g_rules_id[i]] = rule_div.innerText
    }


    for (let i = 0; i < g_head_info_id.length; i++) {
        let head_info_each = document.getElementById(g_head_info_id[i])
        g_head_info_json[g_head_info_id[i]] = head_info_each.innerText
    }
    console.log(g_head_info_id);

    console.log(g_output_all_json);

    if (is_copy) {

        // g_output_all_json
        navigator.clipboard.writeText(JSON.stringify(g_output_all_json)).then(
            swal_toast("全部内容复制成功!")
        ).catch(error, (error) => {
            console.log(error);
        });

    } else {
        return g_output_all_json
    }

    // main()
}

function output_rules_copy(g_output_rules_json) {

    var temp = JSON.stringify(g_output_rules_json)

    navigator.clipboard.writeText(temp).then(() => {
        swal_toast("规则复制成功!")
    })

}

function type_code_change() {
    // main_debounce()
    let type_code = document.getElementById("type_code_input_re").value
    if (type_code == 6) { return }
    g_rules = g_rules_default[type_code - 1]
    for (let i = 0; i < g_rules_id.length; i++) {

        let rule_div = document.getElementById(g_rules_id[i])
        if (g_rules_id[i] == "type_code_input_re") {
            // rule_div.value = g_rules[g_rules_id[i]]
            continue  //好像就是if else ,当时为什么这么写，不敢改
        }
        rule_div.innerText = g_rules[g_rules_id[i]]
    }

    // main()
}

function download_rules() {
    output_rules(false)
    let name_1 = document.getElementById("head_info_course").innerText
    let name_2 = document.getElementById("head_info_filename").innerText
    let name = ""
    if (name_1 == "" || name_2 == "") {
        name = "未命名"
    } else {
        name = name_1 + "_" + name_2
    }
    handleDownload(g_output_rules_json, name + "_规则")
    swal_toast("规则开始下载")
}


// rules

let rules_default_1 = { "wrap_re": "(?<=\\d+\\. )\\(((单选题)|(A型选择题))\\)[\\s\\S]+?(?=\\d+\\. \\(((单选题)|(A型选择题))\\))", "type_code_input_re": "1", "type_re": "@单选题", "q_re": "(? <=\\(((单选题)|(A型选择题))\\))[\\s\\S]+?(?=A\\.)< /div>", "options_wrap_re": "A\\.[\\s\\S]+?(?=我的答案:)", "option_re": "(?<=[A-Z]\\.[ ]{0,})[\\s\\S]+?(?=\\n)", "answer_true_re": "(?<=正确答案: )[A-Z]+(?=:)", "analysis_re": "" }
let rules_default_2 = { "wrap_re": "(?<=\\d+\\. )\\(((多选题)|(B型选择题))\\)[\\s\\S]+?(?=\\d+\\. \\(((多选题)|(B型选择题))\\))", "type_code_input_re": "2", "type_re": "@多选题", "q_re": "(?<=\\(((多选题)|(B型选择题))\\))[\\s\\S]+?(?=A\\.)", "options_wrap_re": "A\\.[\\s\\S]+?(?=我的答案:)", "option_re": "(?<=[A-Z]\\.[ ]{0,})[\\s\\S]+?(?=\\n)", "answer_true_re": "(?<=正确答案: )[A-Z]+(?=:)", "analysis_re": "" }
let rules_default_3 = { "wrap_re": "(?<=\\d+\\. )\\((判断题)\\)[\\s\\S]+?(?=\\d+\\. \\((判断题)\\))", "type_code_input_re": "3", "type_re": "@判断题", "q_re": "(?<=\\((判断题)\\))[\\s\\S]+?(?=A\\.)", "options_wrap_re": "A\\.[\\s\\S]+?(?=我的答案:)", "option_re": "(?<=[A-Z]\\.[ ]{0,})[\\s\\S]+?(?=\\n)", "answer_true_re": "(?<=正确答案: )[\\s\\S]", "analysis_re": "" }
let rules_default_4 = { "wrap_re": "(?<=\\d+\\. )\\((填空题)\\)[\\s\\S]+?(?=\\d+\\. \\((填空题)\\))", "type_code_input_re": "4", "type_re": "@填空题", "q_re": "(?<=\\((填空题)\\))[\\s\\S]+?(?=我的答案)", "options_wrap_re": "A\\.[\\s\\S]+?(?=我的答案:)", "option_re": "(?<=[A-Z]\\.[ ]{0,})[\\s\\S]+?(?=\\n)", "answer_true_re": "(?<=\\(\\d+\\) )[\\s\\S]+?(?=\\n)", "analysis_re": "" }
let rules_default_5 = { "wrap_re": "(?<=\\d+\\. )\\(((单选题)|(A型选择题))\\)[\\s\\S]+?(?=\\d+\\. \\(((单选题)|(A型选择题))\\))", "type_code_input_re": "1", "type_re": "@简答题", "q_re": "(? <=\\(((单选题)|(A型选择题))\\))[\\s\\S]+?(?=A\\.)< /div>", "options_wrap_re": "A\\.[\\s\\S]+?(?=我的答案:)", "option_re": "(?<=[A-Z]\\.[ ]{0,})[\\s\\S]+?(?=\\n)", "answer_true_re": "(?<=正确答案: )[A-Z]+(?=:)", "analysis_re": "" }
let rules_default_6 = { "wrap_re": "(?<=\\d+\\. )\\(((单选题)|(A型选择题))\\)[\\s\\S]+?(?=\\d+\\. \\(((单选题)|(A型选择题))\\))", "type_code_input_re": "1", "type_re": "@其它题型", "q_re": "(? <=\\(((单选题)|(A型选择题))\\))[\\s\\S]+?(?=A\\.)< /div>", "options_wrap_re": "A\\.[\\s\\S]+?(?=我的答案:)", "option_re": "(?<=[A-Z]\\.[ ]{0,})[\\s\\S]+?(?=\\n)", "answer_true_re": "(?<=正确答案: )[A-Z]+(?=:)", "analysis_re": "" }


g_rules_default.push(rules_default_1, rules_default_2, rules_default_3, rules_default_4, rules_default_5, rules_default_6)






function openMultipleUrls() {
    const url = "https://regex101.com/";
    for (let i = 0; i < 3; i++) {
        window.open(url, '_blank');
    }
}







document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementsByTagName('body')[0];

    // 阻止默认行为（防止文件打开）
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // 添加拖动事件监听器
    dropArea.addEventListener('dragenter', highlight, false);
    // dropArea.addEventListener('dragover', highlight, false);
    dropArea.addEventListener('dragend', unhighlight, false);
    // dropArea.addEventListener('dragleave', unhighlight, false);
    dropArea.addEventListener('drop', handleDrop, false);

    function highlight(e) {
        dropArea.classList.add('drag_highlight');
        console.info("取消拖动状态调用：");
        console.info("unhighlight()");
    }

    function unhighlight(e) {
        console.log("unhighlight");
        dropArea.classList.remove('drag_highlight');
    }

    // 处理文件拖动
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        handleFiles(files);
        unhighlight(e)
    }

    function handleFiles(files) {
        ([...files]).forEach(readFile);
    }

    function readFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            try {
                const json = JSON.parse(fileContent);
                if (json.hasOwnProperty("rules")) {
                    // 全部
                    input_all(false, json)
                } else if (json.hasOwnProperty("wrap_re")) {
                    // 规则     
                    input_rules(false, json)
                }
                console.log('JSON 内容:', json);
                // 在这里处理 JSON 数据
            } catch (error) {
                console.error('文件内容不是有效的 JSON:', error);
            }
        };
        reader.readAsText(file);
        console.log('文件名:', file.name);
    }
});