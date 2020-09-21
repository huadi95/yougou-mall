// pages/user/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        collectNum: 0
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        //获取本地缓存中的用户信息
        const userInfo = wx.getStorageSync("userInfo");
        //获取本地缓存中的收藏数组
        const collect = wx.getStorageSync("collect") || [];
        this.setData({
            userInfo,
            collectNum: collect.length
        })
    },

})