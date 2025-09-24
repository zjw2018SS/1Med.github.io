








let edit_temp_ = document.getElementById("edit_temp")
// var edit_html = edit_temp.innerHTML
var edit_html = edit_temp_.innerHTML
edit_temp.innerHTML = ""

// console.log(edit_html, edit_temp);






document.getElementById("edit_box").addEventListener("click", edit_fun)

function edit_fun(event) {


    // console.log(event.target.closest(".edit_bar_item"));
    let edit_bar_item = event.target.closest(".edit_bar_item")
    let edit_type = 0
    if (edit_bar_item != null) {
        edit_type = edit_bar_item.dataset.editType

    }
    // console.log(edit_bar_item ,edit_type);
    switch (edit_type) {
        case "new":


            Swal.fire({

                title: "资源笔记",

                allowOutsideClick: false,

                html: edit_html,

                showCloseButton: true,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: '创建',
                denyButtonText: "重置",
                cancelButtonText: '取消',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                denyButtonColor: "#6e7881"
            }).then((result) => {

                if (result.isConfirmed) {

                    let edit_name = document.getElementById("edit_name_input").value

                    Swal.fire({
                        title: "sucess",
                        text: edit_name
                    });


                } else if (result.isDenied) {
                    Swal.fire("确认重置吗？", "", "info");
                }
            })


            break;
        case "back":

            break;
        case "next":

            break;

        default: 0
            break;
    }


}


