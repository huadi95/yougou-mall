// pages/collect/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 0,
                name: "商品收藏",
                isActive: true
            },
            {
                id: 1,
                name: "品牌收藏",
                isActive: false
            },
            {
                id: 2,
                name: "店铺收藏",
                isActive: false
            },
            {
                id: 3,
                name: "浏览足迹",
                isActive: false
            }
        ],
        collect: []
    },
    //监听子组件传过来的自定义事件，改变标题选中状态
    handleTabsItemChange(e) {
        //1.获取标题当前的索引
        let index = e.detail.index;
        this.changeTitleByIndex(index);
        this.getCollect(index + 1);
    }, //根据标题来索引激活选中标题数组
    changeTitleByIndex(index) {
        //修改源数组
        let tabs = this.data.tabs;
        tabs.forEach((v, i) =>
            i === index ? (v.isActive = true) : (v.isActive = false)
        );
        //赋值到data中
        this.setData({
            tabs
        });
    },
    //给对应的页面添加数据
    getCollect(index) {
        //1.获取本地缓存中的商品收藏数据
        const collect = wx.getStorageSync("collect") || [];
        //2.判断是否在商品收藏页
        if (index == 1) {
            //当页面再商品收藏页时，将商品收藏的数组赋值进data中
            this.setData({
                collect
            })
        } else {
            //否则为空，因为其他的收藏数据没有获取
            this.setData({
                collect: []
            })
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        //1.获取当前的小程序页面栈-数组
        const pages = getCurrentPages();
        //2.数组中索引最大的就是当前页面
        const current = pages[pages.length - 1];
        //3.获取url上的type参数
        const {
            type
        } = current.options;
        //4.激活选中页面标题当
        this.changeTitleByIndex(type - 1);
        this.getCollect(type);
    }
})