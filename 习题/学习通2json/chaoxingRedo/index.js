

g_open_url = "https://xn--gmqq3isro3y3d.icu/%E4%B9%A0%E9%A2%98/exercise.html?extension"

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


class Json_template {
    constructor(questions, options_arr, type = [], type_code = null, answers = [], answers_matching_index = [], analysis = []) {
        this.questions = questions;
        this.options = options_arr;
        this.type = type;
        this.type_code = type_code;
        this.answers = answers;
        this.answers_matching_index = answers_matching_index;
        this.analysis = analysis;

    }
}

class type_code_2_type {
    constructor(type_code) {
        this.type_code = type_code
        this.type = ["单选题", "多选题", "判断题", "填空题", "简答题", "自定义"][type_code + 1]
    }

    // let code_arr = ["单选题", "多选题", "判断题", "填空题", "简答题", "自定义"]

}

let a = {
    "questions": [
        "流行性脑脊髓膜炎的病变性质属于: （ ）"
    ],
    "type": [
        "单选题"
    ],
    "type_code": "1",
    "options": [
        "变质性炎",
        "渗出性炎",
        "增生性炎",
        "肉芽肿性炎",
        "化脓性炎"
    ],
    "answers": [
        "E"
    ],
    "analysis": [],
    "answers_matching_rate": [
        "100%"
    ],
    "answers_matching_index": [
        4
    ]
}



function get_type(wrap) {
    let type_arr = ["单选题", "多选题", "判断题", "填空题", "简答题", "其它"];
    // let type_arr = ["A型选择题", "X型选择题", "判断题", "填空题", "简答题", "其它"];
    let type = "";
    let type_code = 1; // 初始化类型代码，-1表示未找到匹配类型

    if (wrap.innerText) {
        // 遍历type_arr数组，检查wrap.innerText是否包含对应类型的标识
        for (let i = 0; i < type_arr.length; i++) {
            if (wrap.innerText.includes(type_arr[i])) {
                type = type_arr[i];
                type_code = i + 1; // 假设类型代码为在数组中的索引
                break; // 找到匹配的类型后退出循环
            }
        }
    }

    // 如果找到类型，则返回类型和类型代码，否则返回null或其他表示未找到的值
    if (type_code !== -1) {
        return [type, type_code];
    } else {
        console.error(wrap, wrap.innerText, type_arr);
        return null; // 或者返回[null, null]或其它表示未找到的方式
    }
}

// TODO: 如果没有找到就报错
function main() {
    // 全局变量
    let json = {
        "head": {
            "version": "1.1.0",
            "author": "听雨荷",
            "course": "学习通",
            "filename": "",
            "type_all_num": -1,
            // "type_2_num": -1,
            "time": "",
            "id": ""
        },
        "body": [
        ]
    }
    let title = ""
    if (document.getElementsByClassName("mark_title")[0]) {
        title = document.getElementsByClassName("mark_title")[0].innerText
    }

    json["head"]["filename"] = title
    let divQuestion = document.getElementsByClassName("mark_table padTop60 ans-cc fontLabel")[0]
    // console.log(divQuestion);
    let wraps = divQuestion.getElementsByClassName("mark_item")
    // 不同题型的包裹
    for (let h = 0; h < wraps.length; h++) {
        let wraps_each = wraps[h]
        // 单个题目的包裹
        let wrap = wraps_each.getElementsByClassName("marBom60 questionLi singleQuesId")
        let alert_time=1
        for (let i = 0; i < wrap.length; i++) {
            let questions = []
            let type = []
            let type_code = "-1"
            let options_arr = []
            let answers = []
            let answers_matching_index = []

            let wrap_each = wrap[i]
            // console.log("wrap_each", wrap_each);
            questions = wrap_each.getElementsByClassName("mark_name colorDeep")[0].innerText.replace(/\d+\. /gm, "").replace(/\(.*?题\)/, "")
            if (questions == null) {
                console.warn(wrap_each, "questions:null");
                continue
            }

            if (get_type(wrap_each)==null) {
                if (alert_time==1){
                    alert_time=0
                    alert("有题目类型不匹配")
                }

                continue
            }
            [type, type_code] = get_type(wrap_each)
            if (type_code == "1" || type_code == "2") {
                let options_wrap = wrap_each.getElementsByClassName("mark_letter colorDeep")[0].getElementsByTagName("li")
                // console.log(questions, wrap_each.getElementsByClassName("mark_letter colorDeep")[0].getElementsByTagName("li"), options_wrap);
                for (let j = 0; j < options_wrap.length; j++) {
                    let option = options_wrap[j].innerText.replace(/[A-Z]/, "").replace(/./, "").replace(/\n/, "")
                    options_arr.push(option)
                }
                // console.log(wrap_each.getElementsByClassName("mark_key clearfix"));
                let answers_wrap = wrap_each.getElementsByClassName("mark_answer")[0]
                console.log(answers_wrap.getElementsByClassName("mark_key clearfix")[0], answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl"));
                if (answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl").length != 0) {

                    answers = answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl")[0].innerText.replace("正确答案:", "")

                    let answers_char_arr = answers.match(/[A-Z]/gm)
                    for (let h = 0; h < answers_char_arr.length; h++) {
                        let answers_char = answers_char_arr[h]
                        answers_matching_index.push(answers_char.charCodeAt(0) - 65)
                    }
                    console.log("answers", answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl"), answers, answers_char_arr, answers_matching_index);
                } else {
                    console.warn(wrap_each, answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl"), "没有获取到正确答案,尝试匹配我的答案");
                    if (answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorDeep marginRight40 fl").length != 0) {
                        answers = answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorDeep marginRight40 fl")[0].innerText.replace("正确答案:", "")

                        let answers_char_arr = answers.match(/[A-Z]/gm)
                        for (let h = 0; h < answers_char_arr.length; h++) {
                            let answers_char = answers_char_arr[h]
                            answers_matching_index.push(answers_char.charCodeAt(0) - 65)
                        }
                        console.log("answers", answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorDeep marginRight40 fl"), answers, answers_char_arr, answers_matching_index);
                    } else {
                        console.warn(wrap_each, answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorDeep marginRight40 fl"), "没有获取到我的答案");
                    }
                }




            } else if (type_code == "3") {
                options_arr = [
                    "错误",
                    "正确"
                ]
                let answers_wrap = wrap_each.getElementsByClassName("mark_answer")[0]
                if (answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl").length != 0) {

                    answers = answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl")[0].innerText.replace("正确答案", "")
                    if (answers.match(/[(对)|(正确)]/)) {
                        answers_matching_index[0] = 1
                    } else {
                        answers_matching_index[0] = 0
                    }

                    console.log("answers", answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl"), answers, answers_matching_index);
                } else {
                    console.warn(wrap_each, answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl"), "没有获取到正确答案");

                    if (answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorDeep marginRight40 fl").length != 0) {
                        answers = answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorDeep marginRight40 fl")[0].innerText.replace("正确答案:", "")

                        if (answers.match(/[(对)|(正确)]/)) {
                            answers_matching_index[0] = 1
                        } else {
                            answers_matching_index[0] = 0
                        }

                        // console.log("answers", answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorDeep marginRight40 fl"), answers, answers_char_arr, answers_matching_index);
                    } else {
                        console.warn(wrap_each, answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorDeep marginRight40 fl"), "没有获取到我的答案");
                    }
                }

                // continue
            } else if (type_code == "4" || type_code == "5") {
                let answers_wrap = wrap_each.getElementsByClassName("mark_answer")[0]
                if (answers_wrap.getElementsByClassName("mark_fill colorGreen")[0].getElementsByTagName("dd").length != 0) {

                    answers_arr = answers_wrap.getElementsByClassName("mark_fill colorGreen")[0].getElementsByTagName("dd")
                    for (let q = 0; q < answers_arr.length; q++) {
                        answers.push(answers_arr[q].innerText.replace(/\n/gm, "").replace(/\(\d+\)/gm, ""))
                    }


                    console.log("answers", answers_wrap.getElementsByClassName("mark_fill colorGreen")[0].getElementsByTagName("dd"), answers);
                } else {
                    console.warn(wrap_each, answers_wrap.getElementsByClassName("mark_fill colorGreen")[0].getElementsByTagName("dd"), "没有获取到正确答案");
                }

            }



            let json_each = new Json_template(questions, options_arr, type, type_code, answers, answers_matching_index)
            // console.log(json_each);
            json["body"].push(json_each)
        }
    }

    var time = new Date().format("yy年MM月dd日hh小时mm分ss秒")
    json["head"]["time"] = time
    json["head"]["id"] = 'id-' + new Date().getTime().toString(36) + '-' + Math.random().toString(36).substr(2, 9);

    json["head"]["type_all_num"] = json["body"].length

    document.getElementById("wrap_num").innerText = "共" + json["body"].length + "个题目"
    document.getElementById("wrap_num").style.color = "green"
    // console.log(wrap);

    let json_str = JSON.stringify(json)


    console.log(json_str);

    return json_str
    // alert(json)

}





let single_output = document.getElementById("single_output")
single_output.addEventListener("click", single_output_fun)
function single_output_fun() {
    try {
        let json_str = main()
        navigator.clipboard.writeText(json_str)
    } catch (error) {
        alert("油猴脚本chaoxingRedo的通知：脚本调用主函数（作业题目重做功能）出错，反馈后关闭脚本，其它功能不知道能不能用！")
        return
    }
    alert("成功！")
}


let single_download = document.getElementById("single_download")
single_download.addEventListener("click", single_download_fun)
function single_download_fun() {
    try {
        var json = main()
    } catch (error) {
        alert("油猴脚本chaoxingRedo的通知：脚本调用主函数（作业题目重做功能）出错，反馈后关闭脚本，其它功能不知道能不能用！")
        return
    }
    let title = document.querySelector(".borderBom.padBom20.detailsHead h2.mark_title").innerText
    handleDownload(json, title)
}

function handleDownload(content, name = "测试数据") {
    let download = document.createElement("a")
    download.style.display = 'block'
    download.download = name + '.json';
    var blob = new Blob([content], { type: "text/json" });
    download.href = URL.createObjectURL(blob);
    download.click()
}



let preview = document.getElementById("preview")
preview.addEventListener("click", preview_fun)
function preview_fun() {


    try {
        var data = main()
    } catch (error) {
        alert("油猴脚本chaoxingRedo的通知：脚本调用主函数（作业题目重做功能）出错，反馈后关闭脚本，其它功能不知道能不能用！")
        console.error(error)
        return
    }
    let new_window_preview = window.open(g_open_url)
    console.log(data);

    var intetval = setInterval(() => { new_window_preview.postMessage(data, "*"), console.log("发送消息"); }, 300)

    window.addEventListener("message", (event) => {
        if (event.data == "1Med is OK!") {

            clearInterval(intetval)
        }
    })

}

let copy_paper = document.getElementById("copy_paper")
copy_paper.addEventListener("click", copy_paper_fun)

function copy_paper_fun() {

    try {
        let chapter = ""
        let work = ""
        let iframe_filter = ""
        let iframe_filter_content = ""
        let chapter_iframes = ""
        let chapter_iframe = ""
        // 作业
        work = document.getElementById("fanyaMarking")
        console.log(work);

        if (work == null) {
            // 章节
            // 他奶奶的，套了3层iframe,服了
            // 第一层
            console.log(document.getElementsByTagName('iframe'));
            let iframes = document.getElementsByTagName('iframe')
            for (let i = 0; i < iframes.length; i++) {
                let iframe = iframes[i]
                if (iframe.id == "iframe") {
                    iframe_filter = iframe
                    console.log(iframe_filter);
                }
                // break
            }
            iframe_filter_content = iframe_filter.contentDocument || iframe_filter.contentWindow.document;
            console.log(iframe_filter_content);

            // 第二层
            chapter_iframes = iframe_filter_content.getElementsByTagName('iframe')
            console.log(chapter_iframes);
            for (let i = 0; i < chapter_iframes.length; i++) {
                let chapter_iframe = chapter_iframes[i]
                if (chapter_iframe.className == "") {
                    iframe_filter = chapter_iframe
                    console.log(chapter_iframe);
                }
                // break
            }
            iframe_filter_content = iframe_filter.contentDocument || iframe_filter.contentWindow.document;

            // 第三层
            chapter_iframes = iframe_filter_content.getElementsByTagName('iframe')
            console.log(chapter_iframes);
            for (let i = 0; i < chapter_iframes.length; i++) {
                let chapter_iframe = chapter_iframes[i]
                if (chapter_iframe.id == "frame_content") {
                    iframe_filter = chapter_iframe
                    console.log(chapter_iframe);
                }
                // break
            }
            iframe_filter_content = iframe_filter.contentDocument || iframe_filter.contentWindow.document;



            chapter = iframe_filter_content.getElementById("RightCon")

            console.log(chapter);
        }


        let result = chapter || work

        navigator.clipboard.writeText(result.innerText)
        alert("复制成功！")
        console.log(result.innerText);
    } catch (error) {
        alert("油猴脚本chaoxingRedo的通知：复制功能错误！")
        console.error(error);
        return
    }
}

/* function iframe_find() {

    // 查找所有的iframe元素
    var iframes = document.getElementsByTagName('iframe');

    // 遍历所有找到的iframe
    for (var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];

        try {
            // 尝试访问iframe的内容文档
            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            // 在这里可以对iframe内容进行操作
            console.log('Iframe content:', iframeDoc.body.innerHTML);

            // 例如，修改iframe内的某个元素
            var targetElement = iframeDoc.getElementById('targetElementId');
            if (targetElement) {
                targetElement.textContent = 'New Content';
            }
        } catch (e) {
            console.error('Error accessing iframe content:', e);
        }
    }
} */

try {
    main()
} catch (error) {

    console.error("主函数错误：", error)
    // alert("油猴脚本chaoxingRedo的通知：脚本调用主函数（作业题目重做功能）出错，反馈后关闭脚本，其它功能不知道能不能用！")
}
console.log("chaoxingRedo启动成功");


// To Do    章节测验在新页面打开