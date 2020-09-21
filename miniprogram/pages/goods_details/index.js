import {
    request
} from "../../request/index";
import {
    getSetting,
    openSetting,
    chooseAddress,
    showModel,
    showToast
} from "../../utils/addressWx.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsData: {},
        isCollect: false
    },
    //商品对象
    goodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let {
            goods_id
        } = options;
        this.getGoodsData(goods_id)
    },
    //获取商品详情数据
    async getGoodsData(goods_id) {
        const res = await request({
            url: "/goods/detail",
            data: {
                goods_id
            }
        });
        //将数据传入商品对象
        this.goodsInfo = res;
        //1.获取商品收藏的数组
        let collect = wx.getStorageSync("collect") || [];
        //2.判断当前商品是否有收藏
        let isCollect = collect.some(v => v.goods_id == this.goodsInfo.goods_id)
        this.setData({
            goodsData: {
                goods_name: res.goods_name,
                goods_price: res.goods_price,
                goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: res.pics
            },
            isCollect
        })

    },
    //点击图片放大事件
    handlePreviewImage(e) {
        //1.获取轮播图每张图片的url
        let urls = this.data.goodsData.pics.map(v => v.pics_mid);
        //2.获取当前点击图片的url
        let current = e.currentTarget.dataset.url;
        //3.在新页面中全屏预览图片
        wx.previewImage({
            current,
            urls
        });
    },
    //判断是否要进行登录
    async isLogin() {
        //1未登录，弹出提示框是否要登录
        const res = await showModel({
            content: "您还未登录，是否要进行登录？"
        });
        if (res.confirm) {
            //1.2确认要登录，跳转到个人页面进行登录
            wx.navigateTo({
                url: '/pages/login/index'
            });
        } else {
            await showToast({
                title: "取消登录"
            })
        }
    },
    //点击添加商品进入购物车
    handleCartAdd() {
        //1.判断是否已登录
        let userInfo = wx.getStorageSync("userInfo") || null;
        if (!userInfo) {
            //1.1未登录，判断是否要进行登录
            this.isLogin();
            //1.2终止下面的操作
            return;
        }
        //2.获取缓存的购物车数组
        let cart = wx.getStorageSync("cart") || [];
        //3.判断商品是否存在购物车当中
        let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id);
        if (index === -1) {
            //3.1不存在 第一次添加商品进入购物车
            this.goodsInfo.num = 1;
            this.goodsInfo.checked = false;
            cart.push(this.goodsInfo);
        } else {
            //3.2商品存在购物车中，num就+1
            cart[index].num++;
        }
        //4.将添加到购物车的数据传入本地存储当中
        wx.setStorageSync("cart", cart);
        //5.弹窗提示
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            mask: true
        });
    },
    //点击收藏或取消收藏
    handleCollect() {
        //1.默认值，控制收藏按钮是否显示收藏
        let isCollect = false;
        //2.获取本地缓存中的收藏数组
        let collect = wx.getStorageSync("collect") || [];
        //3.选出当前数据在收藏数据中的位置
        let index = collect.findIndex(v => v.goods_id == this.goodsInfo.goods_id);
        //4.当index为-1时，表明当前数据还未收藏
        if (index !== -1) {
            //当前商品已收藏 取消收藏 并且删除收藏对应的数据
            collect.splice(index, 1);
            isCollect = false;
            //弹出提示框
            wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true
            });
        } else {
            //当前商品未收藏 收藏商品 并且添加收藏对应的数据
            collect.push(this.goodsInfo);
            isCollect = true;
            //弹出提示框
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                mask: true
            });
        }
        //5.把数组存入缓存中
        wx.setStorageSync("collect", collect);
        this.setData({
            isCollect
        })
    },
    //点击立即购买事件
    handleBuy() {
        //1.判断是否已登录
        let userInfo = wx.getStorageSync("userInfo") || null;
        if (!userInfo) {
            //1.1未登录，判断是否要进行登录
            this.isLogin();
            //1.2终止下面的操作
            return;
        }
        //2.将当前商品详情页的数据传到本地存储
        wx.setStorageSync("goodsData", this.data.goodsData);
        //3.跳转到支付页面
        wx.navigateTo({
            url: "/pages/pay/index"
        });
    }
})