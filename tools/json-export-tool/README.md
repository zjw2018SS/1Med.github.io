# JSON 题库生成工具

这个工具把纯文本题库按正则规则转换成新版做题页可读取的 JSON。

## 入口

- `index.html`：文本转 JSON 主工具。
- `tool/society.html`：社会学统计题转换工具。

## 输出结构

主工具输出可以直接导入新版做题页。推荐结构如下：

```json
{
  "head": {
    "filename": "题库名称",
    "course": "课程名称",
    "source": "来源",
    "author": "整理者",
    "time": "生成时间",
    "id": "生成 ID"
  },
  "body": [
    {
      "questions": ["题干"],
      "type": ["单选题"],
      "type_code": "1",
      "options": ["A 选项", "B 选项"],
      "answers": ["A"],
      "answers_matching_index": [0],
      "analysis": ["解析"]
    }
  ]
}
```

新版做题页也接受数组形式的题库，但正式维护建议使用带 `head` 和 `body` 的对象形式。

## 预览

点击工具里的预览按钮会打开 `#/practice/exercise?toolPreview=1`。工具会临时写入一个 `1med:tool-preview-bank` localStorage key；做题页读取后会立即删除这个临时值。
