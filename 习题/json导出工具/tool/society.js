g_index = 0
g_json = {}

var c_b_debounce = debounce(c_b, 300)
let c = document.getElementById("c")
c.addEventListener("input", c_b_debounce)

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

let verify = document.getElementById("verify")
verify.addEventListener("click", verify_fun)
function verify_fun(flag = true) {
    // console.log(g_json);
    if (JSON.stringify(g_json) == "{}") {
        return
    }
    // console.log(flag,!flag);
    if (flag) {
        // console.log(g_json[g_index]["verify"], !g_json[g_index]["verify"]);
        g_json[g_index]["verify"] = !g_json[g_index]["verify"]
        g_json[g_index]["rates"] = []
        if (g_json[g_index]["verify"]) {
            rate_input_fun()
        } else {

        }
    }
    let verify = document.getElementById("verify")
    let sheet_div = document.getElementsByClassName("sheet_div")[g_index]

    // console.log(g_json[g_index],g_json[g_index]["verify"]);
    if (g_json[g_index]["verify"]) {
        verify.classList.add("verify_checked")
        sheet_div.classList.add("sheet_div_checked")
    } else {
        verify.classList.remove("verify_checked")
        sheet_div.classList.remove("sheet_div_checked")
    }

}
function rate_input_fun() {
    let rate_input = document.getElementsByClassName("rate-input")
    for (let i = 0; i < rate_input.length; i++) {
        let each = rate_input[i].value
        g_json[g_index]["rates"].push(each)
    }

}

function sheet_go() {
    var json = g_json[g_index]
    let c = document.getElementById("c")
    c.value = json.options.length

    c_b()
    let q = document.getElementById("q")
    q.value = json.question
    let c_input = document.getElementsByClassName("c-input")
    for (const index in c_input) {
        if (typeof index == "number") {
            continue
        }
        c_input[index].value = json.options[index]
    }
    // console.log(json["rates"], json["rates"].length);
    if (json["rates"].length != 0) {
        let rate_input = document.getElementsByClassName("rate-input")
        for (let j = 0; j < json["rates"].length; j++) {
            rate_input[j].value = json["rates"][j]
        }
        text()
    }else{
        console.log("百分率为空");
    }
    let current_num = document.getElementById("current_num")
    current_num.innerText = g_index + 1 + "/" + g_json.length + "个"

}
function paste_json_up_fun() {
    if (g_index == 0) { return }
    g_index -= 1
    sheet_go()
    verify_fun(false)
}
function paste_json_down_fun() {

    if (g_index == g_json.length - 1) { return }
    g_index += 1
    sheet_go()
    verify_fun(false)
}

async function paste_json_fun() {
    g_index = 0
    g_json = {}
    const text = await navigator.clipboard.readText();
    g_json = JSON.parse(text)
    g_json.forEach((e) => {
        e["verify"] = false
        e["rates"] = []
    })
    create_sheet(g_json)
    var json = g_json[g_index]
    let c = document.getElementById("c")
    c.value = json.options.length
    c_b()
    let q = document.getElementById("q")
    q.value = json.question
    let c_input = document.getElementsByClassName("c-input")
    for (const index in c_input) {
        if (typeof index == "number") {
            continue
        }
        c_input[index].value = json.options[index]
    }
    let current_num = document.getElementById("current_num")
    current_num.innerText = g_index + 1 + "/" + g_json.length + "个"
    // let c_div = document.getElementById("c-div")
}
function create_sheet(json) {
    let sheet = document.getElementById("sheet")
    sheet.innerHTML = ""
    for (let i = 0; i < json.length; i++) {
        let sheet_div = document.createElement("div")
        sheet_div.className = "sheet_div"
        sheet_div.innerText = i + 1
        sheet.appendChild(sheet_div)
    }
}

let sheet = document.getElementById("sheet")
sheet.addEventListener("click", sheet_fun)
function sheet_fun(event) {
    // console.log(event, event.target);
    let ele = event.target
    if (!ele.classList.contains("sheet_div")) {
        return
    }
    g_index = ele.innerText - 1
    sheet_go()
    verify_fun(false)
}






async function paste_fun() {
    const text = await navigator.clipboard.readText();
    var json = str2json(text)
    let c = document.getElementById("c")
    c.value = json.options.length
    c_b()
    let q = document.getElementById("q")
    q.value = json.question
    let c_input = document.getElementsByClassName("c-input")
    for (const index in c_input) {
        if (typeof index == "number") {
            continue
        }
        c_input[index].value = json.options[index]
    }
    // let c_div = document.getElementById("c-div")

}
function str2json(str) {
    let json = {
        "question": "",
        "options": []
    }
    let regQ = new RegExp("(?<=\\d+\\. )[\\s\\S]+?(?=\\n)", "mg")
    let regC = new RegExp("(?<=[A-Z]\\. )[\\s\\S]+?(?=\\n)", "mg")
    str = str + "\n"
    let question = str.match(regQ)
    let options = str.match(regC)
    console.log(regQ, question)
    console.log(regC, options)
    if (question != null) {
        json.question = question[0].replace(/\n/g, "")
    }
    if (options != null) {
        options.forEach(element => {
            json.options.push(element.replace(/\n/g, "")
            )
        });
    }
    return json
}



// 获取页面上所有的input元素
let centre = document.getElementById("centre")
const inputs = centre.querySelectorAll('input');

// 为每个input元素添加监听器
inputs.forEach((input) => {
    if (input.type != "submit"){
        input.addEventListener('input', text);
    }

});
// 获取页面上所有的button元素
const buttons = centre.querySelectorAll('button');

// 为每个button元素添加监听器
buttons.forEach((button) => {
    button.addEventListener('click', text);
});
function c_clear() {
    let c = document.getElementById('c');
    c.value = '';
    var q_div = document.getElementById("q-div")
    q_div.innerHTML = ""
    var ans = document.getElementById("a-div")
    ans.innerHTML = ""
}

function c_b() {
    // var q_and_c = document.getElementById("main")
    var q_div = document.getElementById("q-div")
    q_div.innerHTML = ""
    var ans = document.getElementById("a-div")
    ans.innerHTML = ""
    var c = document.getElementById("c").value
    if (1 <= c && c <= 100) {
        if (c != "") {
            let q = document.createElement("input")
            q.id = "q"
            q_div.append("问题  ：")
            q_div.append(q)
        }

        let a_div = document.getElementById("a-div")
        for (let i = 1; i <= c; i++) {
            let c_div = document.createElement("div")
            c_div.className = "c-div"
            let c_order = document.createElement("span")
            let c_input = document.createElement("input")
            c_input.className = "c-input"
            c_input.id = "c-input" + i
            let rate_input = document.createElement("input")
            c_input.className = "c-input " + "c-input" + i
            rate_input.className = "rate-input " + "rate-input" + i
            rate_input.id = "rate-input" + i

            c_order.append("选项" + i + ": ")
            c_div.append(c_order)
            c_div.append(c_input)
            c_div.append("百分率：")
            c_div.append(rate_input)
            c_div.append("%")
            a_div.append(c_div)

        }
        let result = document.getElementById("result")
        result.innerHTML = ""
    } else {
        c_clear()
        swal({
            icon: "error",
            toast: true,
            position: 'top-end',
            timer: 1000,
            title: '输入范围：1<=n<=100',

        })


    }
}

function copy_text() {
    text()
    let result = document.getElementById("result").innerHTML
    // result.select()
    // result.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(result)

}
function copy_text_all() {
    text_all()
    let result = document.getElementById("result").innerHTML
    // result.select()
    // result.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(result)

}
function c_choice() {
    let c_input = document.getElementsByClassName("c-input")
    for (let i = 0; i < c_input.length; i++) {
        let c_input_each = document.getElementsByClassName("c-input")[i]
        c_input_each.value = ""

    }

}

function c_rate() {
    let rate_input = document.getElementsByClassName("rate-input")
    for (let i = 0; i < rate_input.length; i++) {
        let rate_input_each = document.getElementsByClassName("rate-input")[i]
        rate_input_each.value = ""

    }
}

function c_ans() {
    let c_input = document.getElementsByClassName("c-input")
    let rate_input = document.getElementsByClassName("rate-input")

    for (let i = 0; i < c_input.length; i++) {
        // 问题
        let c_input_each = document.getElementsByClassName("c-input")[i]
        let rate_input_each = document.getElementsByClassName("rate-input")[i]
        c_input_each.value = ""
        rate_input_each.value = ""
        // let c_input_each = document.getElementsByClassName("c-input")[i - 1].value
        // c_input_each = ""
        // 不行
    }

}

function c_all() {
    let c = document.getElementById("c")
    let floor = document.getElementById("floor")
    let dot_floor = document.getElementById("dot-floor")
    let sum_input = document.getElementById("sum-input")
    // let q = document.getElementById("q")
    let q_div = document.getElementById("q-div")
    let ans = document.getElementById("a-div")
    let result = document.getElementById("result")
    ans.innerHTML = ""
    result.innerHTML = ""
    // q.value = ""
    q_div.innerHTML = ""
    c.value = ""
    floor.value = "10"
    dot_floor.value = "2"
    sum_input.value = "100"
}
function back_ex() {
    let back = document.getElementById("ex")
    let back_c = document.getElementById("ex-c")
    back.value = "关于”${q}“问题的回答："
    back_c.value = "${r}%的人选择${c}"

}
function random(time = 150) {
    let rate_input = document.getElementsByClassName("rate-input")
    let num = document.getElementsByClassName("c-input").length
    let floor = document.getElementById("floor").value
    let dot_floor = document.getElementById("dot-floor").value
    var sum = Number(document.getElementById("sum-input").value)
    let sum_input = sum
    var average = (sum / num).toFixed(dot_floor)
    function random_greater_0() {
        if (Number(average) >= (Number(floor))) {
            // console.log("0")
            return Number((Number(average) + Number((((Math.random() - 0.5) * 2) * floor))).toFixed(dot_floor))

        } else {
            // console.log("1")
            return (Number(average) + Number(floor)) * Math.random()

        }
    }
    function for_num(num, sum) {
        for (let i = 0; i < num - 1; i++) {
            // let sum = 1
            let rate_input_each = document.getElementsByClassName("rate-input")[i]
            let r = random_greater_0()
            // console.log(r)
            rate_input_each.value = r.toFixed(dot_floor)
            sum = (sum - r).toFixed(dot_floor)
        }
        return sum
    }
    sum = for_num(num, sum)
    let sum2 = 0
    for (let i = 0; i < num - 1; i++) {
        let rate_input_each = document.getElementsByClassName("rate-input")[i]
        sum2 = Number(sum2) + Number(rate_input_each.value)
    }

    if (sum < 0) {
        console.log("正在重新生成" + (151 - time) + "次")
        time = time - 1
        if (time > 0) {
            // console.log(time)
            random(time)

        }

    } else {
        let rate_input_each = document.getElementsByClassName("rate-input")[num - 1]
        rate_input_each.value = (Number(sum_input - Number(sum2.toFixed(dot_floor)))).toFixed(dot_floor)
    }
    sum_button()
    save_rate()

}

function save_rate() {
    let rate_input = document.getElementsByClassName('rate-input')
    // console.log(rate_input);
    for(let i=0;i<rate_input.length;i++){

        g_json[g_index]["rates"][i] = rate_input[i].value
    }




}
function random_blank(time = 150) {
    let rate_input = document.getElementsByClassName("rate-input")
    let num = document.getElementsByClassName("c-input").length
    let floor = document.getElementById("floor").value
    let dot_floor = document.getElementById("dot-floor").value
    let sum = Number(document.getElementById("sum-input").value)
    let sum_input = sum
    let sum0 = 0
    let sum1 = 0
    var average = (sum / num).toFixed(dot_floor)
    let flag = "no blank"
    let f = 1
    sum0 = []
    sum1 = []
    arr0 = []
    arr1 = []
    for (let i = 0; i < num; i++) {
        let rate_input_each = document.getElementsByClassName("rate-input")[i]
        if (rate_input_each.value != "") {
            let rate_input_each_value = Number(rate_input_each.value).toFixed(dot_floor)
            sum0.push((Number(rate_input_each_value)))
            sum = sum - Number(rate_input_each_value)
            arr0.push(i)
            // console.log(sum0, sum)
        } else {
            arr1.push(i)
        }
    }
    function random_greater_0() {
        if (Number(average) >= (Number(floor))) {
            return Number((Number(average) + Number((((Math.random() - 0.5) * 2) * floor))).toFixed(dot_floor))
        } else {
            return (Number(average) + Number(dot_floor)) * Math.random()
        }
    }
    for (let i = 0; i < arr1.length - 1; i++) {
        if (arr1.length == 0) {
            break
        }
        let rate_input_each = document.getElementsByClassName("rate-input")[arr1[i]]
        rate_input_each.value = Number((Number(average) + Number((((Math.random() - 0.5) * 2) * floor))).toFixed(dot_floor))
        let time = 0
        if (rate_input_each.value > 0 && time < 50) {
            rate_input_each.value = random_greater_0().toFixed(dot_floor)
            sum = sum - Number(rate_input_each.value)
            sum1.push((Number(rate_input_each.value)))
            time = time + 1
        } else {
            rate_input_each.value = "生成失败"
            rate_input_each.style.color = "red"
        }
    }
    if (arr1.length != 0) {
        if ((Number(sum_input - sum).toFixed(dot_floor)) < 0) {
            console.log("正在重新生成" + (151 - time) + "次")
            time = time - 1
            random_blank(time)
        } else {
            document.getElementsByClassName("rate-input")[arr1[arr1.length - 1]].value = (sum.toFixed(dot_floor))
            sum_button()
        }
    }


}

function count() {

    let rate_input = document.getElementsByClassName("rate-input")
    let num = document.getElementsByClassName("c-input").length
    let dot_floor = document.getElementById("dot-floor").value
    let sum = Number(document.getElementById("sum-input").value)
    let flag = "no blank"
    for (let i = 0; i < num; i++) {
        let rate_input_each = document.getElementsByClassName("rate-input")[i]
        if (rate_input_each.value != "") {
            let rate_input_each_value = Number(rate_input_each.value).toFixed(dot_floor)
            rate_input_each.value = rate_input_each_value
            sum = (sum - Number(rate_input_each_value)).toFixed(dot_floor)
        } else {
            flag = i
        }
    }
    if (flag != "no blank") {
        document.getElementsByClassName("rate-input")[flag].value = sum
    }

    sum_button()
}

function sum_button() {
    let dot_floor = document.getElementById("dot-floor").value
    let sum_input = document.getElementById("sum-input").value
    let count_result = document.getElementById("count-result")
    let rate_input = document.getElementsByClassName("rate-input")
    let num = document.getElementsByClassName("c-input").length
    let sum = 0
    for (let i = 0; i < num; i++) {
        let rate_input_each = document.getElementsByClassName("rate-input")[i]
        let rate_input_each_value = Number(rate_input_each.value)
        sum = Number((sum + rate_input_each_value).toFixed(dot_floor))
    }
    if (sum == sum_input) {
        count_result.innerHTML = sum + "%"
    } else {
        count_result.innerHTML = "生成失败"
        count_result.style.color = "red"
    }
}

function text() {
    var result_end = ""
    let result = document.getElementById("result")
    let ex = document.getElementById("ex").value
    let ex_c = document.getElementById("ex-c").value
    if (document.getElementById("q") == null || document.getElementById("q").value == "") {
        result.innerText = "问题内容缺失！"
        return
    } else {
        var q = document.getElementById("q").value

    }
    result_end = ex.replace("${q}", q)
    let c_div = document.getElementsByClassName("c-div")
    for (let i = 0; i < c_div.length; i++) {
        let c_input_value = c_div[i].getElementsByClassName("c-input")[0].value
        let rate_input_value = c_div[i].getElementsByClassName("rate-input")[0].value
        result_end = result_end + ex_c.replace("${r}", rate_input_value).replace("${c}", c_input_value) + "，"
    }
    result_end = result_end.slice(0, -1) + "。"
    result.innerText = g_index + 1 + "." + result_end
    // copy_text()
}
function text_all() {
    var result_end = ""
    let result = document.getElementById("result")
    let ex = document.getElementById("ex").value
    let ex_c = document.getElementById("ex-c").value
    if (JSON.stringify(g_json) == "{}") {
        result.innerText = "json内容缺失！"
        return
    }

    // let c_div = document.getElementsByClassName("c-div")
    for (let i = 0; i < g_json.length; i++) {
        let each = g_json[i]
        // console.log(each);
        let result_end_each = ""
        result_end_each = ex.replace("${q}", each["question"])
        for (let j = 0; j < each["options"].length; j++) {
            let option_each = each["options"][j]
            let rate_each = each["rates"][j]
            result_end_each = result_end_each + ex_c.replace("${r}", rate_each).replace("${c}", option_each) + "，"
        }
        result_end_each = i + 1 + "." + result_end_each.slice(0, -1) + "。\n"
        result_end += result_end_each
    }
    result.innerText = result_end
    // copy_text()
}