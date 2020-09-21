// pages/order/index.js
import {
    request
} from "../../request/index";
import {
    showToast,
    showModel
} from '../../utils/addressWx';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 0,
                name: "全部订单",
                isActive: true
            },
            {
                id: 1,
                name: "待付款",
                isActive: false
            },
            {
                id: 2,
                name: "待发货",
                isActive: false
            },
            {
                id: 3,
                name: "退款/退货",
                isActive: false
            }
        ],
        orderData: [],
        //获取当前所在页面的索引
        isType: 1
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        //1.获取订单详情页上传的type值
        let isType = wx.getStorageSync("isType") || null;
        //2.获取当前的小程序页面栈-数组
        const pages = getCurrentPages();
        //3.数组中索引最大的就是当前页面
        const current = pages[pages.length - 1];
        //4.判断是否有订单详情页传过来的isType值上传，有则type等于isType,无则type等于current.options.type
        const type = isType || current.options.type;
        //5.激活选中页面标题当
        this.changeTitleByIndex(type - 1);
        this.getOrder(type);
        //6.判断isType是否有真值，有则将本地存储中isType值进行null
        if (isType) {
            let hideType = null;
            wx.setStorageSync("isType", hideType);
        }
    },
    //获取商品订单的方法
    /* async getOrders(type) {
          let res = await request({
              url: "/my/orders/all",
              data: type
          })
          this.setData({
              orderData:res.orders
          })
      }, */
    //重要，上面获取商品订单的方法仅适用于企业版的微信小程序账号
    //下面的是普通小程序账号获取商品订单的方法
    getOrder(type) {
        //获取全部的订单
        let orders = wx.getStorageSync("orders") || [];
        if (type == 2) {
            //当type = 2时，渲染待付款的订单
            const order = orders.filter(v => v.type == 2);
            this.setData({
                orderData: order
            });
        } else if (type == 3 || type == 4) {
            //当type = 3时，渲染已经付款的订单
            const order = orders.filter(v => v.type == 3);
            this.setData({
                orderData: order
            });
        } else {
            //当type = 1时，渲染全部订单
            this.setData({
                orderData: orders
            });
        }
    },
    //根据标题来索引激活选中标题数组
    changeTitleByIndex(index) {
        //修改源数组
        let tabs = this.data.tabs;
        tabs.forEach((v, i) =>
            i === index ? (v.isActive = true) : (v.isActive = false)
        );
        //赋值到data中
        this.setData({
            tabs,
            isType: index + 1
        });
    },
    //监听子组件传过来的自定义事件，改变标题选中状态
    handleTabsItemChange(e) {
        //获取标题当前的索引
        let index = e.detail.index;
        this.changeTitleByIndex(index);
        this.getOrder(index + 1);
    },
    //点击付款按钮事件
    async handleButtonChange(e) {
        //1.获取当前要付款的订单编号
        const order_number = e.currentTarget.dataset.number;
        //2.获取全部的订单
        let orders = wx.getStorageSync("orders") || [];
        //3.弹出模态框确认是否要购买商品
        const res = await showModel({
                content: "您确定要购买商品吗？"
            })
            //4.判断是否确定要支付商品
        if (res.confirm) {
            //确定支付，修改相应订单中的type，让其等于3，改变成待收货里的数据
            orders = orders.filter(v => v.order_number === order_number ? v.order_time = this.timeData(new Date().getTime()) : v)
            orders = orders.filter(v => v.order_number === order_number ? v.type = 3 : v)
                //弹出提示框
            await showToast({
                title: "支付成功"
            })
        } else if (res.cancel) {
            //弹出提示框
            await showToast({
                title: "支付取消"
            })
        }
        //5.准备获取订单数据的数组
        let orderData = []
            //6.判断当前是在哪个页面，isType=2 说明当前是在待付款页面付款的
        if (this.data.isType === 2) {
            //获取有待付款的数组
            orderData = orders.filter(v => v.type === 2) || []
        } else {
            //执行这一步说明是在全部订单的页面，直接赋值等于orders数组就可以了
            orderData = orders
        };
        //7.将修改的数据提交到本地存储中
        wx.setStorageSync("orders", orders);
        //8.将获取好的orderData数组赋值到data中
        this.setData({
            orderData,
        })
    },
    //时间戳转换成年月日时分秒的格式
    timeData(timestamp) {
        //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
        let time = new Date(timestamp);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let date = time.getDate();
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        return year + '/' + month + '/' + date + ' ' + hours + ':' + minutes + ':' + seconds;
    }
});