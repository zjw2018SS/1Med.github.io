
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

// 1.答案是否悬停显示

let answer_arr = document.getElementsByClassName("colorGreen marginRight40 fl");
for (let i = 0; i < answer_arr.length; i++) {
    // answer_arr[i].style.display = "none"
    answer_arr[i].style.transform = 'scale(1)';
    answer_arr[i].classList.add("show")
}



function is_hide_answer_true_fun() {
    if (_is_show == "show") {
        _is_show = "hide"
        let answer_show = document.getElementById("answer_show")
        answer_show.innerText = "显示答案"
        let answer_arr = document.getElementsByClassName("colorGreen marginRight40 fl");
        for (let i = 0; i < answer_arr.length; i++) {
            // answer_arr[i].style.display = "none"
            answer_arr[i].classList.remove("show")
            answer_arr[i].classList.add("hide")
        }
    } else if (_is_show == "hide") {
        _is_show = "show"
        let answer_show = document.getElementById("answer_show")
        answer_show.innerText = "隐藏答案"
        let answer_arr = document.getElementsByClassName("colorGreen marginRight40 fl");
        for (let i = 0; i < answer_arr.length; i++) {
            // answer_arr[i].style.display = "none"
            answer_arr[i].classList.remove("hide")
            answer_arr[i].classList.add("show")
        }
    }
    // console.log(_is_show);

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
function immerse_setting_fun(immerse_setting_input) {
    let is_immerse_setting = immerse_setting_input.dataset.isImmerseSetting
    // let nav = document.getElementById("nav")
    // let back_top = document.getElementById("back_top")
    if (is_immerse_setting == "0") {
        // nav.style.display = "none"
        // back_top.style.display = "none"
        openFullscreen(elem)

    } else if (is_immerse_setting == "1") {
        // nav.style.display = "flex"
        // back_top.style.display = "block"
        closeFullscreen(elem)

    }
    immerse_setting_input.dataset.isImmerseSetting = 1 - is_immerse_setting
}