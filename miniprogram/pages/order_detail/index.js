import {
    showToast,
    showModel
} from '../../utils/addressWx';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderGoodsList: {},
        address: {},
        type: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //1.获取订单页传过来的订单编号
        const {
            order_number,
            type
        } = options;
        //2.获取本地缓存中的所有订单数据的数组
        const orders = wx.getStorageSync("orders");
        //3.获取本地存储中的收货地址
        const address = wx.getStorageSync("address");
        //4.根据传过来的订单编号筛选对应的订单
        const orderGoodsList = orders.filter(v => v.order_number == order_number);
        //5.将获取的数据传人data中
        this.setData({
                orderGoodsList: orderGoodsList[0]
            })
            //6.将type值上传到本地存储
        wx.setStorageSync("isType", type);
    },
    //将当前订单进行付款
    async handleOrderPay() {
        //1.弹出模态框确认是否要购买商品
        const res = await showModel({
            content: "您确定要购买商品吗？"
        });
        //2.对是否确认购买进行一个判断
        if (res.confirm) {
            //确认购买
            //1.获取data中的orderGoodsList
            const {
                orderGoodsList
            } = this.data;
            //2.将orderGoodsList中的type修改为3，表示已付款
            orderGoodsList.type = 3;
            //3.将修改的值赋值到data中
            this.setData({
                orderGoodsList
            });
            //4.获取本地存储中的全部订单
            let orders = wx.getStorageSync("orders");
            //5.根据传过来的订单编号筛选对应的订单,并修改type的值
            orders = orders.filter(v => v.order_number === orderGoodsList.order_number ? v.type = 3 : v);
            //6.重新上传全部订单到本地存储
            wx.setStorageSync("orders", orders);
            //7.弹出提示框
            await showToast({
                title: "支付成功"
            })
        } else if (res.cancel) {
            //取消购买
            //弹出提示框
            await showToast({
                title: "支付取消"
            })
        }
    },
    onUnload: function() {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 1];
        prevPage.setData({
            type: this.data.type
        })
    }
})