import {
    request
} from "../../request/index";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods: [],
        //控制取消按钮的显示隐藏
        isCancel: false,
        //控制文本框文字清除
        isValue: '',
    },
    //进行防抖用的
    timeId: -1,
    //监听输入框输入文字触发事件
    handleInput(e) {
        //1.获取输入框的值
        let {
            value
        } = e.detail;
        //2.判断合理性
        if (!value.trim()) {
            //值不合理
            this.setData({
                isCancel: false,
                goods: [],
                isValue: ''
            })
            return;
        }
        //当有文字输入时，取消按钮显示
        this.setData({
                isCancel: true,
                isValue: value
            })
            //3.进行防抖
            //3.1当输入框继续输入时停止定时器运行
        clearTimeout(this.timeId)

        //3.2当输入框继续输入时会先终止，输入完成停止一秒才执行
        this.timeId = setTimeout(() => {
            this.qSearch(value)
        }, 1000)
    },
    //根据输入框的value值获取推荐商品
    async qSearch(query) {
        //1.通过传过来的值进行数据请求
        const res = await request({
                url: "/goods/qsearch",
                data: {
                    query
                }
            })
            //2.将获取到的数据传入data中
        this.setData({
            goods: res
        })
    },
    //点击取消按钮事件
    handleCancel() {
        //隐藏取消按钮，清除文本框文字，清空推荐商品数据
        this.setData({
            isCancel: false,
            isValue: '',
            goods: []
        })
    }
})