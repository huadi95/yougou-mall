// pages/auth/index.js
import {
    request
} from "../../request/index";
import {
    login
} from '../../utils/addressWx'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaultToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
    },
    //授权
    async handleAuth(e) {
        try {
            //1.获取用户的信息
            const {
                encryptedData,
                rawData,
                iv,
                signature
            } = e.detail;
            //2.获取用户登录后的code
            const {
                code
            } = await login()
            const loginParams = {
                    encryptedData,
                    rawData,
                    iv,
                    signature,
                    code
                }
                //3.发送请求，获取用户的token
            const res = await request({
                url: "/users/wxlogin",
                data: loginParams,
                method: "post"
            })


            //重要，上面1-3步骤是在有企业版微信小程序账号才能实现的，没有企业版微信小程序账号请求回来是个null，获取不了
            //下面是使用默认的token模拟的场景
            wx.setStorageSync("token", this.data.defaultToken);
            //返回上一页
            wx.navigateBack({
                delta: 1
            })
        } catch (err) {
            console.log(err)
        }
    }

})