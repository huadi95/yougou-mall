import {
    request
} from "../../request/index";
Page({
    /**
     * 页面的初始数据
     */
    data: {
        leftMenuList: [],
        rightContentList: [],
        currentIndex: 0,
        scrollTop: 0
    },
    catesData: [],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //获取本地存储的接口数据
        const Cates = wx.getStorageSync("cates");
        if (!Cates) {
            //本地存储如果还没有接口数据，就调用this.getCategoryList()进行本地存储
            this.getCategoryList();
        } else {
            //有旧的数据定义过期时间为5分钟
            if (Date.now() - Cates.time > 1000 * 60 * 5) {
                //旧数据过期重新进行调用this.getCategoryList()进行本地存储
                this.getCategoryList();
            } else {
                //旧数据正常获取
                this.catesData = Cates.data;
                this.setData({
                    //获取左边列表的数据
                    leftMenuList: this.catesData.map(item => item.cat_name),
                    //获取右边内容的数据
                    rightContentList: this.catesData[0].children
                });
            }
        }
    },
    //获取分类商品数据
    async getCategoryList() {
        /* request("/categories").then(
            res => {
                this.catesData = res.data.message;
                //将接口数据存入在本地存储当中
                wx.setStorageSync("cates", { time: Date.now(), data: this.catesData });
                this.setData({
                    //获取左边列表的数据
                    leftMenuList: this.catesData.map(item => item.cat_name),
                    //获取右边内容的数据
                    rightContentList: this.catesData[0].children
                });
            }
        ); */
        const res = await request({
            url: "/categories"
        });
        this.catesData = res;
        //将接口数据存入在本地存储当中
        wx.setStorageSync("cates", {
            time: Date.now(),
            data: this.catesData
        });
        this.setData({
            //获取左边列表的数据
            leftMenuList: this.catesData.map(item => item.cat_name),
            //获取右边内容的数据
            rightContentList: this.catesData[0].children
        });
    },
    //左边菜单的点击事件
    handleItemTap(e) {
        //1.获取被点击标题的索引
        let index = e.currentTarget.dataset.index;
        this.setData({
            //2.给currentIndex赋值
            currentIndex: index,
            //3.根据不同的索引渲染右边的内容
            rightContentList: this.catesData[index].children,
            //4.点击列表菜单后，让右边内容进行置顶
            scrollTop: 0
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {}
});