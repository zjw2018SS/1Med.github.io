


let html_str = `
              <div id="setting">
        <div id="setting_icon_div" draggable="true">
            <svg t="1705244734270" id="setting_icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="3193" width="32" height="32">
                <path
                    d="M482.88 112l-17.28 90.688-20.64 4.512a309.696 309.696 0 0 0-99.776 41.088l-18.688 11.84-73.28-55.04-44.64 44.64 51.904 76.416-11.392 17.76a310.016 310.016 0 0 0-41.568 99.584l-4.8 21.6-90.72 12.896v63.104l90.688 17.312 4.512 20.64a309.984 309.984 0 0 0 41.088 99.776l11.84 18.688-55.04 73.28 44.64 44.64 76.416-51.904 17.76 11.392a310.016 310.016 0 0 0 99.584 41.568l21.6 4.8 12.896 90.72h63.104l17.312-90.688 20.64-4.512a309.984 309.984 0 0 0 99.776-41.088l18.688-11.84 73.28 55.04 44.64-44.64-51.904-76.416 11.392-17.76a310.016 310.016 0 0 0 41.568-99.584l4.8-21.6 90.72-12.896V482.88l-90.688-17.312-4.512-20.64a309.984 309.984 0 0 0-41.088-99.776l-11.84-18.688 55.04-73.28-44.64-44.64-76.416 51.904-17.76-11.392a310.144 310.144 0 0 0-99.584-41.568l-21.6-4.8-12.896-90.72H482.88zM410.56 149.856l19.424-101.856h171.584l14.624 102.624c28 8.064 54.848 19.328 80.128 33.568l85.792-58.304 121.344 121.344-62.272 82.88c14.08 25.408 25.152 52.352 32.96 80.416l101.888 19.424v171.584l-102.624 14.624a373.92 373.92 0 0 1-33.568 80.128l58.304 85.792-121.344 121.344-82.88-62.272c-25.408 14.08-52.352 25.152-80.416 32.96l-19.424 101.888h-171.584l-14.624-102.624a373.92 373.92 0 0 1-80.128-33.568L241.92 898.112l-121.344-121.344 62.272-82.88a373.824 373.824 0 0 1-32.96-80.416L48 594.048v-171.584l102.624-14.624c8.064-27.968 19.328-54.848 33.568-80.128L125.888 241.92l121.344-121.344 82.88 62.272a373.856 373.856 0 0 1 80.416-32.96z"
                    fill="#000000" p-id="3194"></path>
                <path
                    d="M512 704a192 192 0 1 1 0-384 192 192 0 0 1 0 384z m0-64a128 128 0 1 0 0-256 128 128 0 0 0 0 256z"
                    fill="#000000" p-id="3195"></path>
            </svg>
        </div>
        <div id="setting_div" data-setting-show="0" style="transform: scale(0);">
            <div class="setting_item">
                <div class="setting_item_title">1.常规显示</div>
                <div class="toggle_switches_div">
                    正确选项前显示“√”
                    <label class="switch">
                        <input type="checkbox" id="option_before" placeholder="功能"
                            data-option-before-display="0"></input>
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="toggle_switches_div">
                    悬停显示正确答案
                    <label class="switch">
                        <input type="checkbox" id="is_hide_answer_true" placeholder="功能"
                             data-is-hide-answer-true="show"></input>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="toggle_switches_div">
                    沉浸模式
                    <label class="switch">
                        <input type="checkbox" id="is_immerse_setting" placeholder="功能"
                            data-is-immerse-setting="0"></input>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="toggle_switches_div">
                    禁止选择和复制
                    <label class="switch">
                        <input type="checkbox" id="is_copy_setting" placeholder="功能"
                            data-is-copy-setting="0"></input>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="toggle_switches_div">
                    黑暗模式
                    <label class="switch">
                        <input type="checkbox" id="is_dark_setting" placeholder="功能"
                            data-is-dark-setting="0"></input>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            <div class="setting_item">
                <div class="setting_item_title">2.导出</div>
                <div class="toggle_switches_div">
                    答案反转
                    <label class="switch">
                        <input type="checkbox" id="is_reverse_answer_setting" placeholder="功能"
                            data-is-dark-setting="0"></input>
                        <span class="slider"></span>
                    </label>
                </div>
                <div id="output">
                    <div id="wrap_num">共0个题目</div>
                    <div id="single_output">复制</div>
                    <div id="single_download">下载</div>
                    <div id="preview">预览</div>
                </div>
            </div>
            <div class="setting_item">
                <div class="setting_item_title">3.批量导出</div>
                <div class="toggle_switches_div">
                    批量导出开关
                    <label class="switch">
                        <input type="checkbox" id="is_batch_output_setting" placeholder="功能"
                            data-is-dark-setting="0"></input>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        </div>

    </div>
`
let setting_div_wrap = document.createElement("div")

setting_div_wrap.innerHTML = html_str
// console.log(document.getElementsByTagName("body")[0])
document.getElementsByTagName("body")[0].appendChild(setting_div_wrap)


/* var parser = new DOMParser();

let html = parser.parseFromString(html_str, "text/xml").getElementById("setting")
document.getElementsByTagName("body")[0].appendChild(html) */

var style = document.createElement('style');
var theHead = document.head || document.getElementsByTagName('head')[0];
style.appendChild(document.createTextNode('#setting{--light_color:#fff;--font_color:#181818;--bg_color:#f0f0f0;--color:#058dff}#setting.dark{--light_color:#fff;--font_color:#f0f0f0;--bg_color:#181818;--color:#052bff}#setting{position:fixed;top:72px;left:72px;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;font:initial;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:100000}#setting_icon_div{position:absolute;top:0;left:-48px;width:48px;height:48px;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;cursor:move}#setting_icon_div:before{-webkit-box-shadow:0;box-shadow:0;border-radius:84.5px;background:#fff;position:absolute;margin-left:-36px;margin-top:-36px;opacity:.2;height:72px;width:72px;left:50%;top:50%}#setting_icon_div{background-color:var(--light_color);border-radius:50%;-webkit-box-shadow:0 10px 15px -4px rgb(122 165 159 / 65%),inset 0 -3px 4px -1px rgb(185 220 221 / 0),0 -10px 15px -1px rgb(238 254 255 / 0),inset 0 3px 4px -1px rgb(114 145 152 / 27%),inset 0 0 5px 1px rgb(136 178 173 / 40%),inset 0 20px 30px 0 rgb(182 244 237 / 36%);box-shadow:0 10px 15px -4px rgb(122 165 159 / 65%),inset 0 -3px 4px -1px rgb(185 220 221 / 0),0 -10px 15px -1px rgb(238 254 255 / 0),inset 0 3px 4px -1px rgb(114 145 152 / 27%),inset 0 0 5px 1px rgb(136 178 173 / 40%),inset 0 20px 30px 0 rgb(182 244 237 / 36%)}#setting_icon_div:active{-webkit-filter:blur(0.5px);filter:blur(0.5px);-webkit-box-shadow:inset 0 -8px 30px 1px rgb(153 255 247 / 0),0 -10px 15px -1px rgb(174 218 228 / 48%),inset 0 8px 25px 0 rgb(121 156 157 / 73%),inset 0 0 10px 1px rgb(14 53 57 / 49%);box-shadow:inset 0 -8px 30px 1px rgb(153 255 247 / 0),0 -10px 15px -1px rgb(174 218 228 / 48%),inset 0 8px 25px 0 rgb(121 156 157 / 73%),inset 0 0 10px 1px rgb(14 53 57 / 49%)}#setting_div{position:absolute;top:0;left:0;width:350px;padding:15px;border-radius:5%;background-color:var(--bg_color);-webkit-box-shadow:1px 1px 9px 0 rgb(116 174 227 / 45%),-1px -1px 9px 0 rgb(157 214 245 / 40%);box-shadow:1px 1px 9px 0 rgb(116 174 227 / 45%),-1px -1px 9px 0 rgb(157 214 245 / 40%);height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;-webkit-transition:.3s ease-out;-o-transition:.3s ease-out;-moz-transition:.3s ease-out;transition:.3s ease-out;-webkit-transform-origin:0 24px;-moz-transform-origin:0 24px;-ms-transform-origin:0 24px;-o-transform-origin:0 24px;transform-origin:0 24px;-webkit-transform:scale(0);-moz-transform:scale(0);-ms-transform:scale(0);-o-transform:scale(0);transform:scale(0)}.toggle_switches_div{position:relative;margin:5px 0 0 20px}.switch{float:right;font-size:17px;position:relative;display:block;width:50px;height:20px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#fff;-webkit-transition:.4s;-o-transition:.4s;-moz-transition:.4s;transition:.4s;border-radius:30px;border:1px solid #ccc}.slider:before{position:absolute;content:"";height:20px;width:20px;border-radius:16px;left:1px;top:-1px;bottom:0;background-color:white;-webkit-box-shadow:0 2px 5px #999;box-shadow:0 2px 5px #999;-webkit-transition:.4s;-o-transition:.4s;-moz-transition:.4s;transition:.4s}input:checked+.slider{background-color:#5fdd54;border:1px solid transparent}input:checked+.slider:before{-webkit-transform:translateX(29px);-moz-transform:translateX(29px);-ms-transform:translateX(29px);-o-transform:translateX(29px);transform:translateX(29px)}#output{position:relative;margin:5px 0 0 20px;display:flex;flex-direction:row;flex-wrap:wrap}#output>div{margin-right:10px}#single_output,#single_download,#preview{border-radius:5px;border:1px solid black;padding:0 3px;cursor:pointer}.colorGreen.marginRight40.fl{font-size:26px}.colorGreen.marginRight40.fl.hide{filter:blur(10px)}.colorGreen.marginRight40.fl.hide:hover{filter:blur(0)}.mark_table.padTop60.ans-cc.fontLabel{--optionRightDisplay:1;--optionRightDisplay_:none}.option_right::before{position:absolute;left:10px;content:"√";line-height:30px;font-weight:500;font-size:30px;color:#00b86e;opacity:var(--optionRightDisplay);display:var(--optionRightDisplay_)}.marBom60.questionLi.singleQuesId:has(.colorGreen.marginRight40.fl.hide:hover) .option_right::before{display:var(--optionRightDisplay_)}.marBom60.questionLi.singleQuesId:has(.colorGreen.marginRight40.fl.hide) .option_right::before{display:none}.marBom60.questionLi.singleQuesId:has(.colorGreen.marginRight40.fl) .option_right::before{display:var(--optionRightDisplay_)}'));
theHead.appendChild(style);



g_open_url = "https://xn--gmqq3isro3y3d.icu/%E4%B9%A0%E9%A2%98/exercise.html?extension"

// g_open_url = "http://127.0.0.1:5500/%E4%B9%A0%E9%A2%98/exercise.html?extension"





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
// wjx2json()


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
    let type = "";
    let type_code = -1; // 初始化类型代码，-1表示未找到匹配类型

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
        return null; // 或者返回[null, null]或其它表示未找到的方式
    }
}


// TODO: 如果没有找到就报错
function wjx2json() {
    // 全局变量
    let json = {
        "head": {
            "version": "1.1.0",
            "author": "听雨荷",
            "course": "学习通",
            "filename": "",
            "type_all_num": -1,
            "type_2_num": -1,
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

    document.getElementById("wrap_num").innerText = "共" + json["body"].length + "个题目"
    // console.log(wrap);

    let json_str = JSON.stringify(json)
    navigator.clipboard.writeText(json_str)

    console.log(json_str);

    return json_str
    // alert(json)

}



// 设置的逻辑
// 不知道是bug还是什么，js无法通过dataset获取自定义属性，而是通过attributes

/* let setting_icon_div = document.getElementById("setting_icon_div")
// 隐藏与样式逻辑
setting_icon_div.addEventListener("click", function () {
    let setting_div = document.getElementById("setting_div")
    // console.log(setting_div, setting_div.attributes, setting_div.dataset);
    let setting_show = setting_div.attributes["data-setting-show"].value
    // let setting_div_style = setting_div.attributes["style"].value

    if (setting_show == "0") {
        setting_div.attributes["data-setting-show"] = "1"
        // setting_div_style.transform = "scaleY(1)"
        setting_div.attributes["style"].value = "transform: scale(1);"
    } else if (setting_show == "1") {
        setting_div.attributes["data-setting-show"] = "0"
        // setting_div_style.transform = "scaleY(0)"
        setting_div.attributes["style"].value = "transform: scale(0);"
    }
    setting_div.attributes["data-setting-show"].value = 1 - setting_show
    console.log(setting_div, setting_div.attributes, typeof setting_show, setting_show,setting_div.attributes["style"]);
})
 */

// 设置的逻辑

let setting_icon_div = document.getElementById("setting_icon_div")
// 隐藏与样式逻辑
setting_icon_div.addEventListener("click", function () {
    let setting_div = document.getElementById("setting_div")
    // console.log(setting_div, typeof setting_div, setting_div.dataset);
    let setting_show = setting_div.dataset.settingShow
    let setting_div_style = setting_div.style
    if (setting_show == "0") {
        setting_div.dataset.settingShow = "1"
        // setting_div_style.transform = "scaleY(1)"
        setting_div_style.transform = "scale(1)"
    } else if (setting_show == "1") {
        setting_div.dataset.settingShow = "0"
        // setting_div_style.transform = "scaleY(0)"
        setting_div_style.transform = "scale(0)"
    }
})


// pc和手机设置球拖动逻辑
let offsetX, offsetY; // 将 offsetX 和 offsetY 移到共同的作用域

function drag_fun(e) {
    let bar_height = 36;
    let setting_icon_div_width = 48;
    // 与边框的距离
    let distanse = 10
    let setting = document.getElementById("setting")
    let setting_icon_div = document.getElementById("setting_icon_div")
    let setting_div = document.getElementById("setting_div")
    let setting_show = setting_div.dataset.settingShow
    if (setting_show == "0") {
        var _h = window.innerHeight - (setting_icon_div.offsetHeight + distanse)
        var _w = window.innerWidth - (setting_icon_div.offsetWidth + distanse)
    } else if (setting_show == "1") {
        var _h = window.innerHeight - (setting_div.offsetHeight + distanse)
        var _w = window.innerWidth - (setting_div.offsetWidth + setting_icon_div_width + distanse)
    }
    let div_top = e.clientY - offsetY
    let div_left = e.clientX - offsetX
    div_top = Math.min(Math.max(bar_height + distanse, div_top), _h)
    div_left = Math.min(Math.max(distanse, div_left), _w)
    setting.style.top = div_top + "px"
    setting.style.left = div_left + setting_icon_div_width + "px"
}

// PC拖拽逻辑
// let setting_icon_div = document.getElementById("setting_icon_div");
// 变量上面有了
setting_icon_div.addEventListener("dragstart", function (e) {
    offsetX = e.offsetX; // 将 offsetX 和 offsetY 赋值在共同的作用域内
    offsetY = e.offsetY;

    document.addEventListener("dragover", drag_fun)
})

setting_icon_div.addEventListener("dragend", function (e) {
    document.removeEventListener("dragover", drag_fun)
})

// 手机触摸拖动逻辑
let isDragging = false;

setting_icon_div.addEventListener("touchstart", function (e) {
    isDragging = true;
    let touch = e.touches[0];
    offsetX = touch.clientX - setting_icon_div.getBoundingClientRect().left;
    offsetY = touch.clientY - setting_icon_div.getBoundingClientRect().top;
}, { passive: false });

document.addEventListener("touchmove", function (e) {
    if (isDragging) {
        e.preventDefault();
        let touch = e.touches[0];
        let setting = document.getElementById("setting");
        let bar_height = 4;
        let distanse = 4;
        let setting_icon_div_width = 48;
        let setting_div = document.getElementById("setting_div");
        let setting_show = setting_div.dataset.settingShow;
        let _h, _w;

        if (setting_show == "0") {
            _h = window.innerHeight - (setting_icon_div.offsetHeight + distanse);
            _w = window.innerWidth - (setting_icon_div.offsetWidth + distanse);
        } else if (setting_show == "1") {
            _h = window.innerHeight - (setting_div.offsetHeight + distanse);
            _w = window.innerWidth - (setting_div.offsetWidth + setting_icon_div_width + distanse);
        }

        let div_top = touch.clientY - offsetY;
        let div_left = touch.clientX - offsetX;
        div_top = Math.min(Math.max(bar_height + distanse, div_top), _h);
        div_left = Math.min(Math.max(distanse, div_left), _w);
        setting.style.top = div_top + "px";
        setting.style.left = div_left + setting_icon_div_width + "px";
    }
}, { passive: false });

document.addEventListener("touchend", function () {
    isDragging = false;
})


// 答案前显示 √
let divQuestion = document.getElementsByClassName("mark_table padTop60 ans-cc fontLabel")[0]
// console.log(divQuestion);
let wraps = divQuestion.getElementsByClassName("mark_item")
// 不同题型的包裹
/* for (let h = 0; h < wraps.length; h++) {
    let wraps_each = wraps[h]
    // 单个题目的包裹
    let wrap = wraps_each.getElementsByClassName("marBom60 questionLi singleQuesId")
    for (let i = 0; i < wrap.length; i++) {

        let type, type_code
        let wrap_each = wrap[i]
        // console.log("wrap_each", wrap_each);


        [type, type_code] = get_type(wrap_each)
        let answers_matching_index = []
        if (type_code == "1" || type_code == "2") {

            // console.log(wrap_each.getElementsByClassName("mark_key clearfix"));
            let answers_wrap = wrap_each.getElementsByClassName("mark_answer")[0]
            if (answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl").length != 0) {

                if (answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl")[0].innerText.match("正确答案") != null) {
                    console.log("正确答案")
                    answers = answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl")[0].innerText.replace("正确答案:", "")
                } else if (answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl")[0].innerText.match("我的答案") != null) {
                    console.log("我的答案")
                    answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl")[0].innerText.replace("我的答案:", "")

                } else {
                    console.log("答案没有找到")
                }


                console.log(answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl"))
                let answers_char_arr = answers.match(/[A-Z]/gm)
                for (let h = 0; h < answers_char_arr.length; h++) {
                    let answers_char = answers_char_arr[h]
                    answers_matching_index.push(answers_char.charCodeAt(0) - 65)
                }

                let options_wrap = wrap_each.getElementsByClassName("mark_letter colorDeep")[0].getElementsByTagName("li")
                // console.log(questions, wrap_each.getElementsByClassName("mark_letter colorDeep")[0].getElementsByTagName("li"), options_wrap);
                for (let j = 0; j < options_wrap.length; j++) {
                    let option = options_wrap[j]
                    if (j in answers_matching_index) {
                        option.classList.add("option_right")
                    }
                }


            } else {
                console.warn(wrap_each, answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl"), "没有获取到正确答案");
            }


        } else if (type_code == "3") {
            break
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
            }

            // continue
        }
    }
}
 */


let option_before = document.getElementById("option_before")
option_before.addEventListener("click", option_before_fun)
// data - option - before - display
function option_before_fun() {
    let option_before_display = document.getElementById("option_before")
    let wraps = document.querySelector(".mark_table.padTop60.ans-cc.fontLabel")
    if (option_before_display.dataset.optionBeforeDisplay == "0") {
        wraps.style.setProperty("--optionRightDisplay_", "display")
    } else if (option_before_display.dataset.optionBeforeDisplay == "1") {
        wraps.style.setProperty("--optionRightDisplay_", "none")
    }
    option_before_display.dataset.optionBeforeDisplay = 1 - option_before_display.dataset.optionBeforeDisplay




}





let answer_arr = document.getElementsByClassName("colorGreen marginRight40 fl");
for (let i = 0; i < answer_arr.length; i++) {
    // answer_arr[i].style.display = "none"
    answer_arr[i].style.transform = 'scale(1)';
    answer_arr[i].classList.add("show")
}
// console.log("object");
let is_hide_answer_true = document.getElementById("is_hide_answer_true")
is_hide_answer_true.addEventListener("click", is_hide_answer_true_fun)
function is_hide_answer_true_fun() {
    let _is_show = document.getElementById("is_hide_answer_true").dataset.isHideAnswerTrue
    // console.log(_is_show);
    if (_is_show == "show") {
        _is_show = "hide"
        document.getElementById("is_hide_answer_true").dataset.isHideAnswerTrue = "hide"
        let answer_arr = document.getElementsByClassName("colorGreen marginRight40 fl");
        for (let i = 0; i < answer_arr.length; i++) {
            // answer_arr[i].style.display = "none"
            answer_arr[i].classList.remove("show")
            answer_arr[i].classList.add("hide")
        }
    } else if (_is_show == "hide") {
        _is_show = "show"
        document.getElementById("is_hide_answer_true").dataset.isHideAnswerTrue = "show"
        let answer_arr = document.getElementsByClassName("colorGreen marginRight40 fl");
        for (let i = 0; i < answer_arr.length; i++) {
            // answer_arr[i].style.display = "none"
            answer_arr[i].classList.remove("hide")
            answer_arr[i].classList.add("show")
        }
    }


}


// 全屏function
var elem = document.documentElement;
/* 全屏查看 */
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari 和 Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}
/* 关闭全屏 */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari 和 Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}

// 1.4沉浸模式


let is_immerse_setting = document.getElementById("is_immerse_setting")
// console.log(is_immerse_setting);
is_immerse_setting.addEventListener("click", immerse_setting_fun)
// is_immerse_setting.addEventListener("clcik", immerse_setting_fun)

function immerse_setting_fun() {
    let ele = document.getElementById("is_immerse_setting")
    // console.log(ele);
    let is_immerse_setting = ele.dataset.isImmerseSetting
    let subNav = document.querySelector(".subNav")
    if (is_immerse_setting == "0") {
        openFullscreen()
        subNav.style.display = 'none'

    } else if (is_immerse_setting == "1") {
        closeFullscreen()
        subNav.style.display = 'block'
    }
    document.getElementById("is_immerse_setting").dataset.isImmerseSetting = 1 - is_immerse_setting
}


let single_output = document.getElementById("single_output")
single_output.addEventListener("click", single_output_fun)
function single_output_fun() {
    wjx2json()
    alert("成功！")
}


let single_download = document.getElementById("single_download")
single_download.addEventListener("click", single_download_fun)
function single_download_fun() {
    let json = wjx2json()
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

    // let json_str = JSON.stringify(wjx2json())
    // localStorage.setItem("json_str", json_str)
    let new_window_preview = window.open(g_open_url)
    let data = wjx2json()
    console.log(data);
    // setTimeout(() => { new_window_preview.postMessage(data, "http://127.0.0.1:5500") },3000)
    // new_window_preview.postMessage(data, "*")
    // new_window_preview.postMessage(data, "*")

    var intetval = setInterval(() => { new_window_preview.postMessage(data, "*"), console.log("发送消息"); }, 1000)

    window.addEventListener("message", (event) => {
        if (event.data == "1Med is OK!") {

            clearInterval(intetval)
        }
    })
    // console.log(new_window_preview);
}