# meCoursePopup
ME小课弹窗
用法：
先引入js
```
<script src="javascripts/meCoursePopup.js"></script>
```
调用全局函数，传参
```
meCoursePopup({
    trigger:'#hehe',//绑定元素的id，绑定后点击该元素弹出弹窗
    shownow:false,//是否直接弹出-布尔
    courseName:'1-1《动物的防御漫谈：自己骗自己的黄苇鳽》',//头部的课程名称-字符串,
    starAmount:2,//星星数量-数值
    cont:['现在只有2颗星','去分享你讲的故事就可以获得3颗星'],//两行提示文字
    button: [
        {value: '按钮内容', type: '按钮类型，下文详细说明', link: '跳转链接', callback: 回调函数},
        {value: '呵呵哒', type: ''}
    ]
});
```
button的type取两个值share和lection，一个是分享，一个是去听课；不填则显示默认样式。
link和callback，填写则有效果，没填写什么也不做。

