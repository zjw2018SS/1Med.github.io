<template>

    <div id="edit_container">

        <div class="edit_wrap" v-for="edit_container_item in edit_config.edit_container">
            <div class="edit_left_text">{{ edit_container_item.name }}</div>
            <input v-model="edit_container_item.value" v-if="edit_container_item.type == 'input'"
                :placeholder="edit_container_item.name" class="swal2-input" id="edit_name_input"></input>
            <textarea v-else-if="edit_container_item.type == 'textarea'" class="swal2-textarea">
            </textarea>
            <select v-else-if="edit_container_item.type == 'select'" class="swal2-select">
                <optgroup label="安卓手机">
                    <option value="apples">app</option>
                    <option value="bananas">Bananas</option>
                    <option value="grapes">Grapes</option>
                    <option value="oranges">Oranges</option>
                </optgroup>
                <optgroup label="Windows电脑">
                    <option value="potato">Potato</option>
                    <option value="broccoli">Broccoli</option>
                    <option value="carrot">Carrot</option>
                </optgroup>
                <option value="icecream">开源项目</option>
            </select>
        </div>



    </div>

</template>


<script>
import { reactive, ref, createApp } from "vue";

const edit_config = ref({
    edit_container: [
        {
            name: "名称",
            type: "input",
            value: ""
        },
        {
            name: "链接",
            type: "input",
            value: ""
        },
        {
            name: "官网",
            type: "input",
            value: ""
        },
        {
            name: "开源地址",
            type: "input",
            value: ""
        }
        ,
        {
            name: "详情",
            type: "textarea",
            value: ""
        }
        ,
        {
            name: "平台/类型",
            type: "select",
            value: ""
        }
    ]
})

export default {
    edit_config,

    setup() {

        return {

            edit_config
        }
    }
}


</script>


<style></style>
