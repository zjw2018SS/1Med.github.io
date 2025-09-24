Swal.fire({
    title: "确认重做吗？",
    text: "重新生成将覆盖您以前的内容（题目顺序，数量不变）！",
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