<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>组件管理</el-breadcrumb-item>
            <el-breadcrumb-item>Markdown</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <mavon-editor v-model="content" ref="md" @change="handleChange" style="height: 700px"/>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "Markdown",
    data() {
        return {
            content: '## Mavon-Editor\n ' +
                '**MavonEditor** 是一款基于 **Vue** 的 **Markdown** 编辑器，该编辑器支持简单的富文本编写工作。\n' +
                '## 强调\n' +
                '**Markdown** 中可以使用成对星号将文本包含在内以表示某种形式，如\n' +
                '* \\*强调\\* 表示 *强调*。\n' +
                '* \\*\\*强调\\*\\* 表示 **强调**。\n' +
                '* \\*\\*\\*强调\\*\\*\\* 表示 ***强调***。\n' +
                '\n' +
                '删除线使用两队~表示, 即 \\~\\~删除线\\~\\~ 表示 ~~删除线~~。\n' +
                '## 标题\n' +
                '在每个标题开头使用1\\~6个#，分别对应1\\~6级标题。如\n' +
                '> \\#\\#\\#\\# 四级标题\n' +
                '\n' +
                '#### 四级标题\n' +
                '\n' +
                '## 列表\n' +
                '**Markdown** 支持有序列表和无序列表。\n' +
                '无序列表\n' +
                '* 无序列表使用 \*、\+或\-以及一个空格进行书写。\n' +
                '+ 这三个符号是可以相互替换的。\n' +
                '- 当输入这三个符号中的任意一个并输入 `space` 后，**Markdown** 编辑器会自定转换为无序列表。\n' +
                '\n' +
                '有序列表\n' +
                '1. 有序列表使用数字加英文状态下的句号以及一个紧随其后的空格进行书写。\n' +
                '1. 其中，有序列表前面的数字可以按照任意顺序书写，甚至可以重复使用。\n' +
                '\n' +
                '## 块引用\n' +
                '**Markdown** 使用email样式的 `>` 作为块引用。最好对引用文本采取强制换行并在每一行行首放置一个 `>`， ' +
                '**Markdown** 编辑器支持块引用嵌套，块引用可以使用 **Markdown** 编辑器支持的元素。如\n' +
                '```\n' +
                '> 这是一个块引用\n' +
                '```\n' +
                '> 这是一个块引用\n' +
                '## 代码块\n' +
                '**Markdown** 的代码块功能十分实用。行内代码使用 \\`\\` 插入， 而段内代码使用 \\`\\`\\`\\`\\`\\` 插入。如 ' +
                '\\`Math.abs(int a)\\` 表示 `Math.abs(int a)`，而\n' +
                '\\`\\`\\`\n' +
                'import static java.util.function.BiFunction\n' +
                '\\`\\`\\`\n' +
                '表示\n' +
                '```java\n' +
                'import static java.util.function.BiFunction\n' +
                '```\n' +
                '## 水平线\n' +
                '**Markdown** 中，只要有三个及以上的连字符（-），星号（*）或者下划线（_），编辑器就会自动生成水平线。' +
                '星号和连字符之间的空格也是允许的。如\n' +
                '***\n' +
                '## 链接\n' +
                '**Markdown** 支持两种链接形式：内联和引用。' +
                '内联链接形式如下：\n' +
                '```\n' +
                '点击[百度](https://www.baidu.com)， 你就知道。\n' +
                '```\n' +
                '表示\n' +
                '点击[百度](https://www.baidu.com)， 你就知道。\n' +
                '引用链接形式如下：\n' +
                '```\n' +
                '点击[百度][baidu]\n' +
                '\n' +
                '[baidu]: https://www.baidu.com\n' +
                '```\n' +
                '表示' +
                '点击[百度](https://www.baidu.com)，你就知道。\n' +
                '## 图片\n' +
                '**Markdown** 提供了类似链接的方式来插入图片。通常情况下如\n' +
                '```\n' +
                '![](https://img-blog.csdnimg.cn/20200127110033628.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODczNDYx,size_16,color_FFFFFF,t_70)\n' +
                '```\n' +
                '表示\n' +
                '![](https://img-blog.csdnimg.cn/20200127110033628.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE0ODczNDYx,size_16,color_FFFFFF,t_70)\n' +
                '注意，**Markdown** 无法指定图片的尺寸。因此若需要指定图片大小，可使用 `<img>` 标签。\n' +
                '***\n' +
                '## 写在后面的话\n' +
                '用户除了可以使用上述所讲的 **Markdown** 各种标签以外，还可以直接使用该编辑器的工具栏的各种工具。',
            html: ''
        }
    },
    methods: {
        handleChange(value, render) {
            this.html = render;
        }
    }
}
</script>

<style scoped>

</style>
