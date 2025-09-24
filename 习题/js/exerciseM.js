let nav_center = document.getElementById("nav_center");
nav_center.addEventListener("click", nav_center_display);

function nav_center_display() {
    let nav_center = document.getElementById("nav_center");
    let main=document.getElementById("main");
    let is_nav_center_display = nav_center.dataset.isNavCenterDisplay
    let sheet = document.getElementById("sheet")
    if (is_nav_center_display == "0") {
        sheet.style.visibility = "visible"
        // scrControl(0, main)
    } else if (is_nav_center_display == "1") {
        sheet.style.visibility = "hidden"
        // scrControl(1, main)
    }
    nav_center.dataset.isNavCenterDisplay = 1 - is_nav_center_display

}

// console.log(isPrivateIP(location.hostname), location.hostname);
if (isPrivateIP(location.hostname)){
    window.isCloseHint = true;
    // 初始化关闭
    window.addEventListener("beforeunload", function (e) {
        if (window.isCloseHint) {
            var confirmationMessage = "要记得保存！你确定要离开我吗？";
            (e || window.event).returnValue = confirmationMessage; // 兼容 Gecko + IE
            this.alert(confirmationMessage);
            return confirmationMessage; // 兼容 Gecko + Webkit, Safari, Chrome
        }
    });
}

function isPrivateIP(ip) {
    const privateIPRegex = /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})$/;
    return privateIPRegex.test(ip);
}

/* const currentIP = "'127.0.0.1'"; // 示例IP地址
if (isPrivateIP(currentIP)) {
    console.log("当前网页域名在局域网内");
} else {
    console.log("当前网页域名不在局域网内");
} */