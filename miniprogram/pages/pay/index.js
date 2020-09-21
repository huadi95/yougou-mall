import {
    request
} from "../../request/index";
import {
    requestPayment,
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
        address: {},
        cart: [],
        totalPrice: 0,
        totalNum: 0,
        orders: [],
        active: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    //点击获取收货地址
    async handleChooseAddress() {
        /* //1.获取权限状态
        wx.getSetting({
            success: (result) => {
                //2.获取权限状态 主要发现一些属性名很怪异的时候，都要使用[]来获取值
                let scopeAddress = result.authSetting["scope.address"];
                if (scopeAddress === true || scopeAddress === undefined) {
                    //3.没有获取过地址，或确认获取地址时执行
                    wx.chooseAddress({
                        success: (res1) => {
                            console.log(res1)
                        }
                    });
                } else {
                    //4.用户以前拒绝过授予权限，想再次获取地址时，先诱导用户打开权限页面
                    wx.openSetting({
                        success: (res2) => {
                            //5.权限打开，可以调用获取收货地址的代码
                            wx.chooseAddress({
                                success: (res3) => {
                                    console.log(res3)
                                }
                            });
                        }
                    });
                }
            }
        }); */
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
            wx.setStorageSync("address", address);
        } catch (error) {
            console.log(error)
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        //1.获取缓存中的收货地址信息
        let address = wx.getStorageSync("address") || {};
        //2.获取缓存中的购物车数据
        let cart = wx.getStorageSync("cart") || [];
        //3.获取缓存中的goodsData直接购买的数据
        let goodsData = wx.getStorageSync("goodsData") || {};
        if (!goodsData.goods_name) {
            //购物车页点击直接结算执行
            //1.筛选数据
            cart = cart.filter(v => v.checked);
            //2.购物车商品的总价格
            let totalPrice = 0;
            //3.购物车商品的总数量
            let totalNum = 0;
            cart.forEach(v => {
                totalPrice += v.num * v.goods_price;
                totalNum += v.num;
            });
            //4.将需要的值传到data中
            this.setData({
                address,
                cart,
                totalPrice,
                totalNum,
                active: false
            });
        } else {
            //商品详情页点击立即购买执行
            //1.购物车商品的总价格
            let totalPrice = goodsData.goods_price;
            //2.购物车商品的总数量
            let totalNum = 1;
            //3.将需要的值传到data中
            this.setData({
                address,
                cart: [goodsData],
                totalPrice,
                totalNum,
                active: true
            });
        }
    },
    //支付订单
    async handleOrderPay() {
        try {
            //1.获取token值
            //const token = wx.getStorageSync("token");
            //2.判断是否有token值
            /* if (!token) {
                wx.navigateTo({
                    url: "/pages/auth/index"
                });
                return;
            } */
            //3.创建订单
            //3.1 准备请求头参数
            /* const herder = {
            Authorization: token
        } */
            //3.2 准备请求参数
            /* const order_price = this.data.totalPrice;
            const consignee_addr = this.data.cart.all;
            const cart = this.data.cart;
            const goods = [];
            cart.forEach(v => goods.push({
                goods_id: v.goods_id,
                goods_number: v.num,
                goods_price: v.goods_price
            }))
            const orderParams = {
                    order_price,
                    consignee_addr,
                    goods
                } */
            //4.准备发送请求 获取订单号  因为请求头的token是默认的，返回的是null
            /* const res = await request({
                    url: "/my/orders/create",
                    method: "POST",
                    data: orderParams
                }) */
            //5.发起预支付接口  因为请求头的token是默认的，返回的也是null,所有没有pay的值，会报错
            /* const {
                pay
            } = await request({
                    url: "/my/orders/req_unifiedorder",
                    methods: "POST",
                    data: {
                        order_number
                    }
                }) */
            //6.发起微信支付
            //await requestPayment(pay)
            //7.查询后台支付订单   因为请求头的token是默认的，返回的也是null
            /* const result = await request({
                    url: "/my/orders/chkOrder",
                    methods: "POST",
                    data: {
                        order_number
                    }
                }) */
            //8.手动删除选中已经支付的商品
            /* let newCart = wx.getStorageSync("cart");
            newCart = newCart.filter(v => !v.checked)
            wx.setStorageSync("cart", newCart); */

            //重要，上面1-8步骤都是在企业版微信小程序的账号上才能才能成功执行的，获取token
            //因此，下面的代码是在普通微信小程序账号开发的步骤
            //模拟上面有token值的授权效果
            const token = wx.getStorageSync("token");
            //获取data中的收货地址后购物车数据
            const {
                address,
                cart
            } = this.data;
            //1.判断是否有token值
            if (!token) {
                wx.navigateTo({
                    url: "/pages/auth/index"
                });
                return;
            }
            //2.判断是否有收货地址
            if (!address.userName) {
                await showToast({
                    title: "请添加收货地址"
                })
                return;
            }
            //3.判断购买商品是否为空
            if (cart.length === 0) {
                //弹出提示框
                await showToast({
                    title: "购买的商品为空"
                })
                return;
            }
            //4.弹出模态框确认是否要购买商品
            const res = await showModel({
                    content: "您确定要购买商品吗？"
                })
                //5.判断，确定支付商品订单变为待收货的订单，取消支付则变为待付款订单
            if (res.confirm) {
                //确认付款，订单变为待收货订单
                let type = 3;
                this.submitOrder(type)
                    //弹出提示框
                await showToast({
                        title: "支付成功"
                    })
                    //支付成功跳转到订单页面
                wx.navigateTo({
                    url: '/pages/order/index?type=1'
                });
            } else if (res.cancel) {
                //取消付款，订单变为待付款订单
                let type = 2;
                this.submitOrder(type)
                    //弹出提示框
                await showToast({
                        title: "支付取消"
                    })
                    //支付取消跳转到订单页面的待付款
                wx.navigateTo({
                    url: '/pages/order/index?type=2'
                });
            }
        } catch (err) {
            //支付失败弹出提示框
            await showToast({
                title: "支付失败"
            })
        }

    },
    //提交待付款或已经付款的订单
    submitOrder(num) {
        //1.获取订单需要的数据
        //1.1获取订单编号   这里用时间戳当成订单编号
        const order_number = new Date().getTime();
        //1.2获取订单下单时间
        const order_time = this.timeData(order_number);
        //1.3.获取订单的价格
        const order_price = this.data.totalPrice;
        //1.4定单支付成功其添加type属性为3,将其分为待收货
        const type = num;
        //2.判断是那个页面
        if (this.data.active) {
            //是商品详情页直接进来支付页的执行此操作
            //1.将本地存储中的商品详情数据清空
            let goodsData = {};
            wx.setStorageSync("goodsData", goodsData);
            //2.将data中的active改为false
            this.setData({
                active: false
            })
        } else {
            //是购物车页面进来支付页的执行此操作
            //1.获取本地存储中的购物车数据的数组
            let newCart = wx.getStorageSync("cart");
            //2.遍历购物车数据中没有被选中的数据
            newCart = newCart.filter(v => !v.checked)
                //3.将遍历的数据进行重新上传到本地存储
            wx.setStorageSync("cart", newCart);
        };
        //3.获取所有的订单,并将新的订单push进行
        let orders = wx.getStorageSync("orders") || [];
        orders.push({
            order_number,
            order_time,
            order_price,
            order_arr: this.data.cart,
            address: this.data.address,
            type
        });
        //2.将orders数组重新上传到本地存储上
        wx.setStorageSync("orders", orders);
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
    },
    /**
     * 生命周期函数--监听页面销毁
     */
    onUnload: function() {
        if (this.data.active) {
            //1.将本地存储中的商品详情数据清空
            let goodsData = {};
            wx.setStorageSync("goodsData", goodsData);
        }
    }
});