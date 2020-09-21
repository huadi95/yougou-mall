// pages/cart/index.js
import {

    showModel,
    showToast
} from "../../utils/addressWx.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cart: [],
        allChecked: false,
        totalPrice: 0,
        totalNum: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        //1.获取缓存中的购物车数据
        let cart = wx.getStorageSync("cart") || [];
        //2.调用封装好的函数setCart
        this.setCart(cart);
    },
    //改变购物车数据和本地存储的购物车数据
    setCart(cart) {
        //全选按钮的状态
        let allChecked = true;
        //购物车商品的总价格
        let totalPrice = 0;
        //购物车商品的总数量
        let totalNum = 0;
        cart.forEach(v => {
                if (v.checked) {
                    totalPrice += v.num * v.goods_price;
                    totalNum += v.num
                } else {
                    allChecked = false
                }
            })
            //evert数组函数，当数组值所有的值都符合条件是返回true，否则返回false
        allChecked = cart.length !== 0 ? allChecked : false;
        this.setData({
                cart,
                totalPrice,
                totalNum,
                allChecked
            })
            //改变本地存储的购物车数据
        wx.setStorageSync("cart", cart);
    },
    //购物车车商品选中事件
    handleItemChange(e) {
        //1.获取商品的id
        let id = e.currentTarget.dataset.id;
        //2.获取所有购物车数据
        let {
            cart
        } = this.data;
        //3.获取商品的索引
        let index = cart.findIndex(v => v.goods_id === id);
        //4.将对应的购物车商品的checked属性取反
        cart[index].checked = !cart[index].checked;
        //4.调用封装好的函数setCart
        this.setCart(cart);
    },
    //底部工具栏全选事件
    handleItemAllChange() {
        //1.获取data中的数据
        let {
            cart,
            allChecked
        } = this.data;
        //2.将allChecked取反
        allChecked = !allChecked;
        //3.将cart中的checked属性全部等于allChecked
        cart.forEach(v => v.checked = allChecked)
            //4.调用封装好的函数setCart
        this.setCart(cart)
    },
    //商品数量的加减
    async handleEdit(e) {
        //1.获取商品的id和operation
        let {
            id,
            operation
        } = e.currentTarget.dataset;
        //2.获取data中的cart数据
        let {
            cart
        } = this.data;
        //3.获取点击事件的索引
        let index = cart.findIndex(v => v.goods_id === id)
            //4.对商品的数量进行加减
        if (cart[index].num == 1 && operation === -1) {
            //5.当商品数量等于1时，而且是进行减少操作时，弹出模态框，判断是否要删除商品
            //showModel是封装成promise的wx.showModel的api
            const res = await showModel({
                content: '你确定要删除该商品吗？'
            });
            //在模态框中点击确认，删除购物车中的该商品数据
            if (res.confirm) {
                //确认删除
                cart.splice(index, 1);
                this.setCart(cart);
                //弹出提示删除成功
                await showToast({
                    title: "删除成功"
                })
            } else {
                //取消删除
                //弹出提示取消删除
                await showToast({
                    title: "取消删除"
                })
            }

        } else {
            //6.商品数量大于1或是商品是进行增加操作时，正常进行
            cart[index].num += operation;
            this.setCart(cart);
        }
    },
    //删除选中的商品
    async handelDelChecked() {
        //1获取购物车商品数组
        let cart = this.data.cart;
        //2.判断购物车数组是否有选中的商品
        if (cart.some(v => v.checked == true)) {
            //有选中的商品
            //1.弹出模态框
            const res = await showModel({
                    content: '你确定要删除选中的商品吗？'
                })
                //2.判断是否确定要删除选中的商品
            if (res.confirm) {
                //确认删除选中商品
                //2.1筛选未选中的商品数组
                cart = cart.filter(v => v.checked ? '' : v);
                //2.2筛选好的数组重新进行赋值到data中
                this.setData({
                        cart,
                        totalNum: 0
                    })
                    //2.3筛选好的数组重新上传到本地存储中
                wx.setStorageSync("cart", cart);
                //2.4弹出提示删除成功
                await showToast({
                    title: "删除成功"
                })
            } else {
                //取消删除
                //弹出提示取消删除
                await showToast({
                    title: "取消删除"
                })
            }
        } else {
            //弹出提示没有选中的商品
            await showToast({
                title: "没有选中的商品，删除失败"
            })
        }
    },
    //商品结算
    async handlePay() {
        const {
            totalNum
        } = this.data;
        //1.判断是否有选好要购买的商品数据
        if (totalNum === 0) {
            await showToast({
                title: "请添加要购买的商品"
            })
            return;
        }
        //3.收货地址和购买的商品没问题，跳转到支付页面
        wx.navigateTo({
            url: '/pages/pay/index'
        });
    }
})