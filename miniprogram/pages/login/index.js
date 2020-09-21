// pages/login/index.js
Page({
    //获取登录信息
    handleGetUserInfo(e) {
        //1.获取登录信息
        const {
            userInfo
        } = e.detail
            //2.将获取的登录信息上传到本地存储
        wx.setStorageSync("userInfo", userInfo);
        //3.返回上一页
        wx.navigateBack({
            delta: 1
        })
    }
})