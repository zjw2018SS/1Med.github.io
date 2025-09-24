








function output_tool_button() {
    try {

        Swal.fire({
            title: "确认导出？",
            text: "即将下载文件，如果不能下载是bug，请复制网址发给站长并告知操作进行反馈。",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "导出",
            cancelButtonText: "取消",
            showLoaderOnConfirm: true,
            footer: "浏览器版本低,不是edge、chrome浏览器和手机平板浏览器都可能会导致下载失败。",
            preConfirm: () => {
                let file_type_arr = []
                let question_type_arr = []

                // 1.首先获取需要导出的题目类型
                let output_tool_question_type_items = document.getElementById("output_tool_question_type").getElementsByClassName("output_tool_question_type_item")
                for (let i = 0; i < output_tool_question_type_items.length; i++) {
                    let output_tool_question_type_item = output_tool_question_type_items[i]
                    let output_tool_question_type_button = output_tool_question_type_item.getElementsByTagName("input")[0]
                    // 判断output_tool_question_type_item里面的多选框是否选中
                    if (output_tool_question_type_button.checked) {
                        question_type_arr.push(i)
                    }
                }

                // 2.判断导出时需要的格式
                let output_tool_file_type_items = document.getElementById("output_tool_file_type").getElementsByClassName("output_tool_file_type_item")
                for (let i = 0; i < output_tool_file_type_items.length; i++) {
                    let output_tool_file_type_item = output_tool_file_type_items[i]
                    let output_tool_file_type_button = output_tool_file_type_item.getElementsByTagName("input")[0]
                    // 判断output_tool_file_type_item里面的多选框是否选中
                    if (output_tool_file_type_button.checked) {
                        file_type_arr.push(i)
                    }
                }
                // console.log("类型数组：", file_type_arr, question_type_arr);

                // rewrite_fun()
                if (file_type_arr.length == 0 || question_type_arr.length == 0) {
                    Swal.fire({
                        title: "导出失败",
                        text: "请选择导出的题目类型和格式",
                        icon: "error",
                    })
                    return 0
                }


                for (let i = 0; i < file_type_arr.length; i++) {
                    let file_type = file_type_arr[i]

                    switch (file_type) {
                        case 0:
                            Output_File_Download(question_type_arr, file_type)
                            break;
                        case 1:
                            Output_File_Download(question_type_arr, file_type)
                            break;
                        case 2:
                            Output_File_Download(question_type_arr, file_type)
                            break;
                        case 3:
                            for (let j = 0; j < question_type_arr.length; j++) {
                                let question_type = question_type_arr[j]
                                output_fun(question_type, "1")
                            }
                            break;
                        case 4:

                            break;
                        default:

                    }
                }
            }


        })
    } catch (error) {
        Swal.fire({
            title: "导出失败",
            text: "这个功能的bug比较多，可以复制网址发给站长并告知操作进行反馈。",
            icon: "error",
            footer: error,
        })
    }
}




function Output_File_Download(question_type_arr, file_type, is_output = "0") {
    // console.log(question_type_arr, file_type);
    for (let j = 0; j < question_type_arr.length; j++) {
        let question_type = question_type_arr[j]
        let result = rewrite_fun(question_type, "1")
        if (result == 0) {
            console.log("json为空，请检查选择导出的类型");
            Swal.fire({
                title: '至少有一个题目类型的数据为空，请检查选择导出的类型，可能是【收藏】【错题】',
                // html: ,
                icon: 'error',
                confirmButtonText: '确认',
            });
            continue
        }
        let { json_str, title } = result
        let json_temp = JSON.parse(json_str)
        let output_str = "学习交流，题库分享，功能建议，问题反馈 : 医鸣惊人QQ群 【532147305】 \n\n" + title + "\n\n"
        for (let k = 0; k < json_temp["body"].length; k++) {
            let json_body_each = json_temp["body"][k]
            let questions = notEmptyValues(json_body_each["questions"]) ? (json_body_each["questions"] + "").replace(/\n/g, "") : "#问题缺失#"
            let type = json_body_each["type"]
            // let type_code = json_body_each["type_code"]
            let options = notEmptyValues(json_body_each["options"]) ? json_body_each["options"].map((item, index) => {
                return `${String.fromCharCode(65 + index)}.${item}`.replace(/\n/g, "");
            }).join("\n") : ""
            let answers = notEmptyValues(json_body_each["answers"]) ? (json_body_each["answers"] + "").replace(/\n/g, "") : "#无答案#"
            let analysis = notEmptyValues(json_body_each["analysis"]) ? "解析：" + (json_body_each["analysis"] + "").replace(/\n/g, "") : ""
            output_str += `${k + 1} . 【${type}】 ${questions} \n${options} \n正确答案：${answers} \n${analysis}\n`
        }
        if (is_output == "1") {


            return { output_str, title }
        }

        // return 0
        if (file_type == 0) {
            output_file_content_pdf({ output_str, title })
        } else if (file_type == 1) {
            output_file_content_docx({ output_str, title })
        } else if (file_type == 2) {
            let file_type_arr = [".pdf", ".docx", "txt", "json", "csv"]
            handleDownload(output_str, title, file_type_arr[file_type])
        }
    }

    return 0
}



 function output_file_content_pdf({ output_str, title }) {
    // const { output_str, title } = new Output_File_Download(question_type_arr, file_type, 1)
    // 使用 jsPDF 创建一个 PDF 实例
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.addFont('SourceHanSans-Normal.ttf', 'SourceHanSans-Normal', 'normal');
    doc.setFont('SourceHanSans-Normal');
    doc.setFontSize(12); // 设置字体大小
    const pageHeight = doc.internal.pageSize.height; // 页面高度
    const margin = 10; // 上下边距
    const lineHeight = 10; // 每行高度
    const startY = margin; // 起始 Y 坐标
    // 添加内容
    const textLines = doc.splitTextToSize(output_str, doc.internal.pageSize.width - margin * 2);
    let cursorY = startY;
    // 遍历每一行并分页
    textLines.forEach((line, index) => {
        // let currentPage=index+1
        // 如果超出页面高度，添加新页面并重置 Y 坐标
        if (cursorY + lineHeight > pageHeight - margin) {
            doc.addPage();
            cursorY = startY;
        }
        // 渲染当前行
        doc.text(line, margin, cursorY);
        // doc.text(`Page ${currentPage}`, pageWidth - margin, pageHeight - margin);
        cursorY += lineHeight;
    });
    // 下载 PDF 文件
    doc.save(`${title}.pdf`); // 指定文件名
} 

function output_file_content_docx({ output_str, title }) {
    console.log("output_str", output_str);
    const { Document, Packer, Paragraph, TextRun } = window.docx;

    // 示例字符串
    // const content = "这是一个示例字符串，用于生成 DOCX 文档。";

    // 创建一个新的文档
    const doc = new Document({
        sections: [
            {
                properties: {}, // 部分的属性，可以为空对象
                children: output_str.split('\n').map(line => new Paragraph(line)),
            },
        ],
    });

    // 将文档打包并生成 Blob

    Packer.toBlob(doc).then(blob => {
        // 创建下载链接
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${title}.docx`;
        link.click();
    });
}