


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
wjx2json()


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
    let title=""
    if (document.getElementsByClassName("mark_title")[0]){
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
            console.log("wrap_each", wrap_each);
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
                if (answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl") .length!=0) {

                    answers = answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl")[0].innerText.replace("正确答案:", "")
                    let answers_char_arr = answers.match(/[A-Z]/gm)
                    for (let h = 0; h < answers_char_arr.length; h++) {
                        let answers_char = answers_char_arr[h]
                        answers_matching_index.push(answers_char.charCodeAt(0) - 65)
                    }
                    console.log("answers", answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl"), answers, answers_char_arr, answers_matching_index);
                } else {
                    console.warn(wrap_each, answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl"), "没有获取到正确答案");
                }


            } else if (type_code == "3") {
                options_arr = [
                    "错误",
                    "正确"
                ]
                let answers_wrap = wrap_each.getElementsByClassName("mark_answer")[0]
                if (answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl") .length!=0) {

                    answers = answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl")[0].innerText.replace("正确答案", "")
                    if (answers.match(/[(对)|(正确)]/)){
                        answers_matching_index[0]=1
                    }else{
                        answers_matching_index[0] = 0
                    }

                    console.log("answers", answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl"), answers, answers_matching_index);
                } else {
                    console.warn(wrap_each, answers_wrap.getElementsByClassName("mark_key clearfix")[0].getElementsByClassName("colorGreen marginRight40 fl"), "没有获取到正确答案");
                }

                // continue
            } else if (type_code == "4" || type_code == "5") {
                let answers_wrap = wrap_each.getElementsByClassName("mark_answer")[0]
                if (answers_wrap.getElementsByClassName("mark_fill colorGreen")[0].getElementsByTagName("dd").length != 0) {

                    answers_arr = answers_wrap.getElementsByClassName("mark_fill colorGreen")[0].getElementsByTagName("dd")
                    for(let q=0;q<answers_arr.length;q++){
                        answers.push(answers_arr[q].innerText.replace(/\n/gm,"").replace(/\(\d+\)/gm,""))
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

    // console.log(wrap);

    let json_str = JSON.stringify(json)
    navigator.clipboard.writeText(json_str)

    console.log(json_str);
    // alert(json)

}






