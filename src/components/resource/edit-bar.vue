<template>
    <div id="edit_bar" v-on:click="edit_bar_type_fun">
        <div class="edit_bar_item" data-edit-type="new">
            <svg t="1728812823318" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="16134">
                <path
                    d="M186.181818 139.636364h291.781818a93.090909 93.090909 0 0 1 73.984 36.584727l317.963637 416.349091a23.272727 23.272727 0 0 1-16.791273 37.329454l-735.045818 54.295273A23.272727 23.272727 0 0 1 93.090909 660.980364V232.727273a93.090909 93.090909 0 0 1 93.090909-93.090909z"
                    fill="#F88E02" p-id="16135"></path>
                <path
                    d="M186.181818 232.727273h651.636364a93.090909 93.090909 0 0 1 93.090909 93.090909v465.454545a93.090909 93.090909 0 0 1-93.090909 93.090909H186.181818a93.090909 93.090909 0 0 1-93.090909-93.090909V325.818182a93.090909 93.090909 0 0 1 93.090909-93.090909z"
                    fill="#FFBE48" p-id="16136"></path>
                <path
                    d="M628.363636 535.272727a23.272727 23.272727 0 0 1 1.745455 46.487273L628.363636 581.818182H395.636364a23.272727 23.272727 0 0 1-1.745455-46.487273L395.636364 535.272727h232.727272z"
                    fill="#FFFFFF" p-id="16137"></path>
                <path
                    d="M512 418.909091a23.272727 23.272727 0 0 1 23.214545 21.527273L535.272727 442.181818v232.727273a23.272727 23.272727 0 0 1-46.487272 1.745454L488.727273 674.909091V442.181818a23.272727 23.272727 0 0 1 23.272727-23.272727z"
                    fill="#FFFFFF" p-id="16138"></path>
            </svg>
        </div>
        <div class="edit_bar_item" data-edit-type="back">
            <svg t="1728813177714" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="4174">
                <path
                    d="M384 640c-12.8 0-21.333333 0-29.866667-12.8l-213.333333-213.333333c-17.066667-17.066667-17.066667-42.666667 0-59.733334l213.333333-213.333333c17.066667-17.066667 42.666667-17.066667 59.733334 0 17.066667 17.066667 17.066667 42.666667 0 59.733333L230.4 384l183.466667 183.466667c17.066667 17.066667 17.066667 42.666667 0 59.733333-17.066667 17.066667-21.333333 12.8-29.866667 12.8z"
                    fill="#040000" p-id="4175"></path>
                <path
                    d="M853.333333 896c-25.6 0-42.666667-17.066667-42.666666-42.666667v-298.666666c0-72.533333-55.466667-128-128-128H170.666667c-25.6 0-42.666667-17.066667-42.666667-42.666667s17.066667-42.666667 42.666667-42.666667h512c119.466667 0 213.333333 93.866667 213.333333 213.333334v298.666666c0 25.6-17.066667 42.666667-42.666667 42.666667z"
                    fill="#040000" p-id="4176"></path>
            </svg>
        </div>
        <div class="edit_bar_item" data-edit-type="next">
            <svg t="1728813192194" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="4335">
                <path
                    d="M640 640c-12.8 0-21.333333 0-29.866667-12.8-17.066667-17.066667-17.066667-42.666667 0-59.733333L793.6 384l-183.466667-183.466667c-17.066667-17.066667-17.066667-42.666667 0-59.733333 17.066667-17.066667 42.666667-17.066667 59.733334 0l213.333333 213.333333c17.066667 17.066667 17.066667 42.666667 0 59.733334l-213.333333 213.333333c-8.533333 8.533333-21.333333 12.8-29.866667 12.8z"
                    fill="#040000" p-id="4336"></path>
                <path
                    d="M170.666667 896c-25.6 0-42.666667-17.066667-42.666667-42.666667v-298.666666c0-119.466667 93.866667-213.333333 213.333333-213.333334h512c25.6 0 42.666667 17.066667 42.666667 42.666667s-17.066667 42.666667-42.666667 42.666667H341.333333c-72.533333 0-128 55.466667-128 128v298.666666c0 25.6-17.066667 42.666667-42.666666 42.666667z"
                    fill="#040000" p-id="4337"></path>
            </svg>
        </div>

    </div>


</template>


<script setup>

import { reactive, ref, createApp } from "vue";

import Swal from 'sweetalert2';


// 编辑组件
import edit from "./edit.vue"
console.log(edit);

function edit_bar_type_fun(event) {

    let edit_bar_item = event.target.closest(".edit_bar_item")
    if (edit_bar_item) {
        let edit_type = edit_bar_item.dataset.editType

        // console.log(edit_type);
        switch (edit_type) {
            case "new":
                Swal.fire({
                    title: "资源笔记",


                    allowOutsideClick: false,

                    showCloseButton: true,
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: '创建',
                    denyButtonText: "重置",
                    cancelButtonText: '取消',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    denyButtonColor: "#6e7881",

                    willClose: (event) => {
                        // 弹窗即将关闭，可以在这里执行操作
                        // edit_v.unmount()
                    },
                }).then((result) => {

                    if (result.isConfirmed) {
                        /*                         Swal.fire({
                                                    title: "是否创建？",
                                                }); */

                    } else if (result.isDenied) {
                        Swal.fire("确认重置吗？", "", "info").then(
                            (result) => {
                                if (result.isConfirmed) {

                                }
                            }
                        )
                    } else {
                    }

                })
                createApp(edit).mount("#swal2-html-container")

                break;
            case "back":

                break;
            case "next":

                break;

            default:
                break;
        }
    }
}







</script>


<style></style>