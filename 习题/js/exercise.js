// 屎包屎，老实了







// id
id = ""
// 全局
json = {}
// 现在
json_now = {}
// 存档
answer_my = []
// 相关资料
relative_json = []
// 背景音乐
bg_music = ""
// 键盘映射
keyboard_fast_map = {
    "A": ["A", "Z", "Q", "1"],
    "B": ["S", "X", "W", "2"],
    "C": ["D", "C", "E", "3"],
    "D": ["F", "V", "R", "4"],
    "E": ["G", "B", "T", "5"],
    "F": ["H", "N", "Y", "6"],
    "G": ["J", "M", "U", "7"],
    "H": ["K", "I", "8"],
    "I": ["L", "O", "9"],
}
// , "is_immerse_setting"
// 设置
setting_config_id_arr = ["option_before", "is_hide_answer_true", "is_copy_setting", "is_dark_setting", "is_keyboard_fast_setting", "is_fast_submit_setting"]

setting_config = JSON.parse(localStorage.getItem("setting_config"))
setting_default_config = {
    "info": {},
    "config": [
        { id: 'option_before', is_active: true, describe: '正确选项前显示√' },
        { id: 'is_hide_answer_true', is_active: true, describe: '悬停显示正确答案' },
        // { id: 'is_immerse_setting', is_active: false, describe: '沉浸模式' },
        { id: 'is_copy_setting', is_active: false, describe: '禁止选择和复制' },
        { id: 'is_dark_setting', is_active: false, describe: '黑暗模式' },
        { id: 'is_keyboard_fast_setting', is_active: false, describe: '键盘代替鼠标' },
        { id: 'is_fast_submit_setting', is_active: false, describe: '速刷模式' },
        { id: 'is_answer_true_display', is_active: false, describe: '仅错题' },
        { id: 'is_favourite_display', is_active: false, describe: '仅收藏' },
        { id: 'is_answer_true_favourite_display', is_active: false, describe: ' 错题+收藏' }
    ]
}
if (setting_config == null || setting_config == "") {
    setting_config = setting_default_config
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

class SavedIo {
    constructor() {
    }
    static savedMethod
    static maxSavedNum = 5
    static saveIntervalId = null

    static setSavedMethod(method) {

        this.savedMethod = method
        // console.log(method, this.savedMethod);
        localStorage.setItem("savedMethod", method)
        // return method
    }
    static getSavedMethod() {
        let method = localStorage.getItem("savedMethod")
        // console.log(typeof method, method, method == null);
        if (method == null || method == "null") {
            method = "manual"
        }
        this.savedMethod = method
        // console.log(method, this.savedMethod);
        SavedIo.setSavedMethod(method)
        return method
    }

    static setSaveInterval() {
        let savedMethod = this.savedMethod
        // console.log(savedMethod);
        if (savedMethod == "timing") {
            this.saveIntervalId = setInterval(() => {
                this.save()
            }, 30 * 1000);
        } else if (this.saveIntervalId != null) {
            clearInterval(this.saveIntervalId)
        }
    }

    static clearAll() {
        localStorage.setItem("saved", null)
    }
    static readerAll = function (saved_key = "saved") {
        let saved_ = localStorage.getItem(saved_key)
        // console.log(1,saved_);
        if (!saved_ || saved_ == null || !isJSON(saved_)) return []
        saved_ = JSON.parse(saved_)
        if (!Array.isArray(saved_)) return []
        // console.log(2, saved_);
        return saved_
    }

    static readById = function (id) {
        let saved_all_arr = this.readerAll()
        if (saved_all_arr.length == 0) return []
        return saved_all_arr.filter(ele => ele.id == id)
    }

    static writeAll = function (saved_all_json) {
        // 判断数量
        let saved_all_json_ = this.writeNum(saved_all_json)

        // 写入
        localStorage.setItem("saved", JSON.stringify(saved_all_json_))
    }

    static writeById = function (saved_json, id) {

        // 清除所有匹配id的存档，返回余下的
        let saved_all_arr = this.readerAll()
        let saved_match_arr = this.readById(id)


        let saved_remain_arr = saved_all_arr.filter((ele) => {
            // console.log(saved_all_arr, ele, ele["id"], saved_match_arr);
            let saved_match_id_arr = saved_match_arr.map((each) => each["id"])
            return !saved_match_id_arr.includes(ele["id"])
            // 匹配id不同的
        })

        // console.log(saved_remain_arr);

        // 拼接  放在前面
        saved_remain_arr.unshift(saved_json)

        // 写入
        this.writeAll(saved_remain_arr)
    }

    static writeNum(saved_all_json) {
        while (saved_all_json.length > this.maxSavedNum) {
            saved_all_json.pop()
        }
        return saved_all_json
    }

    static loadingAnswerMy = function (answer_my) {
        let wraps = document.getElementsByClassName("wrap")
        if (wraps.length != answer_my.length) {
            swal_toast("题目和我的答案数量不同", "error")
        }
        for (let i = 0; i < wraps.length; i++) {

            Answer.load_answer_my(i, answer_my)
        }
    }

    static popup_now_download = function () {
        if (!json || !json.hasOwnProperty("body") || !json_now || json_now["body"].length == 0) {
            swal_toast("数据为空或者异常", "error")
            return
        }
        let title = "未命名"
        if (json["head"].hasOwnProperty("title")) {
            title = json["head"]["title"] || json["head"]["filename"]
        }
        let saved = this.create(json_now, answer_my)

        handleDownload(JSON.stringify(saved), "当前存档_" + title.replace(".json", ""))
    }

    static create = function (json_now, answer_my, id_ = null) {

        try {
            if (id_ == null) {
                id = 'id-' + new Date().getTime().toString(36) + '-' + Math.random().toString(36).substr(2, 9)
            }
            return {
                id: id,
                start_time: new Date().format("yy-MM-dd hh:mm:ss"),
                start_time_raw: new Date().getTime(),
                last_time: new Date().format("yy-MM-dd hh:mm:ss"),
                last_time_raw: new Date().getTime(),
                json_num: json_now["body"].length,
                answer_my: answer_my,
                json: json_now
            }
        } catch (error) {
            swal_toast("存档功能加载失败", "error", error)
            console.error("存档功能加载失败", error);
        }

    }

    static save = function () {
        try {
            // 更新存档
            // 读取旧存档，没有就创建新的
            let old_saved = SavedIo.readById(id)
            // console.log(old_saved);
            if (old_saved.length == 0) {
                swal_toast("没有旧存档，创建新存档", "info")
                // 新的
                let saved_create = SavedIo.create(json_now, answer_my)
                SavedIo.writeById(saved_create, id)
            } else {
                // 更新第一个旧存档
                old_saved[0]["answer_my"] = answer_my
                old_saved[0]["last_time"] = new Date().format("yy-MM-dd hh:mm:ss")
                old_saved[0]["last_time_raw"] = new Date().getTime()
                SavedIo.writeById(old_saved[0], id)
            }
            console.log("存档成功");
            if (this.savedMethod == "manual") {
                swal_toast("存档成功", "success")
            }
        } catch (error) {
            swal_toast("存档失败", "error", "请取消自动存档\n" + error)
            console.error("存档失败", "error", "请取消自动存档\n" + error)
        }

    }
    static popup = function () {

        try {
            let saved = this.readerAll()
            // console.log(saved);

            if (saved.length == 0) {
                swal_toast("没有本地存档", "info")
                // return
            }
            // 当前存档
            // 标题
            let saved_now_title = document.createElement("h3")
            saved_now_title.innerText = "--当前存档--"

            let saved_now_div = document.createElement("div") //包裹
            saved_now_div.id = "saved_now_wrap"

            let saved_now_html = `
                    <div>当前页面存档</div>
                    <div class="saved_now_save" onclick="SavedIo.save()">保存</div>
                    <div class="saved_now_download" onclick="SavedIo.popup_now_download()">下载</div>
                    `
            saved_now_div.innerHTML = saved_now_html

            // 历史存档
            // 标题
            let saved_history_title = document.createElement("h3")
            saved_history_title.innerText = "--本地存档--"

            let saved_history_div = document.createElement("div") //包裹
            saved_history_div.id = "saved_history_div"

            let saved_each_div_html = ` 
            `   //每个
            for (let s = 0; s < saved.length; s++) {
                let saved_each = saved[s]
                let title = "未命名"
                if (saved_each["json"]["head"].hasOwnProperty("title")) {
                    title = saved_each["json"]["head"]["title"]
                    if (title.length >= 16) {
                        // title = title.slice(0, 16) + "..."
                    }
                }
                if (!saved_each.hasOwnProperty("start_time")) {
                    saved_each["start_time"] = "未知时间"
                }
                let saved_time_age = ""
                if (saved_each.hasOwnProperty("last_time_raw") && saved_each["last_time_raw"]) {
                    // console.log(saved_each["last_time_raw"]);
                    saved_time_age = timeAgo(saved_each["last_time_raw"])
                }
                saved_each_div_html += `
            <div class="saved_item_wrap" data-saved-item-index=${s} data-saved-id=${saved[s]["id"]}>

                <div class="saved_left">
                    <div class="saved_top">
                        <div class="saved_title">${title}</div>
                    </div>
                    <div class="saved_bottom">
                        <div class="saved_num">${saved_each["json"]["body"].length}题</div>
                        <div class="saved_time">${saved_each["start_time"].replace(/[年月]/gm, "-").replace(/[日]/gm, " ").replace(/小时/gm, ":").replace(/分/gm, ":").replace(/[(秒]/gm, "")}</div>
                        <div class="saved_time_age">${saved_time_age}</div>
                        </div>
                </div>

                <div class="saved_fun_div">
                    <div class="saved_fun_open" onclick="SavedIo.popup_history_open(this)">打开</div>
                    <div class="saved_fun_download" onclick="SavedIo.popup_history_download(this)">下载</div>
                    <div class="saved_fun_delete" onclick="SavedIo.popup_history_delete(this)">删除</div>
                </div>
            </div>
            `
            }
            saved_history_div.innerHTML = saved_each_div_html

            let saved_wrap = document.createElement("div")
            saved_wrap.id = "saved_wrap"

            // 存档方式
            let saved_method = document.createElement("h3")
            saved_method.innerText = "--存档方式--"

            saved_wrap.append(saved_now_title, saved_now_div, saved_history_title, saved_history_div, saved_method)

            Swal.fire({
                title: `共${saved.length}个本地存档`,
                html: saved_wrap,
                icon: "info",
                input: 'radio',
                inputValue: SavedIo.getSavedMethod(),
                inputOptions: {
                    'auto': '自动存档',
                    'manual': '手动存档',
                    // 定时存档 TODO
                    'timing': '定时存档(30秒)'

                },
                inputValidator: (value) => {
                    if (!value) {
                        return '请选择一个存档方式！';
                    }
                    return null; // 验证通过
                },
                footer: "存档方式改变后所有页面同步改变,并保存在本地.请打开存档后专心完成存档，本站仅提供简单的存档功能，避免多开存档造成的索引错误/存档丢失。",
            }).then((result) => {
                if (result.isConfirmed) {
                    // 与初始化/更新后的比较 更新全局变量

                    if (SavedIo.savedMethod != result.value) {
                        SavedIo.setSavedMethod(result.value);
                        console.info(`存档方式已更新为: ${SavedIo.savedMethod}`)
                        SavedIo.setSaveInterval()
                    }

                }
            });
        } catch (error) {
            console.error("存档弹窗加载失败", error)
            swal_toast("存档弹窗加载失败", "error", error)
        }

    }
    static popup_history_open = function (ele) {
        // let index = index_in_parent(document.getElementById("saved_history_div"), ele.closest(".saved_item_wrap"))
        let id = ele.closest(".saved_item_wrap").dataset.savedId

        let url = window.location.origin + window.location.pathname
        window.open(url + "?saved=" + id)
    }

    static popup_history_download = function (ele) {
        let index = index_in_parent(document.getElementById("saved_history_div"), ele.closest(".saved_item_wrap"))
        let saved_item = SavedIo.readerAll()[index]

        let title = "未命名"

        if (saved_item["json"]["head"].hasOwnProperty("title")) {
            title = saved_item["json"]["head"]["title"]
        }
        handleDownload(JSON.stringify(saved_item), "存档导出_" + title.replace(".json", ""))
    }

    static popup_history_delete = function (ele) {
        // 父元素 saved_wrap
        let saved_wrap = document.getElementById("saved_history_div")
        let index = index_in_parent(saved_wrap, ele.closest(".saved_item_wrap"))

        let saved_ = SavedIo.readerAll()
        saved_ = saved_.slice(0, index).concat(saved_.slice(index + 1));
        saved_wrap.children[index].remove()
        localStorage.setItem("saved", JSON.stringify(saved_))

        /*         Swal.fire({
                    icon: 'info',
                    title: '确定删除吗',
                    text: '如果多开做题页面，可能造成存档丢失，错误，失效',
                }).then((result) => {
                    if (result.isConfirmed) {
        
                    }
                }) */
    }

}

class Answer {
    constructor() {

    }

    static load_answer_my = function (index, answer_my) {
        let wrap = document.getElementsByClassName("wrap")[index]
        let answer_my_each = answer_my[index]

        // 设置答案
        wrap.dataset.answerMy = JSON.stringify(answer_my_each)

        // 选项样式
        answer_my_each.forEach((ele) => {
            wrap.getElementsByClassName("option_code")[ele].classList.add("checked")
        })
        // 答题卡样式
        if (answer_my_each.length != 0) {
            let sheet_li = document.getElementsByClassName("sheet_li")[index]
            sheet_li.classList.add("checked")
        }
    }
    static set_answer_my = function () {

    }

    static reverse_answer_my = function (is_download = false) {

        let json_ = deepCopy(json)
        // console.log(json_);

        for (let i = 0; i < answer_my.length; i++) {
            let answer_my_each = answer_my[i]
            // json_["body"][i]["answers"] = answer_my_each
            json_["body"][i]["answers_matching_index"] = answer_my_each
        }
        if (is_download) {
            let name = json_["head"].hasOwnProperty("title") ? json_["head"]["title"] : "未命名文件"
            handleDownload(JSON.stringify(json_), "我的答案反转_" + name)
        }
    }
}

// 页面加载后设置配置
document.onload = setting_config_fun()
// 配置变化后同步配置
document.getElementById("setting_div").addEventListener("click", setting_config_change_fun)
window.addEventListener("storage", setting_config_change_sync)
// 电梯导航
window.addEventListener("scroll", left_scroll_fun)

// 键盘代替鼠标
window.addEventListener("keydown", keyboard_fast_fun)

// 确认读取json  点击事件
document.getElementById("new_read_json").addEventListener("click", new_reader)

// 读取json文件  输入事件
document.getElementById("file_input").addEventListener("input", read_file)

// 读取文件夹
document.getElementById("dir_input").addEventListener("input", read_dir);

// 是否收藏逻辑
document.getElementById("main").addEventListener("click", is_favourite_fun)

// 乱序与非乱序生成
document.getElementById("unorder_json").addEventListener("click", unorder_json)
document.getElementById("order_json").addEventListener("click", order_json)

// 存档
document.getElementById("main").addEventListener("click", (e) => {

    if (e.target.id == "saved_div") {
        // SavedIo.popup.bind(SavedIo)
        SavedIo.popup()
    }
})

// 滚动进度条
window.addEventListener('scroll', function () {
    var progressBar = document.getElementById('progressBar');
    var scrollPosition = window.scrollY;
    var windowHeight = window.innerHeight;
    var documentHeight = document.documentElement.scrollHeight;

    var progress = (scrollPosition / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = progress + '%';
});

function mergeConfigs(oldConfig, newConfig) {
    const oldConfigIds = new Set(oldConfig.config.map(item => item.id)); // 获取旧配置的 id 集合

    // 遍历新配置
    newConfig.config.forEach(newItem => {
        if (!oldConfigIds.has(newItem.id)) {
            // 如果旧配置中没有该 id，则添加到旧配置中
            oldConfig.config.push(newItem);
        }
    });

    return oldConfig;
}

function localStorage_clear() {
    // localStorage
    localStorage.clear();
}
function localStorage_download() {
    // 创建一个空对象来存储 localStorage 的键值对
    const localStorageData = {};

    // 遍历 localStorage
    for (let i = 0; i < localStorage.length; i++) {
        // 获取键名
        const key = localStorage.key(i);
        // 获取对应的值
        const value = localStorage.getItem(key);
        // 将键值对存入对象
        localStorageData[key] = value;
        // console.log(i, key, value);
    }
    // console.log(localStorageData);
    // 将对象转换为 JSON 格式的字符串
    const jsonData = JSON.stringify(localStorageData, null, 2);

    handleDownload(jsonData, "localStorage下载")
}

function setting_config_fun() {

    //  TODO 修改click（）
    setting_config = mergeConfigs(setting_config, setting_default_config)
    // console.log(setting_config);
    setting_config["config"].forEach((ele, index) => {
        let id = ele["id"]
        let is_active = ele["is_active"]
        if (is_active) {
            // console.log(is_active, document.getElementById(id));
            let e = document.getElementById(id)
            setTimeout(() => {
                e.click()
            }, 1000)
        }

    })

    let isDark = window.matchMedia("(prefers-color-scheme:dark").matches
    if (isDark || isItElevenPM()) {
        let is_dark_setting = document.getElementById("is_dark_setting")
        // console.log(is_dark_setting.checked);
        if (!is_dark_setting.checked) {
            // is_dark_setting.click()
        }

    }
}

function setting_config_change_fun(event) {
    let ele = event.target
    if (setting_config_id_arr.indexOf(ele.id) == -1) {
        return
    }
    if (!isUserClick(event)) {
        return
    }
    console.log("同步配置");
    for (let i = 0; i < setting_config["config"].length; i++) {
        let each = setting_config["config"][i]
        let id = ele.id
        if (each["id"] == id) {
            each["is_active"] = !each["is_active"]
            // console.log(typeof id,id);
            let changed = {
                "id": id,
                "is_active": each["is_active"],
            }
            localStorage.setItem("setting_config_changed", JSON.stringify(changed))
            break
        }
    }
    localStorage.setItem("setting_config", JSON.stringify(setting_config))
}

function setting_config_change_sync(event) {
    if (event.key != "setting_config_changed") {
        return
    }
    let data = JSON.parse(event.newValue)
    let id = data["id"]
    let ele = document.getElementById(id)

    ele.click()
}

function isUserClick(event) {
    if (event.isTrusted) {
        console.log('可能是用户手动点击');
        return true
    } else {
        console.log('可能是代码调用');
        return false
    }
}


function isItElevenPM() {
    // 晚上10点 黑暗模式
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 22 || hour <= 6) {
        return true;
    } else {
        return false;
    }
}


function init() {
    // 1.取消加载页面
    let showbox = document.getElementById('showbox');
    if (showbox) {
        showbox.remove();
    } else {
        console.log('未找到id为showbox的元素');
    }
    // 设置存档方式
    SavedIo.getSavedMethod()
    // 设置存档间隔
    SavedIo.setSaveInterval()
    // 打印开发者调试选项
    console.info("将我的答案逆转为正确答案，参数控制是否下载，1为下载，默认不下载");
    console.info("Answer.reverse_answer_my(1)");
    console.info("清除localStorage");
    console.info("localStorage_clear()");
    console.info("下载localStorage");
    console.info("localStorage_download()");
}



let url = location.search
if (url.match(/\?name=.*&path=.*$/mg)) {
    // 1.服务器拉取
    let xmlhttp = new XMLHttpRequest()
    const queryString = truncateString(url, "?");
    const params = queryString.split('&');
    let name, path;
    params.forEach(param => {
        const [key, value] = param.split('=');
        //   console.log(key, value);
        if (key === '?name') {
            name = decodeURIComponent(value);
        } else if (key === 'path') {
            path = decodeURIComponent(value);
        }
    });
    if (path.match("@")) {
        let path_arr = path.split("@")
        load_path(path_arr, name)
    } else {
        xmlhttp.open("GET", path)
        try {
            xmlhttp.send()
        } catch (error) {
            // init(1)
            Swal.fire({
                icon: 'error',
                title: '网络响应异常',
                text: '但这绝不是你的错误',
            })
        }
        xmlhttp.onload = function () {
            if (xmlhttp.status >= 200 && xmlhttp.status < 400) {
                // 请求成功，解析JSON数据
                if (xmlhttp.responseText != "" && xmlhttp.responseText != [] && xmlhttp.responseText != "[]") {
                    json = JSON.parse(xmlhttp.responseText);
                    json["head"]["title"] = name
                    json2paper(json)
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '请求的json文件内容为空，无法解析！',
                        text: '但这绝不是你的错误',
                    })
                }

            } else {
                Swal.fire({
                    icon: 'error',
                    title: '网络响应异常',
                    text: '但这绝不是你的错误',
                })
            }
        }
    }
} else if (url.match(/\?rewrite=/mg)) {
    // 2.重做
    let json_str = localStorage.getItem("json_str")
    if (json_str) {
        json = JSON.parse(json_str)
        if (json.hasOwnProperty("body") || json["body"] == "null" || json["body"] == "undefined" || json["body"] == "") {
            json2paper(json, "1")
        } else {
        }
    } else {
    }
} else if (url.match(/\?preview/mg)) {
    // 3.预览窗口
    let json_str = localStorage.getItem("json_str")
    if (json_str) {
        json = JSON.parse(json_str)
        if (json.hasOwnProperty("body") || json["body"] == "null" || json["body"] == "undefined" || json["body"] == "") {
            json["head"]["title"] = json["head"]["filename"]
            json2paper(json, "1")
        } else {
        }
    } else {
    }
} else if (url.match(/\?extension/mg)) {
    // 4.浏览器扩展预览
    // 清除local storage
    window.addEventListener("message", chaoxingMessage)

} else if (url.match(/\?saved/mg)) {

    // 5.加载存档
    // 按照索引
    let saved_index = url.match(/(?<=saved=)\d/mg)
    // 按照id
    let saved_id = url.match(/(?<=saved=)id-\w+-\w+/mg)
    // console.log(saved_index, saved_id);
    // 防止覆盖
    let saved_ = SavedIo.readerAll()

    if (saved_.length != 0) {
        if (saved_index != null) {
            console.log(saved_);
            json = saved_[saved_index]["json"]
            json2paper(saved_[saved_index], "1")
        } else if (saved_id != null) {
            let temp = SavedIo.readById(saved_id)
            if (temp.length != 0) {
                let saved__ = temp[0]
                console.log(saved__);
                json = saved__["json"]
                json2paper(saved__, "1")
            } else {
                Swal.fire({
                    title: '存档数据为空',
                    icon: "error",
                    text: '可能是id为"' + saved_id + '"的存档被删除了。',
                })
            }

        } else {
            swal_toast("url查询出错", "error", url)
        }

        SavedIo.loadingAnswerMy(answer_my)
    } else {
        Swal.fire({
            title: '存档数据为空',
            icon: "error",
            text: '可能是存档被删除了。',
        })
    }


} else {
    // 6.本地读取文件
    drop_box_display_fun(1)
    document.getElementById("main").style.display = "none"
}

init()

function chaoxingMessage(event) {
    console.log(event, event.origin, event.source);
    if (!event.origin.match("chaoxing.com")) {
        console.log("不是来自学习通的的消息，排除该消息");
        return
    }
    window.removeEventListener("message", chaoxingMessage)
    event.source.postMessage('1Med is OK!', event.origin)

    let data = event.data
    console.log(data);
    json = JSON.parse(data)
    if (json.hasOwnProperty("body") || json["body"] == "null" || json["body"] == "undefined" || json["body"] == "") {
        json["head"]["title"] = json["head"]["filename"]
        json2paper(json, "1")
    } else {
    }
}

function left_scroll_fun() {
    // 1.移除
    let sheet_li_show = document.getElementsByClassName("sheet_li_show")
    if (sheet_li_show.length != 0) {
        sheet_li_show[0].classList.remove("sheet_li_show")
    }

    // 2.添加
    let wrap = Array.from(document.getElementsByClassName("wrap")).filter(ele => ele.style.display !== "none");
    // console.log(wrap);
    let top = document.documentElement.scrollTop + window.innerHeight / 2
    for (let i = 0; i < wrap.length - 1; i++) {
        // console.log(i, wrap[i].offsetTop, top);

        if ((wrap[i].offsetTop <= top && wrap[i + 1].offsetTop > top)) {

        } else if ((i == 0 && document.documentElement.scrollTop <= 150)) {

        } else if ((i == wrap.length - 2)) {
            i = i + 1
        } else {
            continue
        }

        let index = wrap[i].dataset.index
        let sheet_li = document.getElementsByClassName("sheet_li")
        sheet_li[index].classList.add("sheet_li_show")
        // console.log("目标：", index);
        break;

    }
}

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
            console.error(e, 'error：not a json!!!');
            Swal.fire({
                title: "数据错误",
                text: "json数据错误，或者没有数据" + e,
                icon: "error",

            })
            swal_toast("数据错误", "error", "json数据错误，或者没有数据" + e)
            return false;
        }
    }
    console.error('It is not a string!')
}

async function clip_box_fun() {
    const text = await navigator.clipboard.readText();
    if (isJSON(text)) {
        json = JSON.parse(text)
        json2paper(json)
    } else {
        Swal.fire({
            title: "格式错误",
            text: "仅支持json格式，来源为学习通的油猴脚本,本网站做题总列表页面可见",
            icon: "error",
        })
    }
}

function new_reader() {
    Swal.fire({
        title: "您将失去现在的进度！",
        html: `
        json文件来源：<br>
        1.题目：做题时导出
        <br>
        2.题目：油猴脚本导出 <a href="https://greasyfork.org/zh-CN/scripts/518327-chaoxingredo-%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%9C%AC%E5%9C%B0%E9%87%8D%E5%81%9A%E4%B9%A0%E9%A2%98" target="_blank" rel="noopener noreferrer">点击跳转</a>
        <br>
        3.存档：“存档管理”下载（读取时只能读取单文件）
        `,
        icon: "warning",
        showCancelButton: true,
        /*         confirmButtonColor: '#dc3545', // 红色按钮，表示危险操作
                cancelButtonColor: '#6c757d', // 灰色取消按钮 */
        confirmButtonText: '读取',
        cancelButtonText: '取消',
        footer: "存档=题目+我的答案",
        focusCancel: true, // 默认聚焦取消按钮
    }).then((result) => {
        if (result.isConfirmed) {
            json = {
            }
            clear_old_paper_sheet(1)
            drop_box_display_fun(1)

            removeEventListener_main_click_and_is_submit()

            let output_tool_bar = document.getElementById("output_tool_bar")
            output_tool_bar.style.display = "none"

            addEventListener_main_click_and_is_submit()
        }
    });
}





function read_file(e) {
    let file_name = e.target.files[0].name
    let title = extractBeforeMatch(file_name)
    let file_type = file_name.split('.').slice(-1)[0].toLowerCase();
    if (file_type != "json") {
        Swal.fire({
            title: "只能读取满足本网站格式的json文件",
            html: `
        json文件来源：<br>
        1.题目：做题时导出
        <br>
        2.题目：油猴脚本导出 <a href="https://greasyfork.org/zh-CN/scripts/518327-chaoxingredo-%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%9C%AC%E5%9C%B0%E9%87%8D%E5%81%9A%E4%B9%A0%E9%A2%98" target="_blank" rel="noopener noreferrer">点击跳转</a>
        <br>
        3.存档：“存档管理”下载（读取时只能读取单文件）
        `,
            icon: "error",
        })

        return
    }

    let file = e.target.files[0]
    let file_reader = new FileReader()
    file_reader.readAsText(file)
    file_reader.onload = (event) => {
        let content = event.target.result
        if (isJSON(content)) {
            let json_ = JSON.parse(content)
            if (json_.hasOwnProperty("time") || json_.hasOwnProperty("json")) {
                json = json_["json"]
                json2paper(json_)
                SavedIo.loadingAnswerMy(answer_my)
            } else {
                json = JSON.parse(content)
                if (json["head"].hasOwnProperty("title")) {
                    json["head"]["title"] = title
                }
                json2paper(json)
            }
            // console.log(json);


            e.target.value = ""
            swal_toast("导入成功", "success")
        }
    }
}

function read_dir(dir_input) {
    var json_temp = {
        "head": {},
        "body": []
    };
    let dir = dir_input.target.files;
    var relativePath = dir[0].webkitRelativePath;
    var folderName = relativePath.split("/")[0];

    // 创建一个数组来存储所有文件读取的Promise
    const filePromises = [];

    for (let i = 0; i < dir.length; i++) {
        let file = dir[i];
        let file_name = file.name;
        if (file_name === "path_info.json") {
            continue;
        }
        let file_type = file_name.split('.').slice(-1)[0].toLowerCase();
        if (file_type !== "json") {
            continue;
        }

        // 创建一个Promise来处理文件读取
        const filePromise = new Promise((resolve, reject) => {
            let file_reader = new FileReader();
            file_reader.onload = (event) => {
                resolve(event.target.result);
            };
            file_reader.onerror = (error) => {
                reject(error);
            };
            file_reader.readAsText(file);
        });

        filePromises.push(filePromise);
    }

    // 使用Promise.all等待所有文件读取完成
    Promise.all(filePromises).then((contents) => {
        contents.forEach((content, index) => {
            if (isJSON(content)) {
                let json_each = JSON.parse(content);
                if (json_each && json_each.hasOwnProperty("head") && json_each.hasOwnProperty("body")) {
                    if (index === 0) {
                        json_temp["head"] = json_each["head"];
                    }
                    json_temp["body"].push(...json_each["body"]);
                }
            }
        });

        // 所有文件处理完成后，调用json2paper
        if (Object.keys(json_temp["head"]).length > 0 && json_temp["body"].length > 0) {
            let json = json_temp;
            json["head"]["title"] = folderName;
            json2paper(json);
            // console.log(json);
        }
    }).catch((error) => {
        swal_toast(error, "error")
        console.error('Error reading files:', error);
    });

    // 清空输入框
    dir_input.target.value = "";
}
function timeAgo(timestamp) {
    const now = Date.now(); // 获取当前时间戳
    const diffInSeconds = Math.floor((now - timestamp) / 1000); // 计算时间差（秒）

    if (diffInSeconds < 60) {
        return `${diffInSeconds}秒前`;
    } else if (diffInSeconds < 3600) {
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        return `${diffInMinutes}分钟前`;
    } else if (diffInSeconds < 86400) {
        const diffInHours = Math.floor(diffInSeconds / 3600);
        return `${diffInHours}小时前`;
    } else if (diffInSeconds < 2592000) {
        const diffInDays = Math.floor(diffInSeconds / 86400);
        return `${diffInDays}天前`;
    } else if (diffInSeconds < 31536000) {
        const diffInMonths = Math.floor(diffInSeconds / 2592000);
        return `${diffInMonths}个月前`;
    } else {
        const diffInYears = Math.floor(diffInSeconds / 31536000);
        return `${diffInYears}年前`;
    }
}

function keyboard_fast_instruction() {
    Swal.fire({
        icon: "info",
        title: '键盘按键映射说明',
        html: `
        1.每个题目包裹都能被聚焦,点击任意一个题目包裹后，按 TAb 键可以聚焦下一个题目包裹。<br><br>
        2.当启用“键盘代替鼠标”后，聚焦一个题目包裹，然后按下“上箭头”将聚焦上一个题目包裹，按下“下箭头”将聚焦下一个题目包裹，按下“左箭头”将收藏/取消收藏，按下“右箭头”将显示/取消显示正确答案；<br><br>
        3.键盘映射表<br>
        （从键盘的数字键和字母键开始 【从左向右】）<br>
        (键【左边】为映射后的值，值【右边】为原始输入的值)：<br>
        "A": ["A", "Z", "Q", "1"],<br>
        "B": ["S", "X", "W", "2"],<br>
        "C": ["D", "C", "E", "3"],<br>
        "D": ["F", "V", "R", "4"],<br>
        "E": ["G", "B", "T", "5"],<br>
        "F": ["H", "N", "Y", "6"],<br>
        "G": ["J", "M", "U", "7"],<br>
        "H": ["K", "I", "8"],<br>
        "I": ["L", "O", "9"],<br>
        `,

    })


}

function fast_submit_instruction() {
    Swal.fire({
        icon: "info",
        title: '速刷模式使用说明',
        html: `
        点击选项后如果我的答案和正确答案数组长度相同，则自动显示正确答案。选择后可以更改答案。鼠标做题推荐开启：“悬停显示正确答案”；键盘做题推荐关闭：“悬停显示正确答案”。
        `,
        footer: "按钮：正确选项前显示'✔' 无效，在提交后才有效。",
    })
}
function findMappedKey(input) {
    for (const [key, values] of Object.entries(keyboard_fast_map)) {
        if (values.includes(input.toUpperCase())) {
            return key;
        }
    }
    return false;
}


function keyboard_fast_fun(e) {
    if (!document.getElementById("is_keyboard_fast_setting").checked) {
        return
    }

    const focusedElement = document.activeElement;
    // const sheet_li_show = document.getElementsByClassName("sheet_li_show")[0] || document.getElementsByClassName("sheet_li")[0]
    // console.log(sheet_li_show);

    if (!focusedElement.classList.contains("wrap")) {
        return
    }
    /*     if (focusedElement.nodeName == "body") {
            let index = sheet_li_show.dataset.originalIndex
            document.getElementsByClassName("wrap")[index].focus()
            document.getElementsByClassName("wrap")[index].scrollIntoView({ behavior: "smooth", block: "start" });
            return
        } else  */
    const key = e.key
    // console.log(focusedElement.dataset.typeCode, key);

    // 上下切换
    if (key == "ArrowDown" || key == "ArrowUp") {
        e.preventDefault()
        // 获取聚焦元素索引
        let wrap_arr = Array.from(document.getElementsByClassName("wrap")).filter(ele => ele.style.display != "none")
        let focusedElement_index = wrap_arr.indexOf(focusedElement)
        // 判断越界情况
        // console.log(focusedElement_index);
        let next_focusedElement_index
        if (key == "ArrowDown" && focusedElement_index != document.getElementsByClassName("wrap").length) {
            next_focusedElement_index = focusedElement_index + 1
        } else if (key == "ArrowUp" && focusedElement_index != 0) {
            next_focusedElement_index = focusedElement_index - 1
        }
        if (next_focusedElement_index == -1 || next_focusedElement_index == wrap_arr.length) {
            return
        }
        let next_focusedElement = wrap_arr[next_focusedElement_index]
        // console.log(focusedElement_index, next_focusedElement_index, next_focusedElement);
        next_focusedElement.focus()
        next_focusedElement.scrollIntoView({ behavior: "smooth", block: "start" });

        return
    }

    // 收藏
    if (key == "ArrowLeft") {
        e.preventDefault()
        // console.log(focusedElement.getElementsByClassName("favourite_div")[0]);
        focusedElement.getElementsByClassName("favourite_div")[0].click()

        return
    }
    // console.log(key);
    // 显示答案
    if (key == "ArrowRight") {
        e.preventDefault()
        // console.log(focusedElement.getElementsByClassName("favourite_div")[0]);
        let answer_wrap = focusedElement.getElementsByClassName("answer_wrap")[0]
        if (answer_wrap.style.display != "block") {
            answer_wrap.style.display = "block"
        } else {
            answer_wrap.style.display = ""
        }
        return
    }


    // 选择选项    
    if (!(0 < focusedElement.dataset.typeCode <= 3)) {
        return
    }

    const regKey = /[a-zA-Z1-9]/
    if (!regKey.test(key)) {
        return
    }

    let mapped_key = findMappedKey(key)
    if (!mapped_key) {
        return
    }
    // console.log(mapped_key);


    let option_need_click_index = transformChar(mapped_key)


    // 判断越界情况
    if (focusedElement.getElementsByClassName("option_wrap").length <= option_need_click_index) {
        // console.log("越界");
        return
    }

    focusedElement.getElementsByClassName("option_code")[option_need_click_index].click()
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

// 节流
// https://www.cnblogs.com/aurora-ql/p/13757733.html         这老六写的函数的delay参数没用上
function throttle(fn, delay = 500) {
    let timer = null

    return function () {
        // console.log(timer);
        if (timer) {
            return
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments)
            timer = null
        }, delay)
    }
}

function main_click(e) {
    // console.log(e.target)
    if (e.target.closest(".option_wrap") == null) {
        // console.log("not option_wrap");
        return
    }
    // 元素聚焦
    // TODO
    /*     try {
            e.target.closest(".wrap").focus()
        } catch (error) {
            console.error(error);
        } */

    // console.log(e.target.closest(".wrap"));
    // 获取选项包裹
    let option_wrap = e.target.closest(".option_wrap")
    // 选项字母
    let option_code = option_wrap.dataset.optionCode

    // 获取题目包裹
    let wrap = e.target.closest(".wrap")
    // 题型
    let type_code = wrap.dataset.typeCode
    // 全局索引
    let index = wrap.getAttribute("data-index")
    // 原来的选择字母
    let old_answer_my_chars = wrap.dataset.answerMy
    // 获取答题卡li元素
    let sheet_li = document.getElementsByClassName("sheet_li")[index]

    const {
        updateSelection,
        getDeselectedIndexes,
        getSelectedIndexes
    } = selectionHandler(old_answer_my_chars, transformChar(option_code), type_code);

    let new_answer_my_chars = updateSelection().sort()  //更新后的选项索引数组:
    let cancel_answer_my_chars = getDeselectedIndexes()  //需要取消的选项索引:
    let choose_answer_my_chars = getSelectedIndexes()  //需要选择的选项索引:

    // Answer.set_answer_my(new_answer_my_chars, cancel_answer_my_chars, choose_answer_my_chars)

    // 设置答案
    wrap.dataset.answerMy = JSON.stringify(new_answer_my_chars)
    // 取消旧答案
    cancel_answer_my_chars.forEach((ele) => {
        wrap.getElementsByClassName("option_code")[ele].classList.remove("checked")
    })
    // 设置新答案
    choose_answer_my_chars.forEach((ele) => {
        wrap.getElementsByClassName("option_code")[ele].classList.add("checked")
    })
    // 答题卡设置
    if (new_answer_my_chars.length > 0) {
        if (!sheet_li.classList.contains("checked")) {
            sheet_li.classList.add("checked")
        }
    } else {
        sheet_li.classList.remove("checked")
    }
    // 更新答案数组
    answer_my[index] = new_answer_my_chars

    // 判断是否存档
    // console.log(SavedIo.savedMethod);
    if (SavedIo.savedMethod == "auto") {
        SavedIo.save()
    }

    // 判断是否为速刷模式
    if (document.getElementById("is_fast_submit_setting").checked) {
        // 获取答案包裹
        let answer_wrap = wrap.getElementsByClassName("answer_wrap")[0]
        let answer_true = JSON.parse(wrap.dataset.answersMatchingIndexNew)
        // let answer_my_div = wrap.getElementsByClassName("answer_my")[0]

        // console.log(answer_true, answer_true.length, new_answer_my_chars, new_answer_my_chars.length, answer_true.length != new_answer_my_chars.length);
        if (answer_true.length <= new_answer_my_chars.length || answer_wrap.style.display == "block") {
            let answer_true_display_div = wrap.getElementsByClassName("answer_true_display")[0]
            // console.log(answer_true_display_div);
            // console.log(new_answer_my_chars.toString(), answer_true.sort().toString(), new_answer_my_chars.toString() == answer_true.sort().toString());
            if (answer_true_display_div.classList.contains("answer_true_display_correct")) {
                answer_true_display_div.classList.remove("answer_true_display_correct")
            } else if (answer_true_display_div.classList.contains("answer_true_display_wrong")) {
                answer_true_display_div.classList.remove("answer_true_display_wrong")
            }

            if (new_answer_my_chars.toString() == answer_true.sort().toString()) {
                answer_true_display_div.classList.add("answer_true_display_correct")
            } else {
                answer_true_display_div.classList.add("answer_true_display_wrong")
            }

            if (answer_wrap.style.display != "block") {
                answer_wrap.style.display = "block"
            }

        } else {
            // answer_wrap.style.display = ""
            return
        }


        let answer_my_div = wrap.getElementsByClassName("answer_my")[0]
        answer_my_div.innerText = "我的答案："
        for (let j = 0; j < new_answer_my_chars.length; j++) {
            answer_my_div.innerText = answer_my_div.innerText + String.fromCharCode(new_answer_my_chars[j] + 65)
        }
        if (0) {
            // answer_true_display answer_true_display_correct
            // answer_true_display answer_true_display_wrong
        }

    }
    return
}



function transformChar(input) {
    if (/[A-Za-z]/.test(input)) { // 判断是否为字母
        return input.toUpperCase().charCodeAt(0) - 65; // 转为对应数字 (A=0, B=1, ..., Z=25)
    } else if (/[0-9]/.test(input)) { // 判断是否为数字
        return String.fromCharCode(parseInt(input) + 65); // 转为对应字母 (0=A, 1=B, ..., 8=I)
    } else {
        return null; // 既不是字母也不是数字
    }
}
// console.log(transformChar("0"));

/**
 * 题目选项操作相关函数
 * @param {number[]} selectedIndexes - 当前的选项索引数组
 * @param {number|string} newIndex - 用户点击的选项索引
 * @param {string} type - 题目类型，1 "single" 表示单选题，2 "multi" 表示多选题，3 "judge" 表示判断题
 * @returns {object} 包含四个函数：
 *   - updateSelection: 返回更新后的选项索引数组
 *   - getDeselectedIndexes: 返回需要取消的选项索引
 *   - getSelectedIndexes: 返回需要选择的选项索引
 */
function selectionHandler(selectedIndexes, newIndex, type) {
    if (typeof selectedIndexes == "string") {
        selectedIndexes = JSON.parse(selectedIndexes)
    }

    // 确保输入是数组
    selectedIndexes = Array.isArray(selectedIndexes) ? selectedIndexes : [];

    // 更新选项索引数组
    const updateSelection = () => {
        if (type == 1 || type == 3) {
            return selectedIndexes.includes(newIndex) ? [] : [newIndex];
        } else if (type == 2) {
            return selectedIndexes.includes(newIndex)
                ? selectedIndexes.filter(index => index !== newIndex)
                : [...selectedIndexes, newIndex];
        }
        throw new Error("未知题目类型");
    };

    // 获取需要取消的选项索引
    const getDeselectedIndexes = () => {
        if (type == 2) {
            return selectedIndexes.includes(newIndex) ? [newIndex] : [];
        }
        // return selectedIndexes.includes(newIndex) ? selectedIndexes : [];
        return selectedIndexes;
    };

    // 获取需要选择的选项索引
    const getSelectedIndexes = () => {
        if (type == 2) {
            return selectedIndexes.includes(newIndex) ? [] : [newIndex];
        }
        return selectedIndexes.includes(newIndex) ? [] : [newIndex];
    };

    return {
        updateSelection,
        getDeselectedIndexes,
        getSelectedIndexes
    };
}



function main_input() {
    let main = document.getElementById("main")
    let input = main.getElementsByClassName("input")
    for (let i = 0; i < input.length; i++) {
        // console.log(input[i])
        let input_each = input[i]
        input_each.readOnly = true;
    }
}

function is_submit() {
    Swal.fire({
        title: "确认提交吗?",
        text: "请确保每道题完成后提交。",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        focusCancel: true,// 默认聚焦取消按钮
    }).then((result) => {
        if (result.isConfirmed) {
            submit()
        }
    });
}


function is_favourite_fun(e) {

    if (e.target.closest(".favourite_div") != null) {
        var favourite = e.target.closest(".favourite") || e.target.getElementsByClassName("favourite")[0]
        var wrap = e.target.closest(".wrap")
    } else {
        return 0
    }

    let index = wrap.dataset.index
    let sheet_li = document.getElementsByClassName("sheet_li")[index]
    if (wrap.dataset.isFavourite == "0") {
        wrap.dataset.isFavourite = "1"
        sheet_li.dataset.isFavourite = "1"
        favourite.classList.add("favourite_active")
        sheet_li.classList.add("favourite_active")
    } else if (wrap.dataset.isFavourite == "1") {
        wrap.dataset.isFavourite = "0"
        sheet_li.dataset.isFavourite = "0"
        sheet_li.classList.remove("favourite_active")
        favourite.classList.remove("favourite_active")
    }

}

function submit() {
    removeEventListener_main_click_and_is_submit()

    document.getElementById("main").classList.add("submited")

    let wrap = document.getElementsByClassName("wrap")
    let sheet_wrap = document.getElementById("sheet_wrap")
    if (wrap.length == 0) {
        Swal.fire({
            title: "错误！",
            text: "没有题目。",
            icon: "error",
        })
        return
    }
    correct_num = 0
    wrong_num = 0

    for (let i = 0; i < wrap.length; i++) {
        let order = i
        let wrap_each = document.getElementsByClassName("wrap")[order]
        // let q = wrap_each.getElementsByClassName("q")[0]
        let options_wrap = wrap_each.getElementsByClassName("options_wrap")[0]
        let type_code = wrap_each.dataset.typeCode
        let answer_my = wrap_each.dataset.answerMy
        let answer_my_div = wrap_each.getElementsByClassName("answer_my")[0]
        let answer_true_display = wrap_each.getElementsByClassName("answer_true_display")[0]
        input_str = ""
        let input = wrap_each.getElementsByClassName("input")
        for (let x = 0; x < input.length; x++) {
            input_str = input_str + input[x].value
        }
        let sheet_li = sheet_wrap.getElementsByClassName("sheet_li")[order]
        if (!answer_my && !input_str) {
            is_answer_true = false
            answer_true_display_fun(is_answer_true, sheet_li, answer_my_div, answer_true_display, wrap_each)
            let answers_matching_index_new = wrap_each.dataset.answersMatchingIndexNew
            answers_matching_index_new = JSON.parse(answers_matching_index_new)
            answers_matching_index_new.sort()
            option_true_display_fun(options_wrap, answers_matching_index_new)

        } else {
            if (type_code == 1 || type_code == 2 || type_code == 3) {
                answer_my = JSON.parse(answer_my)
                answer_my.sort()
                let answer_my_div = wrap_each.getElementsByClassName("answer_my")[0]
                answer_my_div.innerText = "我的答案："
                for (let j = 0; j < answer_my.length; j++) {
                    answer_my_div.innerText = answer_my_div.innerText + String.fromCharCode(answer_my[j] + 65)
                }
                answer_my = answer_my.toString()

                let answers_matching_index_new = wrap_each.dataset.answersMatchingIndexNew
                answers_matching_index_new = JSON.parse(answers_matching_index_new)
                answers_matching_index_new.sort()
                answers_matching_index_new_ = answers_matching_index_new.toString()

                if (answers_matching_index_new_ == answer_my) {
                    is_answer_true = true
                } else {
                    is_answer_true = false
                }
                answer_true_display_fun(is_answer_true, sheet_li, answer_my_div, answer_true_display, wrap_each)
                option_true_display_fun(options_wrap, answers_matching_index_new)

            } else if (type_code == 4 || type_code == 5) {
                let input = wrap_each.getElementsByClassName("input")
                // let answer_my = wrap_each.getElementsByClassName("answer_my")[0]
                let answers = wrap_each.dataset.answers
                answers = JSON.parse(answers)
                flag = true
                for (let i = 0; i < input.length; i++) {
                    let input_answer_my = input[i].value
                    // console.log(wrap_each.getElementsByClassName("answer_my")[0])
                    let index = i + 1
                    wrap_each.getElementsByClassName("answer_my")[0].innerText.innerText = "我的答案："
                    wrap_each.getElementsByClassName("answer_my")[0].innerText = wrap_each.getElementsByClassName("answer_my")[0].innerText + index + "." + input_answer_my + "  "
                    if (input_answer_my == answers[i]) {
                    } else {
                        flag = false
                    }
                }
                let is_answer_true = flag
                answer_true_display_fun(is_answer_true, sheet_li, answer_my_div, answer_true_display, wrap_each)
            }
        }
    }

    let analysis = document.getElementsByClassName("analysis")
    Array.from(analysis).forEach((e) => {
        e.style.display = "block"
    })
    // 正确答案是否隐藏
    let answer_true = document.getElementsByClassName("answer_true")
    let is_hide_answer_true_input = document.getElementById("is_hide_answer_true")
    let is_hide_answer_true = is_hide_answer_true_input.dataset.isHideAnswerTrue


    if (is_hide_answer_true == "1") {
        Array.from(wrap).forEach((wrap_each) => {
            let is_answer_true = wrap_each.dataset.isAnswerTrue
            if (is_answer_true != 1) {
                wrap_each.getElementsByClassName("answer_true")[0].classList.add("answer_true_hide")
            }

        })
    } else if (is_hide_answer_true == "0") {
        Array.from(answer_true).forEach((e) => {
            if (e.classList.contains("answer_true_hide")) {
                e.classList.remove("answer_true_hide")
            }
        })
    }

    let rate = (correct_num / (correct_num + wrong_num) * 100).toFixed(2)
    Swal.fire({
        title: `
        正确率：${rate}%
        `,
        html: `
        <div>
        答对${correct_num} 道题，答错${wrong_num} 道题，共${correct_num + wrong_num} 道题
        </div>
        <br>
        <hr>
        <div id="submit_rewrite">
        <div>新页面重做：</div>
        <div class="submit_rewrite_item">
            <input type="checkbox" id="rewrite_answer_error_submit" value="2">
            <label for="rewrite_answer_error_submit">错题</label>
        </div>
        <div class="submit_rewrite_item">
            <input type="checkbox" id="rewrite_favourite_submit" value="3">
            <label for="rewrite_favourite_submit">收藏</label>
        </div>
        <div class="submit_rewrite_item">
            <input type="checkbox" id="rewrite_both_submit" value="4">
            <label for="rewrite_both_submit">错题+收藏</label>
        </div>

        `,
        footer: `
        <div style="font-size: smaller;">
        被隐藏的答案显示：鼠标悬浮/手机端点击正确答案，可在设置球关闭该功能。
        </div>
        `,
        // showCancelButton: true,
        allowOutsideClick: false, // 禁止点击外部关闭
        backdrop: true,           // 保留背景遮罩（默认开启）
        confirmButtonText: '继续',
        preConfirm: () => {
            const selectedOptions = [];
            if (document.getElementById('rewrite_answer_error_submit').checked) selectedOptions.push('2');
            if (document.getElementById('rewrite_favourite_submit').checked) selectedOptions.push('3');
            if (document.getElementById('rewrite_both_submit').checked) selectedOptions.push('4');
            return selectedOptions;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (result.value.length == 0) {
                return
            }
            for (let i = 0; i < result.value.length; i++) {
                let rewrite_type = result.value[i]
                setTimeout(() => {
                    rewrite_fun(rewrite_type)
                }, 400 * i + 300)

            }
        }
    });

    whoo(rate)

}


function option_true_display_fun(options_wrap, answers_matching_index_new) {
    let option_wrap_arr = options_wrap.getElementsByClassName("option_wrap")
    for (let i = 0; i < answers_matching_index_new.length; i++) {
        let index = answers_matching_index_new[i]
        option_wrap_arr[index].classList.add("option_right")
    }

}

function answer_true_display_fun(is_answer_true, sheet_li, answer_my, answer_true_display, wrap_each) {
    if (answer_true_display.classList.contains("answer_true_display_correct")) {
        answer_true_display.classList.remove("answer_true_display_correct")
    } else if (answer_true_display.classList.contains("answer_true_display_wrong")) {
        answer_true_display.classList.remove("answer_true_display_wrong")
    }
    if (is_answer_true) {
        wrap_each.dataset.isAnswerTrue = "1"
        sheet_li.style.backgroundColor = "#41b349"
        sheet_li.dataset.isAnswerTrue = "1"
        correct_num += 1
        answer_my.style.color = "#00B86E"
        answer_true_display.classList.add("answer_true_display_correct")
    } else {
        wrap_each.dataset.isAnswerTrue = "0"
        sheet_li.dataset.isAnswerTrue = "1"
        sheet_li.style.backgroundColor = "#f03434cf"
        wrong_num += 1
        answer_my.style.color = "rgb(255 0 0 / 87%)"
        answer_true_display.classList.add("answer_true_display_wrong")
    }
}


function getRandomElementsFromArray(arr, n) {
    // js从数组中随机抽取n个元素构成新数组
    // 先确保 n 不超过数组的长度
    n = Math.min(n, arr.length);

    // 复制数组以避免修改原始数组
    const shuffledArray = arr.slice();

    // 使用 Fisher-Yates 算法对数组进行洗牌
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    // 从洗牌后的数组中截取前 n 个元素
    const resultArray = shuffledArray.slice(0, n);

    return resultArray;
}

function shuffle(arr) {
    let i = arr.length;
    while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
}
// 深拷贝
/* function deepCopy(arr) {
    return arr.map(item => Array.isArray(item) ? deepCopy(item) : item);
} */
// TODO
function deepCopy(obj) {
    if (Array.isArray(obj)) {
        return obj.map(item => deepCopy(item));
    } else if (obj && typeof obj === 'object') {
        const copied = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                copied[key] = deepCopy(obj[key]);
            }
        }
        return copied;
    } else {
        return obj;
    }
}

function string_to_name(string, value) {
    let _name = string + "=" + value
    eval(_name)
    return _name
}

function json_create_original_index(json) {
    var json_body = json["body"]
    for (let i = 0; i < json_body.length; i++) {
        // 创建唯一原始索引,方便查找
        json_body[i]["original_index"] = i
    }
    json["head"]["create_original_index"] = "1"
}

function extractBeforeMatch(str) {
    var regex = /-\d+年\d+月\d+日\d+小时\d+分\d+秒\.json/;
    var matchResult = str.match(regex);
    if (matchResult == null) {
        if (str.match(/\.json/) != null) return str.replace(/\.json/, "")
        return str
    } else {
        return str.replace(matchResult, "")
    }
}

// TODO  before_create_paper

function json2paper(json, is_order = "1", unorder_question_num) {

    // 初始化检验
    try {
        var temp_ = JSON.stringify(json)
    } catch (error) {
        console.log(error);
        Swal.fire({
            title: "解析错误，可能是数据不合法，有可能是bug。",
            text: error.message,
            icon: "error",
        })
        return
    }
    if (temp_ == "{}") {
        Swal.fire({
            title: "题目数据为空,解析错误。",
            text: " 一般不会出现这种问题",
            icon: "error",
        })
        return
    }

    // 数据初始化
    answer_my = []
    // console.log("json", json);
    if (json.hasOwnProperty("json")) {
        answer_my = json["answer_my"]
        // console.log("answer_my", answer_my);
        json = json["json"]
        // 注意顺序，避免覆盖
    }


    // 显示控制 
    clear_old_paper_sheet()
    drop_box_display_fun(0)

    document.getElementById("main").classList.remove("submited")
    document.getElementById("main").style.display = ""
    // 回到顶部
    document.getElementById("back_top").style.visibility = "visible"
    // 答题卡
    let sheet = document.getElementById("sheet")
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        sheet.style.visibility = "hidden"
    }
    sheet.style.display = "block"

    // 原始索引
    /*     if (!(json["head"].hasOwnProperty("create_original_index") && json["head"]["create_original_index"] == "1")) {
            json_create_original_index(json)
        } */
    json_create_original_index(json)

    let json_body_num = json["body"].length
    var json_body = json["body"]
    json_body = sort_json(json_body, is_order, unorder_question_num)

    // 我的答案
    let json_body_ = [...json_body[1], ...json_body[2], ...json_body[3], ...json_body[4], ...json_body[5], ...json_body[6]]

    if (answer_my.length == 0) {
        answer_my = Array.from({ length: json_body_.length }, () => []);
    } else { }

    json_now = {
        head: json["head"],
        body: json_body_
    }

    let type_code_2_type = {
        "1": "单选题",
        "2": "多选题",
        "3": "判断题",
        "4": "填空题",
        "5": "简答题",
        "6": "自定义",
    }
    let type_code_123456 = ["一.", "二.", "三.", "四.", "五.", "六."]
    var timer = 0
    var main_div = document.getElementById("main")
    let sheet_wrap = document.getElementById("sheet_wrap")

    // 标题
    if (json && json["head"].hasOwnProperty("title")) {
        let title = document.createElement("h2")
        title.id = "title"
        let title_text = extractBeforeMatch(json["head"]["title"])
        title.innerText = title_text
        main_div.appendChild(title)
        document.title = title_text
    }

    // 详细信息
    let json_info_div = document.createElement("div")
    json_info_div.id = "json_info_div"

    // json导出时间
    if (json && json["head"].hasOwnProperty("time") && json["head"]["time"] != "") {
        let json_time = document.createElement("div")
        json_time.id = "json_time"
        let json_time_text = "导出:" + json["head"]["time"].replace("年", "-").replace("月", "-").replace("日", " ").replace("小时", ":").replace("分", ":").replace("秒", "")
        json_time.innerText = json_time_text
        json_info_div.appendChild(json_time)
    }

    // 开始做题时间
    let time = new Date().format("yy-MM-dd hh:mm:ss")
    let start_do_time = "做题:" + time
    let start_do_time_div = document.createElement("div")
    start_do_time_div.id = "start_do_time_div"
    start_do_time_div.innerText = start_do_time
    json_info_div.appendChild(start_do_time_div)

    // 题目总数
    let json_body_num_div = document.createElement("div")
    json_body_num_div.id = "json_body_num_div"
    json_body_num_div.innerText = "题数：" + json_body_num
    json_info_div.appendChild(json_body_num_div)

    // 题目反馈
    let feedback_div = document.createElement("a")
    feedback_div.id = "feedback_a"
    feedback_div.href = ""
    feedback_div.target = "_blank"
    feedback_div.innerText = "题目反馈"

    json_info_div.appendChild(feedback_div)

    // 相关资料
    if (location.href.match(/\.\/json\/[\s\S]+?\//)) {
        let relative_div = document.createElement("div")
        relative_div.id = "relative_div"
        relative_div.innerText = "相关资料"
        json_info_div.appendChild(relative_div)
        load_relative()
        relative_div.onclick = relative_popup
    }

    // 存档功能
    let saved_div = document.createElement("div")
    saved_div.id = "saved_div"
    saved_div.innerText = "存档管理"

    let saved_create = SavedIo.create(json_now, answer_my)
    window.id = saved_create["id"]
    window.json_now = saved_create["json"]
    window.answer_my = saved_create["answer_my"]

    /*     let saved_create = SavedIo.create(json_now, answer_my)
    
        if (SavedIo.savedMethod == "auto") {
            SavedIo.writeById(saved_create, saved_create["id"])
        } */


    json_info_div.appendChild(saved_div)

    main_div.appendChild(json_info_div)

    // 全局索引
    let index = 0
    // 答案数组

    let = main_fragment = document.createDocumentFragment()
    let = sheet_fragment = document.createDocumentFragment()

    for (let i = 1; i < 7; i++) {
        if (json_body[i] == 0) {
            continue
        }

        timer++
        // 答题卡的
        let sheet_type_div = document.createElement("div")
        sheet_type_div.className = "sheet_type_div"
        sheet_type_div.dataset.sheetTypeNum = json_body[i].length
        sheet_type_div.dataset.sheetTypeCode = i
        sheet_type_div.dataset.isDisplay = "1"
        let type_num = json_body[i].length
        let type_ratios = type_num / json_body_num * 100
        sheet_type_div.innerHTML = type_code_123456[timer - 1] + type_code_2_type[i] + "（共" + type_num + "个, " + type_ratios.toFixed(2) + "%）"

        let ul = document.createElement("ul")
        ul.className = "sheet_ul ul_" + i

        // 主页面的
        let wrap_type_div = document.createElement("div")
        wrap_type_div.className = "wrap_type_div"
        wrap_type_div.dataset.wrapTypeNum = type_num
        wrap_type_div.dataset.typeCode = i
        wrap_type_div.dataset.isDisplay = "1"
        wrap_type_div.innerHTML = type_code_123456[timer - 1] + type_code_2_type[i] + "（共" + type_num + "个）"
        main_fragment.append(wrap_type_div)


        for (let j = 0; j < type_num; j++) {
            let order = j
            let main_return = main(json_body[i][order], order, index, is_order)
            let [wrap, sheet_li] = [main_return[0], main_return[1]]
            main_fragment.append(wrap)
            ul.appendChild(sheet_li)
            index = index + 1
        }


        sheet_fragment.appendChild(sheet_type_div)
        sheet_fragment.appendChild(ul)
    }

    main_div.append(main_fragment)
    sheet_wrap.appendChild(sheet_fragment)

    // 结束提示词

    let end_text = document.createElement("div")
    end_text.id = "end_text"
    let end_text_arr = [
        "到底了",
        "恭喜完成所有题目，医路辉煌，从此刻启航！",
        "题目虽尽，梦想正燃。",
        "每一次解答，都是在为未来的生命负责！",
        "稳扎稳打，步步为营，你将在医学道路上发光发热！",
        "题终而思远，医学之境深邃，你以勤奋为梯，攀登未来医生的高峰，俯瞰众生！",
        "答题告捷，下一站：悬壶济世！"
    ]
    let end_text_arr_index = location.search.includes("extension") ? 0 : Math.floor(end_text_arr.length * Math.random())
    end_text.innerText = end_text_arr[end_text_arr_index]
    main_div.appendChild(end_text)

    addEventListener_main_click_and_is_submit()

    let output_tool_bar = document.getElementById("output_tool_bar")
    output_tool_bar.style.display = "flex"

    return 1

}

function relative_popup() {
    relative_json
    let relative_html = `
`
    for (let i = 0; i < relative_json.length; i++) {
        let relative_item = relative_json[i]
        relative_html += `
            <div class='relative_item'>
                <div class="relative_item_name">${relative_item['name']}</div>
                <a href="${relative_item['path']}"  download>下载</a>            
            </div>
            `
    }

    if (relative_json.length == 0) {
        relative_html += `
            没有资料，多看书吧
            `
    }
    Swal.fire({
        title: "相关资源列表",
        icon: "info",
        html: relative_html,
        footer: "资料可能出错。反馈&投稿：532147305（QQ群） ，chatgpt.usc@gmail.com（邮箱）",
    })
}

function load_relative() {
    // TODO  路径问题
    if (!location.href.match(/\.\/json\/[\s\S]+?\//)) return
    let path = location.href.match(/\.\/json\/[\s\S]+?\//) + "relative/relative.json"

    // console.log(path);
    let relative_request = new Request(path)

    fetch(relative_request).then((response) => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error("相关资源文件加载失败");
        }
    }).then((response) => {
        // console.log(response);
        relative_json = response
    }).catch((error) => {
        console.error(error);
        document.getElementById("relative_div").style.color = "red"
        document.getElementById("relative_div").style.textDecoration = "line-through"
    });

}


function index_in_parent(parent, child) {
    let childrenArray = Array.from(parent.children);
    // 获取子元素 saved_item_wrap 在父元素中的索引
    let index = childrenArray.indexOf(child);
    return index
}

function main_wrap_copy_fun(e) {

    if (e.target.classList.contains("main_wrap_copy") || e.target.parentElement.classList.contains("main_wrap_copy")) {
        let wrap = e.target.closest(".wrap")
        let main_wrap_copy = e.target.closest(".main_wrap_copy")
        // 复制wrap的文本内容
        let wrap_text = wrap.innerText
        copyToClipboard(main_wrap_copy, wrap_text)
    }
}

function copyToClipboard(ele, text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            // console.log('文本已成功写入剪切板: ', text);
            ele.classList.add("main_wrap_copy_success")
            setTimeout(() => {
                ele.classList.remove("main_wrap_copy_success")
            }, 1000)
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: '无法写入剪切板,请给予必要的权限，或者手动复制。',
                text: error,
            });
            console.error('无法写入剪切板: ', error);
        });
}

function isMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileScreen = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window;

    return (
        /iphone|ipod|android|windows phone|blackberry|mobile/i.test(userAgent) ||
        (isMobileScreen && isTouchDevice)
    );
}


function drop_box_display_fun(type) {
    // console.log(type);
    let drop_wrap = document.getElementById("drop_wrap")
    if (type == 1) {
        drop_wrap.style.display = "block"
    } else if (type == 0) {
        drop_wrap.style.display = "none"
    }
}

function back_top_fun() {
    document.documentElement.scrollTop = 0
}

function sort_json(json_body_arr, is_order, unorder_question_num) {
    // console.log(json_body_arr)
    let temp_arr = {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": [],
        "6": []
    }
    let json_body_arr_new = []

    var json_num = unorder_question_num

    if (is_order == "0") {
        var json_body_arr = getRandomElementsFromArray(json_body_arr, json_num)
        for (let index = 0; index < json_body_arr.length; index++) {
            let type_code = json_body_arr[index]["type_code"]
            temp_arr[type_code].push(json_body_arr[index])
        }
        for (let i = 1; i < 7; i++) {
            temp_arr[i] = shuffle(temp_arr[i])
        }
    } else if (is_order == "1") {
        for (let index = 0; index < json_body_arr.length; index++) {
            let type_code = json_body_arr[index]["type_code"]
            temp_arr[type_code].push(json_body_arr[index])
        }
    }
    json_body_arr_new = temp_arr
    return json_body_arr_new
}

function truncateString(str, targetChar) {
    const index = str.indexOf(targetChar);
    if (index !== -1) {
        return str.substring(index);
    }
    return str;
}

function fetchJson(path) {
    return new Promise((resolve, reject) => {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status >= 200 && xmlhttp.status < 400) {
                    let json_each;
                    try {
                        if (xmlhttp.responseText != "" && xmlhttp.responseText != [] && xmlhttp.responseText != "[]") {
                            json_each = JSON.parse(xmlhttp.responseText);
                        }
                    } catch (error) {
                        reject(new Error("Invalid JSON response"));
                        return;
                    }
                    resolve(json_each);
                } else {
                    reject(new Error(xmlhttp.statusText));
                }
            }
        };
        xmlhttp.open("GET", path);
        xmlhttp.send();
    });
}

async function load_path(path_arr, name) {
    json = { head: {}, body: [] };
    let promises = path_arr.map(fetchJson);
    try {
        let results = await Promise.all(promises);
        for (let i = 0; i < results.length; i++) {
            if (results[i] == undefined) {
                continue
            }
            if (i == 1) {
                json["head"] = results[i]["head"];
            }
            json["body"].push(...results[i]["body"]);
        }
        json["head"]["title"] = name
        json2paper(json);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: '网站出问题了',
            html: error + "<br>QQ群反馈：532147305,谢谢",
            showCloseButton: true,
        })
        console.error("网站出问题了,Error:", error);
    }
}


function clear_old_paper_sheet(sheet_hidden = 0) {
    removeEventListener_main_click_and_is_submit()
    let main = document.getElementById("main")
    main.innerHTML = ""
    let sheet = document.getElementById("sheet")
    sheet.innerHTML = `
           <div id="sheet_wrap">
        </div>
    `
    if (sheet_hidden == 1) {
        sheet.style.display = "none"
    }
    let back_top = document.getElementById("back_top")
    // back_top.style.visibility = "visible"
    back_top.style.visibility = "hidden"
}

// 重新生成将覆盖您以前的内容，
function unorder_json() {
    if (!(json && json.hasOwnProperty("body") && json["body"].length >= 0)) {
        Swal.fire({
            title: "json数据为空或者异常，无法抽题。",
            icon: "error",
        })
        return
    }
    let question_num = json["body"].length
    let unorder_question_num = 0
    if (question_num > 5) {
        unorder_question_num = (question_num / 3).toFixed(0)
    } else {
        unorder_question_num = question_num
    }

    Swal.fire({
        title: "确认抽题吗？",
        // text: "",
        icon: "warning",
        input: "range",
        inputLabel: "抽题数量",
        inputAttributes: {
            min: "1",
            max: question_num,
            step: "1"
        },
        inputValue: unorder_question_num,
        showCancelButton: true,
        // confirmButtonColor: '#dc3545', // 红色按钮，表示危险操作
        // cancelButtonColor: '#6c757d', // 灰色取消按钮
        confirmButtonText: '抽题',
        cancelButtonText: '取消',
        focusCancel: true,
        footer: `
        因为抽题会影响选项顺序，可能造成选择题选项引用错误。
        `
    }).then((result) => {
        if (result.isConfirmed) {
            json2paper(json, 0, result.value)
            addEventListener_main_click_and_is_submit()
        }
    });
}

function order_json() {
    Swal.fire({
        title: "确认重做吗？",
        text: "重新生成将覆盖您以前的内容，数量为开始时的总数，题目顺序不变。",
        icon: "warning",
        showCancelButton: true,
        /*         confirmButtonColor: '#dc3545', // 红色按钮，表示危险操作
                cancelButtonColor: '#6c757d', // 灰色取消按钮 */
        confirmButtonText: '重做',
        cancelButtonText: '取消',
        focusCancel: true // 默认聚焦取消按钮
    }).then((result) => {
        if (result.isConfirmed) {
            json2paper(json, "1")
            addEventListener_main_click_and_is_submit()
        }
    });
}

// 设置的逻辑
let setting_icon_div = document.getElementById("setting_icon_div")
// 隐藏与样式逻辑
setting_icon_div.addEventListener("click", function () {
    let setting_div = document.getElementById("setting_div")
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
    // console.log(e.clientX, e.clientY);
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
let throttle_drag_fun = throttle(drag_fun, 20)


// PC拖拽逻辑
// let setting_icon_div = document.getElementById("setting_icon_div");
// 变量上面有了
setting_icon_div.addEventListener("dragstart", function (e) {
    offsetX = e.offsetX; // 将 offsetX 和 offsetY 赋值在共同的作用域内
    offsetY = e.offsetY;

    document.addEventListener("dragover", throttle_drag_fun)
})

setting_icon_div.addEventListener("dragend", function (e) {
    document.removeEventListener("dragover", throttle_drag_fun)
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
        let setting_icon_div_height = -100;
        let setting_div = document.getElementById("setting_div");
        let setting_show = setting_div.dataset.settingShow;
        let _h, _w;

        if (setting_show == "0") {
            _h = window.innerHeight - (setting_icon_div.offsetHeight + distanse);
            _w = window.innerWidth - (setting_icon_div.offsetWidth + distanse);
        } else if (setting_show == "1") {
            _h = window.innerHeight - (setting_div.offsetHeight + setting_icon_div_height + distanse);
            _w = window.innerWidth - (setting_div.offsetWidth + setting_icon_div_width + distanse);
        }

        let div_top = touch.clientY - offsetY;
        let div_left = touch.clientX - offsetX;
        div_top = Math.min(Math.max(bar_height + distanse, div_top), _h);
        div_left = Math.min(Math.max(distanse, div_left), _w);
        setting.style.top = div_top + setting_icon_div_height + "px";
        setting.style.left = div_left + setting_icon_div_width + "px";
    }
}, { passive: false });

document.addEventListener("touchend", function () {
    isDragging = false;
})



// 设置里面的各功能
// 1.1正确选项前显示“√”
function option_right_display(option_right_display_input) {

    let is_option_right_display = option_right_display_input.dataset.isOptionRightDisplay
    let main = document.getElementById("main")
    if (is_option_right_display == "0") {
        main.style.setProperty("--optionRightDisplay", "1")
    } else if (is_option_right_display == "1") {
        main.style.setProperty("--optionRightDisplay", "0")
    }
    option_right_display_input.dataset.isOptionRightDisplay = 1 - is_option_right_display

}

// 1.2隐藏正确答案，鼠标悬停显示  answer_true
function is_hide_answer_true_fun(is_hide_answer_true_input) {

    let wrap = document.getElementsByClassName("wrap")
    let answer_true_arr = document.getElementsByClassName("answer_true")
    let is_hide_answer_true = is_hide_answer_true_input.dataset.isHideAnswerTrue

    let main = document.getElementById("main")

    if (is_hide_answer_true == "0") {
        for (let i = 0; i < wrap.length; i++) {
            let wrap_each = wrap[i]
            let is_answer_true = wrap_each.dataset.isAnswerTrue
            if (is_answer_true == 0) {
                wrap_each.getElementsByClassName("answer_true")[0].dataset.isShow = "1"
                wrap_each.getElementsByClassName("answer_true")[0].classList.add("answer_true_hide")
            }
        }
        main.style.setProperty("--optionRightDisplay_", "none")
    } else if (is_hide_answer_true == "1") {
        for (let i = 0; i < answer_true_arr.length; i++) {
            let answer_true = answer_true_arr[i]
            answer_true.dataset.isShow = "0"
            if (answer_true.classList.contains("answer_true_hide")) {
                answer_true.classList.remove("answer_true_hide")
            }
        }
        main.style.setProperty("--optionRightDisplay_", "block")
    }
    is_hide_answer_true_input.dataset.isHideAnswerTrue = 1 - is_hide_answer_true

}

document.addEventListener('keydown', function (event) {
    if (event.key === 'F11' || event.keyCode === 122) { // 兼容不同浏览器的keyCode
        event.preventDefault();
    }
});


function toggleFullScreen() {
    if (!document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}


let eventArrs = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
eventArrs.forEach((item) => document.addEventListener(item, getFullScreenStatus));

function getFullScreenStatus() {
    let isFull = document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
    // console.log('全屏状态：', isFull);
}

var elem = document.documentElement;
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
function immerse_setting_fun(immerse_setting_input) {
    let is_immerse_setting = immerse_setting_input.dataset.isImmerseSetting
    let nav = document.getElementById("nav")
    let back_top = document.getElementById("back_top")
    let progressBar = document.getElementById("progressBar")
    if (is_immerse_setting == "0") {
        nav.style.display = "none"
        back_top.style.display = "none"
        progressBar.style.top = "0px"
        openFullscreen(elem)

    } else if (is_immerse_setting == "1") {
        nav.style.display = "flex"
        back_top.style.display = "block"
        progressBar.style.top = ""
        closeFullscreen(elem)

    }
    immerse_setting_input.dataset.isImmerseSetting = 1 - is_immerse_setting
}

// 1.6黑暗模式
function dark_setting_fun(is_dark_setting_div) {
    let is_dark_setting = is_dark_setting_div.dataset.isDarkSetting
    let html = document.getElementsByTagName("html")[0]
    // console.log(is_dark_setting,html);
    // console.log(is_dark_setting_div, is_dark_setting, html);

    if (is_dark_setting == 0) {
        html.classList.add("dark")
        // console.log(html.classList);

    } else if (is_dark_setting == 1) {
        html.classList.remove("dark")

    }
    // console.log(html);
    is_dark_setting_div.dataset.isDarkSetting = 1 - is_dark_setting
}

//1.7 音效模块
//初始化
let sound_actived = false //防止默认打开音效带来的尴尬
let sound_raw_name = ["mainmenu_press_cs360.wav", "mainmenu_press_home_01.wav", "mainmenu_press_inventory_01.wav", "mainmenu_press_inventory_02.wav", "mainmenu_press_loadout_01.wav", "mainmenu_press_news_01.wav", "mainmenu_press_play.wav", "mainmenu_press_play_02.wav", "mainmenu_press_play_03.wav", "mainmenu_press_quit_02.wav", "mainmenu_press_settings_01.wav", "mainmenu_press_settings_02.wav", "mainmenu_press_shop_01.wav", "mainmenu_press_watch_01.wav", "mainmenu_press_watch_02.wav", "mainmenu_rollover_01.wav"]
let sound_dir = "static/sound/csgo2/mainmenu/"
let submit_sound_dir = "static/sound/csgo2/submit/"


// submit后调用函数
document.getElementById("submit").addEventListener("click", () => {
    whoo_sound_1 = new Audio(submit_sound_dir + "Blitz Kids — 有为青年 - CSGO音乐盒 - Csgola.com.mp3")
    whoo_sound_2 = new Audio(submit_sound_dir + "The Verkkars - EZ4ENCE - CSGO音乐盒 - Csgola.com.mp3")
    whoo_sound_3 = new Audio(submit_sound_dir + "Neck Deep，痞子帮 - CSGO音乐盒 - Csgola.com.mp3")
    whoo_sound_4 = new Audio(submit_sound_dir + "TWERL 和 Ekko & Sidetrack - 万众瞩目 - CSGO音乐盒 - Csgola.com.mp3")
    whoo_sound_5 = new Audio(submit_sound_dir + "Dren — 枪炮卷饼卡车 - CSGO音乐盒 - Csgola.com.mp3")
    whoo_sound_6 = new Audio(submit_sound_dir + "Perfect World, 花脸 Hua Lian (Painted Face) - CSGO音乐盒 - Csgola.com.mp3")
}, { once: true })


function whoo(rate) {
    if (!sound_actived) return
    if (rate >= 95) {
        whoo_sound_1.play()
    } else if (rate >= 90) {
        whoo_sound_2.play()
    } else if (rate >= 80) {
        whoo_sound_3.play()
    } else if (rate >= 70) {
        whoo_sound_4.play()
    } else if (rate >= 60) {
        whoo_sound_5.play()
    } else {
        whoo_sound_6.play()
    }
}

let sound_arr = [
    {
        id: [],
        class_name: ["option_wrap", "option_code", "option"],
        sound: [],
        // sound_name: ["mainmenu_press_cs360.wav", "mainmenu_press_home_01.wav"],
        sound_name: ["mainmenu_press_home_01.wav"],
        describe: "单选题，多选题，判断题的选项音效"
    },
    {
        id: [],
        class_name: ["sheet_li", "sheet_li_a"],
        sound: [],
        sound_name: ["mainmenu_press_watch_01.wav"],
        describe: "答题卡跳转音效"
    },
    {
        id: ["order_json"],
        class_name: [],
        sound: [],
        sound_name: ["mainmenu_press_play.wav"],
        describe: "顺序生成"
    },
    {
        id: ["unorder_json"],
        class_name: [],
        sound: [],
        sound_name: ["mainmenu_press_play_02.wav"],
        describe: "随机生成"
    },
    {
        id: ["new_read_json"],
        class_name: [],
        sound: [],
        sound_name: ["mainmenu_press_news_01.wav"],
        describe: "新读取"
    },
    {
        id: ["submit"],
        class_name: [],
        sound: [],
        sound_name: ["mainmenu_press_play_03.wav"],
        describe: "提交"
    },
    {
        id: ["setting_icon", "setting_icon_div"],
        class_name: [],
        sound: [],
        sound_name: ["mainmenu_press_settings_02.wav"],
        describe: "设置"
    },
    {
        id: [],
        class_name: ["switch", "slider"],
        sound: [],
        sound_name: ["mainmenu_press_settings_01.wav"],
        describe: "设置里面的开关"
    }
    ,
    {
        id: [],
        class_name: ["favourite_svg"],
        sound: [],
        sound_name: ["mainmenu_press_play_02.wav"],
        describe: "收藏"
    }
]

function Sound_obj_template(sound_name, sound) {
    this.sound_name = sound_name
    this.sound = sound
    // this.id = ""
    // this.element_for = ""
}

function Sound_is_clicked(arg) {
    // console.log(arg);
    this.id = arg.id
    let id = arg.id
    this.class_name = arg.class_name
    let class_name = arg.class_name


    return function (e) {
        // console.log(id, id.length, class_name, class_name.length);
        if (id.length != 0) {
            for (let i = 0; i < id.length; i++) {
                let id_each = id[i]
                // console.log(e.target.id, id_each);
                // console.log(e.target.id,id_each);
                if (e.target.id == id_each) {

                    return true
                }
            }
        }
        if (class_name.length != 0) {
            for (let i = 0; i < class_name.length; i++) {
                let class_name_each = class_name[i]
                // console.log(e.target,e.target.classList,class_name_each);
                if (e.target.classList.contains(class_name_each)) {
                    return true
                }
            }

        }

        return false
    }
}

document.getElementById("is_sound_setting").addEventListener("click", () => {
    //背景音乐
    let bgmusic_dir = "static/sound/csgo2/bgmusic/"
    let bgmusic_arr = [
        "上海majar暂停音乐.mp3",
        "The Verkkars & n0thing - 闪光舞 - CSGO音乐盒 - Csgola.com.mp3",
        "The Verkkars - EZ4ENCE - CSGO音乐盒 - Csgola.com.mp3",
        "Neck Deep，痞子帮 - CSGO音乐盒 - Csgola.com.mp3",
        "Neck Deep — 人生何处不青山 - CSGO音乐盒 - Csgola.com.mp3",
        "Daniel Sadowski — 巨龙之眼 - CSGO音乐盒 - Csgola.com.mp3",
        "Blitz Kids — 有为青年 - CSGO音乐盒 - Csgola.com.mp3"
    ]
    // console.log(bgmusic_arr[Math.floor(bgmusic_arr.length * Math.random())]);
    bg_music = new Audio(bgmusic_dir + bgmusic_arr[Math.floor(bgmusic_arr.length * Math.random())])
    bg_music.play()

    bg_music.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);

    for (let i = 0; i < sound_arr.length; i++) {
        let sound_arr_each = sound_arr[i]
        let { id, class_name, sound, sound_name, describe } = sound_arr_each

        if (sound_name.length != 0) {
            let sound = new Audio(sound_dir + sound_name)
            // console.log(sound);

            let is_click = new Sound_is_clicked(
                {
                    id: id,
                    class_name: class_name
                }
            )

            document.getElementsByTagName("body")[0].addEventListener("click", (e) => {
                e.stopPropagation
                if (sound_actived && is_click(e)) {
                    sound.pause()
                    sound.play()
                }
            }
            )
        }

    }
}, { once: true })

// 方法
function sound_setting_fun(e) {
    // console.log(e);
    sound_actived = !sound_actived
    //背景音乐
    if (bg_music == "") return
    if (sound_actived == false) {
        bg_music.pause()

        bg_music.removeEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
    } else {

        bg_music.play()

        bg_music.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
    }
    // console.log(sound_actived);
}


// 2.题目显示
let Setting2_public_fun = {
    wrap_sheet_type_div_display_fun: function (wrap, display) {
        let type_code = wrap.dataset.typeCode
        let wrap_type_div = document.getElementsByClassName("wrap_type_div")
        let sheet_type_div = document.getElementsByClassName("sheet_type_div")
        let is_show = wrap_type_div.dataset.is_show

    },
    is_answer_true_fun: function () {
        let is_answer_true_display_input = document.getElementById("is_answer_true_display")
        let is_answer_true_display = is_answer_true_display_input.dataset.isAnswerTrueDisplay
        if (is_answer_true_display == "1") {
            is_answer_true_display_input.click()
        }
    },
    favourite_display_fun: function () {
        let is_favourite_display_input = document.getElementById("is_favourite_display")
        let is_favourite_display = is_favourite_display_input.dataset.isFavouriteDisplay
        if (is_favourite_display == "1") {
            is_favourite_display_input.click()
        }
    },
    is_answer_true_favourite_display_fun: function () {
        let is_answer_true_favourite_display_input = document.getElementById("is_answer_true_favourite_display")
        let is_answer_true_favourite_display = is_answer_true_favourite_display_input.dataset.isAnswerTrueFavouriteDisplay
        if (is_answer_true_favourite_display == "1") {
            is_answer_true_favourite_display_input.click()
        }
    }

}
function is_answer_true_fun(is_answer_true_display_input) {
    let wrap_arr = document.getElementsByClassName("wrap")

    let is_answer_true_display = is_answer_true_display_input.dataset.isAnswerTrueDisplay
    if (is_answer_true_display == "0") {
        // 仅收藏
        Setting2_public_fun.favourite_display_fun()
        // 错题 + 收藏
        Setting2_public_fun.is_answer_true_favourite_display_fun()
        for (let i = 0; i < wrap_arr.length; i++) {
            let is_answer_true = wrap_arr[i].dataset.isAnswerTrue
            if (is_answer_true == "1") {
                let wrap = wrap_arr[i]
                wrap.style.display = "none"
                let index = wrap.dataset.index
                let sheet_li = document.getElementsByClassName("sheet_li")[index]
                sheet_li.style.display = "none"
            }
        }
    } else if (is_answer_true_display == "1") {
        for (let i = 0; i < wrap_arr.length; i++) {
            let is_answer_true = wrap_arr[i].dataset.isAnswerTrue
            if (is_answer_true == "1") {
                let wrap = wrap_arr[i]
                wrap.style.display = "block"
                let index = wrap.dataset.index
                let sheet_li = document.getElementsByClassName("sheet_li")[index]
                sheet_li.style.display = "block"
            }
        }
    }
    is_answer_true_display_input.dataset.isAnswerTrueDisplay = 1 - is_answer_true_display


}

// 仅收藏显示功能

function favourite_display_fun(is_favourite_display_input) {
    let wrap_type_div = document.getElementsByClassName("wrap_type_div")
    let wrap_arr = document.getElementsByClassName("wrap")
    let is_favourite_display = is_favourite_display_input.dataset.isFavouriteDisplay
    if (is_favourite_display == "0") {
        // 仅错题
        Setting2_public_fun.is_answer_true_fun()
        // 错题 + 收藏
        Setting2_public_fun.is_answer_true_favourite_display_fun()
        for (let i = 0; i < wrap_arr.length; i++) {
            let is_favourite = wrap_arr[i].dataset.isFavourite
            if (is_favourite == "0") {
                let wrap = wrap_arr[i]
                wrap.style.display = "none"
                let index = wrap.dataset.index
                let sheet_li = document.getElementsByClassName("sheet_li")[index]
                sheet_li.style.display = "none"
            }
        }
    } else if (is_favourite_display == "1") {
        for (let i = 0; i < wrap_arr.length; i++) {
            let is_favourite = wrap_arr[i].dataset.isFavourite
            if (is_favourite == "0") {
                let wrap = wrap_arr[i]
                wrap.style.display = "block"
                let index = wrap.dataset.index
                let sheet_li = document.getElementsByClassName("sheet_li")[index]
                sheet_li.style.display = "block"
            }
        }
    }
    is_favourite_display_input.dataset.isFavouriteDisplay = 1 - is_favourite_display
}



// 错题 + 收藏
function is_answer_true_favourite_display_fun(is_answer_true_favourite_display_input) {
    let is_answer_true_favourite_display = is_answer_true_favourite_display_input.dataset.isAnswerTrueFavouriteDisplay
    let wrap_arr = document.getElementsByClassName("wrap")
    if (is_answer_true_favourite_display == "0") {
        // 仅错题
        Setting2_public_fun.is_answer_true_fun()
        // 仅收藏
        Setting2_public_fun.favourite_display_fun()
        for (let i = 0; i < wrap_arr.length; i++) {
            let is_answer_true = wrap_arr[i].dataset.isAnswerTrue
            let is_favourite = wrap_arr[i].dataset.isFavourite
            if (is_favourite == "0" && is_answer_true == "1") {
                let wrap = wrap_arr[i]
                wrap.style.display = "none"
                let index = wrap.dataset.index
                let sheet_li = document.getElementsByClassName("sheet_li")[index]
                sheet_li.style.display = "none"
            }
        }
    } else if (is_answer_true_favourite_display == "1") {
        for (let i = 0; i < wrap_arr.length; i++) {
            let is_answer_true = wrap_arr[i].dataset.isAnswerTrue
            let is_favourite = wrap_arr[i].dataset.isFavourite
            if (is_favourite == "0" && is_answer_true == "1") {
                let wrap = wrap_arr[i]
                wrap.style.display = "block"
                let index = wrap.dataset.index
                let sheet_li = document.getElementsByClassName("sheet_li")[index]
                sheet_li.style.display = "block"
            }
        }
    }
    is_answer_true_favourite_display_input.dataset.isAnswerTrueFavouriteDisplay = 1 - is_answer_true_favourite_display

}

// 3.在新页面重做
function rewrite_fun(type, is_output = "0") {
    // 如果type为数字转为字符
    if (isNumber(type)) {
        type = type.toString()
    }

    // console.log(type);
    let url = window.location.origin + window.location.pathname

    if (json == {} || json == null || json == undefined) {
        if (is_output != "1") {

            // window.open(url)
        }
        console.log("json数据为空或者异常，无法重做。")
        return 0
    }

    if (isDOMObject(type)) {
        type = type.dataset.type
    } else if (isNumber(Number(type))) {
        type = type
    } else {
        Swal.fire({
            title: "重做函数的参数错误，参数如下。这是bug，可以反馈。",
            text: type,
            icon: "error",
        })
        return 0
    }

    let wrap_arr = document.getElementsByClassName("wrap")

    let json_new = {
        "head": json["head"],
        "body": []
    }
    var original_index_arr = []
    var title = "无标题"


    switch (type) {
        case "0":
            if (JSON.stringify(json) != JSON.stringify({})) {
                original_index_arr = ["0"]
            }
            break;
        case "1":
            for (let i = 0; i < wrap_arr.length; i++) {
                let wrap = wrap_arr[i]
                let original_index = wrap.dataset.originalIndex
                original_index_arr.push(original_index)
            }
            break;
        case "2":
            for (let i = 0; i < wrap_arr.length; i++) {
                let wrap = wrap_arr[i]
                let original_index = wrap.dataset.originalIndex
                let is_answer_true = wrap.dataset.isAnswerTrue
                if (is_answer_true == "0") {
                    original_index_arr.push(original_index)
                }
            }
            break;
        case "3":
            for (let i = 0; i < wrap_arr.length; i++) {
                let wrap = wrap_arr[i]
                let original_index = wrap.dataset.originalIndex
                let is_favourite = wrap.dataset.isFavourite

                if (is_favourite == "1") {
                    original_index_arr.push(original_index)
                }
            }
            break;
        case "4":
            for (let i = 0; i < wrap_arr.length; i++) {
                let wrap = wrap_arr[i]
                let original_index = wrap.dataset.originalIndex
                let is_favourite = wrap.dataset.isFavourite
                let is_answer_true = wrap.dataset.isAnswerTrue
                if (is_favourite == "1" || is_answer_true == "0") {
                    original_index_arr.push(original_index)
                }
            }
            break;
        default:
    }
    if (original_index_arr.length == 0) {
        console.log("原始序列为空，无法重做。");
        return 0
    }

    let output_type_arr = ["【全部】", "【页面】", "【错题】", "【收藏】", "【错题+收藏】"]
    let title_repeat = output_type_arr.filter((item) => json["head"]["title"].match(item))
    let title_temp = json["head"]["title"]
    if (title_repeat.length == 0) {
        title = title_temp.replace(".json", "").replace("-导出", "").replace("-", "") + "-" + output_type_arr[type] + "-导出"
    } else {
        title = title_temp.replace(title_repeat[0], "").replace(".json", "").replace("-导出", "").replace("-", "") + "-" + output_type_arr[type] + "-导出"
    }

    if (type == "0") {
        let title_temp = json["head"]["title"]
        if (json != {}) {
            json["head"]["title"] = title
            var json_str = JSON.stringify(json)
            json["head"]["title"] = title_temp
            // console.log(json["head"]["title"])
        } else {
            if (is_output != "1") {
                window.open(url)
            }
            console.log("json数据为空或者异常，无法重做。");
            return 0
        }

    } else {
        for (let i = 0; i < original_index_arr.length; i++) {
            json_new["body"][i] = json["body"][original_index_arr[i]]
        }
        json_new["head"]["create_original_index"] = "0"
        json_new["head"]["title"] = title
        var json_str = JSON.stringify(json_new)
        json["head"]["title"] = title_temp
        // console.log(json["head"]["title"])
    }


    // 函数劫持
    if (is_output == "1") {
        return {
            json_str: json_str,
            title: title,
        }
    }

    localStorage.setItem("json_str", json_str)
    window.open(url + "?rewrite=" + type)

    return 1
}


// 下载函数
let handleDownload = function (content, name = "测试数据", type = "json") {
    let download = document.createElement("a")
    download.style.display = 'block'

    let suffix = "."
    suffix += type

    download.download = name + suffix;
    var blob = new Blob([content], { type: "text/json" });
    download.href = URL.createObjectURL(blob);
    download.click()
}

function output_fun(type) {
    var output_type = ""

    if (isDOMObject(type)) {
        output_type = type.dataset.type
    } else if (isNumber(Number(type))) {
        output_type = type
    } else {
        Swal.fire({
            title: "重做函数的参数错误，参数如下。这是bug，可以反馈。",
            text: type,
            icon: "error",
        })
        return
    }

    let rewrite = document.getElementsByClassName("rewrite")[output_type]
    var { json_str, title } = rewrite_fun(rewrite, "1")

    if (json_str == 0) {
        Swal.fire({
            title: "Are You OK?I'm Sorry.",
            text: "提交后或者收藏后才能导出错题或收藏的题目！",
            icon: "error",
        })
        return 0
    }

    handleDownload(json_str, title)
}

// 更多
function more_setting_fun(e) {
    let is_more_setting = e.dataset.isMoreSetting
    let setting_item = document.getElementsByClassName("setting_item")
    if (is_more_setting == "0") {
        for (let i = 3; i < setting_item.length; i++) {
            setting_item[i].style.display = "block"
        }
        e.innerHTML = `
                        收起
  <svg t="1706003866752" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3681" width="16" height="16"><path d="M195.2 704L512 387.84 828.8 704a32 32 0 0 0 45.44-45.44L534.4 320a32 32 0 0 0-45.44 0l-339.2 339.2a32 32 0 0 0 45.44 45.44z" fill="#2C2C2C" p-id="3682"></path></svg>
        `
    } else if (is_more_setting == "1") {
        for (let i = 3; i < setting_item.length; i++) {
            setting_item[i].style.display = "none"
        }
        e.innerHTML = `
                        更多
                <svg t="1706003531374" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2579"
                    width="16" height="16">
                    <path
                        d="M538.112 639.488l379.904-365.568c13.824-13.824 36.352-13.824 50.176 0 13.824 13.824 13.824 35.84 0 49.664L563.2 724.48c-13.824 13.824-36.352 13.824-50.176 0L108.032 323.584c-13.824-13.824-13.824-35.84 0-49.664s36.352-13.824 50.176 0l379.904 365.568z"
                        fill="#333333" p-id="2580"></path>
                </svg>
        `
    }
    e.dataset.isMoreSetting = 1 - is_more_setting

}

function addEventListener_main_click_and_is_submit() {
    let main_div = document.getElementById("main")
    main_div.addEventListener("click", main_click)

    let submit_div = document.getElementById("submit")
    submit_div.addEventListener("click", is_submit)

    document.getElementById("main").removeEventListener("click", main_wrap_copy_fun)
}

function removeEventListener_main_click_and_is_submit() {
    // 移除事件监听
    let main_div = document.getElementById("main")
    main_div.removeEventListener("click",
        main_click
    )
    // let main_input=document.getElementById("main").getElementsByTagName("input")
    main_input()

    let submit_div = document.getElementById("submit")
    submit_div.removeEventListener("click", is_submit)

    document.getElementById("main").addEventListener("click", main_wrap_copy_fun)

}
function generateCircledNumber(num) {
    return String.fromCharCode(9311 + num);
}

function main(json_body_each, order, index, is_order) {
    let original_index = json_body_each["original_index"]
    let type_code = json_body_each["type_code"]
    let answers_matching_index = json_body_each["answers_matching_index"]
    let answers_matching_index_new = []
    let wrap = document.createElement("div")
    // console.log(json_body_each);
    wrap.className = "wrap"
    wrap.id = "q_typeCode" + type_code + "_" + order
    wrap.dataset.answerMy = "[]"
    wrap.dataset.order = order
    wrap.dataset.index = index
    wrap.dataset.originalIndex = original_index
    wrap.dataset.typeCode = json_body_each["type_code"]
    wrap.dataset.isFavourite = "0"
    wrap.dataset.isAnswerTrue = "-1"
    // wrap.tabIndex = "0"
    wrap.tabIndex = "${order}"
    // console.log(order, wrap.tabIndex, wrap);

    // 收藏功能
    let favourite_div = document.createElement("span")
    favourite_div.className = "favourite_div"
    favourite_div.innerHTML = `
    <svg  width="32" height="32" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" class="favourite">
    <path class="favourite_svg" fill-rule="evenodd" clip-rule="evenodd" d="M19.8071 9.26152C18.7438 9.09915 17.7624 8.36846 17.3534 7.39421L15.4723 3.4972C14.8998 2.1982 13.1004 2.1982 12.4461 3.4972L10.6468 7.39421C10.1561 8.36846 9.25639 9.09915 8.19315 9.26152L3.94016 9.91102C2.63155 10.0734 2.05904 11.6972 3.04049 12.6714L6.23023 15.9189C6.96632 16.6496 7.29348 17.705 7.1299 18.7605L6.39381 23.307C6.14844 24.6872 7.62063 25.6614 8.84745 25.0119L12.4461 23.0634C13.4276 22.4951 14.6544 22.4951 15.6359 23.0634L19.2345 25.0119C20.4614 25.6614 21.8518 24.6872 21.6882 23.307L20.8703 18.7605C20.7051 17.705 21.0339 16.6496 21.77 15.9189L24.9597 12.6714C25.9412 11.6972 25.3687 10.0734 24.06 9.91102L19.8071 9.26152Z" fill="currentColor">
    </path></svg>
    `
    favourite_div.dataset.order = order
    wrap.append(favourite_div)
    let type = json_body_each["type"]
    // 问题
    let q = document.createElement("h3")
    q.className = "q"
    let index_ = order + 1
    q.innerHTML = index_ + ". 【" + type + "】 "
    if (notEmptyValues(json_body_each["questions"])) {
        for (let i = 0; i < json_body_each["questions"].length; i++) {
            q.innerHTML = q.innerHTML + "\n" + json_body_each["questions"][i].replace(/\n/g, "\n")
        }
    } else {
        q.innerHTML = q.innerHTML + "问题缺失!"
    }

    wrap.append(q)
    // 选项
    if (type_code == 1 || type_code == 2 || type_code == 3) {

        var options = json_body_each["options"]
        var options_wrap = document.createElement("div")
        options_wrap.className = "options_wrap"
        if (json_body_each.hasOwnProperty("answers_matching_index")) {
            answers_matching_index = json_body_each["answers_matching_index"]
        } else {
            answers_matching_index = ""
        }

        var options_new = deepCopy(options)
        if (is_order == "0") {
            shuffle(options_new);
        }
        if (answers_matching_index.length != 0) {
            for (let i = 0; i < answers_matching_index.length; i++) {
                answers_matching_index_new.push(options_new.indexOf(options[answers_matching_index[i]]))
            }
            answers_matching_index_new.sort()
            if (type_code == 3) {
                [options_new[1], options_new[0]] = [options_new[0], options_new[1]]
                answers_matching_index_new[0] = 1 - answers_matching_index_new[0]
            }
        }
        var options = options_new
        // console.log("change", options, answers_matching_index_new);
        for (let i = 0; i < options.length; i++) {
            var option_wrap = document.createElement("div")
            option_wrap.className = "option_wrap"

            var option_code = document.createElement("span")
            option_code.className = "option_code"

            // 根据题目类型，设置不同样式
            if (type_code == "1") {
                option_code.className = "option_code option_code_1"
            } else if (type_code == "3") {
                option_code.className = "option_code option_code_3"
            } else if (type_code == "2") {
                option_code.className = "option_code option_code_2"
            }

            option_code.innerHTML = String.fromCharCode(65 + i)
            var option = document.createElement("span")
            option.className = "option"
            option.innerHTML = options[i].replace(/\n/g, "\n")
            option_wrap.append(option_code)
            option_wrap.append(option)
            options_wrap.append(option_wrap)
            wrap.append(options_wrap)
            option_wrap.dataset.order = order
            option_wrap.dataset.optionCode = option_code.innerHTML

            option_wrap.dataset.index = index
            option_wrap.dataset.optionCode = option_code.innerHTML
        }
        wrap.dataset.answersMatchingIndexNew = JSON.stringify(answers_matching_index_new)
    } else if (type_code == 4 || type_code == 5) {
        let answers = json_body_each["answers"]
        if (answers.length == 0) {
            answers.push("空")
        }
        for (let i = 0; i < answers.length; i++) {
            var input_wrap = document.createElement("div")
            input_wrap.className = "input_wrap"
            var input_code = document.createElement("span")
            input_code.className = "input_code"
            var xuhao = generateCircledNumber(i + 1)
            input_code.innerHTML = xuhao + " "
            var input = document.createElement("input")
            input.className = "input"
            input.name = "input"
            input.innerHTML = answers[i]
            input_wrap.append(input_code)
            input_wrap.append(input)
            wrap.append(input_wrap)
            input_wrap.dataset.order = order
            input_wrap.dataset.inputCode = input_code.innerHTML
            input_code.dataset.order = order
            input_code.dataset.inputCode = input_code.innerHTML
            input.dataset.order = order
            input.dataset.inputCode = input_code.innerHTML
        }
        wrap.dataset.answers = JSON.stringify(answers)
    }
    // 答案
    let answer_wrap = document.createElement("div")
    answer_wrap.className = "answer_wrap"
    if (type_code == 1 || type_code == 2 || type_code == 3) {
        var answer_my = document.createElement("span")
        var answer_true = document.createElement("span")
    } else if (type_code == 4 || type_code == 5) {
        var answer_my = document.createElement("div")
        var answer_true = document.createElement("div")
    }
    answer_my.className = "answer_my"
    answer_my.innerHTML = "我的答案："
    answer_true.className = "answer_true"
    answer_true.innerHTML = "正确答案："
    if (type_code == 1 || type_code == 2 || type_code == 3) {
        for (let i = 0; i < answers_matching_index_new.length; i++) {
            answer_true.innerHTML = answer_true.innerHTML + String.fromCharCode(65 + answers_matching_index_new[i])
        }
    } else if (type_code == 4 || type_code == 5) {
        let temp_str = ""
        for (let i = 0; i < json_body_each["answers"].length; i++) {
            temp_str = temp_str + (i + 1) + "." + json_body_each["answers"][i] + "  "
        }
        answer_true.innerHTML = answer_true.innerHTML + temp_str
    }
    let answer_true_display = document.createElement("span")
    answer_true_display.className = "answer_true_display"
    answer_wrap.append(answer_my)
    answer_wrap.append(answer_true)
    answer_wrap.append(answer_true_display)
    let answer_true_arr = []
    answer_true_arr.push(json_body_each["answer"])
    wrap.append(answer_wrap)
    // 解析
    if (json_body_each.hasOwnProperty("analysis") && json_body_each["analysis"].length != 0) {
        let analysis = document.createElement("div")
        analysis.className = "analysis"
        analysis.innerHTML = "解析：" + json_body_each["analysis"]
        analysis.dataset.order = order
        wrap.append(analysis)
    }


    // 复制按钮
    let main_wrap_copy = document.createElement("div")
    main_wrap_copy.className = "main_wrap_copy"
    main_wrap_copy.innerHTML = `
    <svg t="1735674182477" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11823"><path d="M731.68184 676.057473 731.68184 183.323259c0-30.233582-24.512277-54.745858-54.747905-54.745858L184.216093 128.577401c-30.233582 0-54.746882 24.512277-54.746882 54.745858l0 492.734214c0 30.207999 24.5133 54.746882 54.746882 54.746882l492.717841 0C707.16854 730.804355 731.68184 706.265472 731.68184 676.057473zM622.1891 676.057473 238.962975 676.057473c-30.233582 0-54.746882-24.538883-54.746882-54.745858L184.216093 238.07014c0-30.233582 24.5133-54.746882 54.746882-54.746882l383.226125 0c30.233582 0 54.744835 24.512277 54.744835 54.746882l0 383.242498C676.933935 651.51859 652.421658 676.057473 622.1891 676.057473zM841.17458 292.817022l-54.745858 0 0 54.746882c30.232558 0 54.745858 24.5133 54.745858 54.759161l0 383.228171c0 30.206976-24.5133 54.745858-54.745858 54.745858L403.201573 840.297095c-30.233582 0-54.746882-24.538883-54.746882-54.745858l-54.746882 0 0 54.745858c0 30.207999 24.5133 54.747905 54.746882 54.747905l492.719888 0c30.234605 0 54.747905-24.539906 54.747905-54.747905L895.922485 347.563904C895.922485 317.329299 871.408161 292.817022 841.17458 292.817022z" fill="#515151" p-id="11824"></path></svg>
    `
    wrap.append(main_wrap_copy)

    // 自定义属性: 全局索引
    answer_wrap.dataset.order = order
    answer_my.dataset.order = order
    answer_true.dataset.order = order

    // 答题卡
    let sheet_li = document.createElement("li")
    sheet_li.className = "sheet_li"
    sheet_li.dataset.originalIndex = original_index

    // 根据题目类型，设置答题卡不同样式
    if (type_code == "1") {
        sheet_li.className = "sheet_li sheet_li_1"
    } else if (type_code == "3") {
        sheet_li.className = "sheet_li sheet_li_3"
    } else if (type_code == "2") {
        sheet_li.className = "sheet_li sheet_li_2"
    } else if (type_code == "4") {
        sheet_li.className = "sheet_li sheet_li_4"
    } else if (type_code == "5") {
        sheet_li.className = "sheet_li sheet_li_5"
    }

    let sheet_li_a = document.createElement("a")
    sheet_li_a.href = "#q_typeCode" + type_code + "_" + order
    sheet_li_a.innerHTML = order + 1
    sheet_li_a.className = "sheet_li_a"
    sheet_li.append(sheet_li_a)
    return [wrap, sheet_li]
}

function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

function isDOMObject(obj) {
    return obj instanceof Element || obj instanceof HTMLDocument;
}

// 水波纹
const buttons = document.querySelectorAll('.button');
for (const button of buttons) {
    button.addEventListener('mousedown', function (event) {
        ripple_fun(event, button)
    });
}

// output_tool_button
let ripple_arr = [
    {
        id: "output_tool_button",
        "describe": "导出按钮"
    }, {
        id: "back_top",
        "describe": "返回顶部按钮"
    }
]
for (let i = 0; i < ripple_arr.length; i++) {
    let ripple_arr_each = ripple_arr[i]
    let { id } = ripple_arr_each
    let element = document.getElementById(id)
    element.addEventListener("click", (event) => {
        ripple_fun(event, element)
    })
}

document.getElementById("main").addEventListener("click", (event) => {
    if (event.target.classList.contains("option")) {
        ripple_fun(event, event.target)
    } else if (event.target.classList.contains("option_wrap")) {
        ripple_fun(event, event.target.lastElementChild)
    }
})
document.getElementById("sheet").addEventListener("click", (event) => {
    if (event.target.classList.contains("sheet_li_a")) {
        ripple_fun(event, event.target)
    }
})



function ripple_fun(event, element) {
    // 创建水波纹元素
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    // 获取按钮相对位置
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    // 设置水波纹大小和位置
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // 插入水波纹
    element.appendChild(ripple);

    // 动画结束后移除水波纹
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

function notEmptyValues(value) {
    var emptyValue_arr = [null, undefined, "", false, "false", NaN, "{}", "[]"];

    // 检查 NaN
    if (typeof value === "number" && isNaN(value)) {
        return false;
    }

    // 检查空数组
    if (Array.isArray(value) && value.length === 0) {
        return false;
    }

    // 检查空对象（排除数组）
    if (typeof value === "object" && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) {
        return false;
    }

    return emptyValue_arr.includes(value) ? false : true;
    // 如果匹配则返回 false，代表是空值
}



function add_script(href) {
    return new Promise((resolve, reject) => {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = href;
        script.onload = () => resolve(href);
        script.onerror = () => reject(href);
        document.body.appendChild(script);
    });
}

function load_script_with_retry(href, retries = 2) {
    return add_script(href).catch((error) => {
        if (retries > 0) {
            console.warn(`Failed to load ${href}. Retrying... (${retries} retries left)`);
            return load_script_with_retry(href, retries - 1);
        } else {
            throw new Error(`没有加载的JavaScript文件: ${href}<br>可以勾选加载的功能进行导出。<br>（未加载的功能看上面的链接是否包含“docx”,"pdf"关键字）`);
        }
    });
}



document.getElementById("output_tool_bar").addEventListener("click", (e) => {
    swal_toast("正在加载相关js文件", "success", "加载失败请导出为txt或者json格式")
    // swal_toast("正在加载js文件", "success", "第一次可能加载时间长或者失败是由于pdf中文字体文件大小为20MB；其它格式应该没问题。")

    document.getElementById("output_tool_bar").classList.add("output_tool_bar_loading");

    Promise.all([
        // load_script_with_retry("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
        // load_script_with_retry("https://cdn.jsdelivr.net/npm/vxe-table-plugin-export-pdf/fonts/source-han-sans-normal.js"),


        load_script_with_retry("./node_modules/docx/index.umd.js"),

        load_script_with_retry("./js/exercise_output_file.js")
    ]).then(() => {

        console.log("All scripts loaded successfully");
        document.getElementById("output_tool_button").addEventListener("click", output_tool_button)

    }).catch((error) => {
        Swal.fire({
            title: '动态加载脚本失败',
            html: error,
            icon: 'error',
            confirmButtonText: '确认',
            footer: "一共请求了3次，可能不能导出docx。反馈请进QQ群【532147305】反馈，谢谢！",
            // footer: "一共请求了3次，可能是本地网络屏蔽了jsdelivr的cdn，也可能就是cdn挂了。如果可能请进QQ群【532147305】反馈，谢谢！",
            allowOutsideClick: false,
        });
        console.error("Error loading scripts:", error);
    }).finally(() => {
        document.getElementById("output_tool_button").style.backgroundColor = "green";
        document.getElementById("output_tool_bar").classList.remove("output_tool_bar_loading");
    });
}, { once: true });


function swal_toast(title, icon = "success", text) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: icon,
        title: title,
        text: text,
    });
}


