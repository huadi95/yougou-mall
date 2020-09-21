import {
    getSetting,
    openSetting,
    chooseAddress,
    showToast,
    showModel
} from '../../utils/addressWx';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const address = wx.getStorageSync("address");
        this.setData({
            address
        })
    },
    //添加收货地址
    async handleAddAddress() {
        try {
            //1.获取权限
            let res = await getSetting();
            //2.判断权限状态
            let scopeAddress = res.authSetting["scope.address"];
            if (scopeAddress === false) {
                //3.用户以前拒绝过授予权限，想再次获取地址时，先诱导用户打开权限页面
                await openSetting();
            };
            //4.调用函数获取收货地址
            let address = await chooseAddress();
            address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
            //5.上传收货地址到data中和本地存储中
            this.setData({
                address
            });
            wx.setStorageSync("address", address);
        } catch (error) {
            console.log(error)
        }
    }
})