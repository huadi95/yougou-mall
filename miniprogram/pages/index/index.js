//index.js
const app = getApp()
    //引入promise优化的request函数请求数据
import {
    request
} from "../../request/index";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //轮播图数据
        swiperList: [],
        cateList: [],
        floorList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getSwiperList();
        this.getCateList();
        this.getFloorList();
    },

    //1.发送异步请求获取轮播图数据
    async getSwiperList() {
        const res = await request({
            url: '/home/swiperdata'
        });
        this.setData({
            swiperList: res
        })
    },
    //2.发送异步请求获取导航数据
    async getCateList() {
        const res = await request({
            url: '/home/catitems'
        });
        this.setData({
            cateList: res
        })
    },

    //3.发送异步请求获取楼层数据
    async getFloorList() {
        let arr_url = []
        const res = await request({
            url: '/home/floordata'
        });
        //因为后台数据中的navigator_url地址不正确，所以进行一个修改
        res.forEach((v) => {
            v.product_list.forEach(v => {
                //获取navigator_url地址中？符的位置
                let index = v.navigator_url.lastIndexOf("\?")
                    //指定的地址  拼接  通过navigator_url地址中？的位置获取后面的参数
                v.navigator_url = "/pages/goods_list/index?" + v.navigator_url.substring(index + 1, v.navigator_url.length)
            })
        });
        this.setData({
            floorList: res
        })
    },
    //轮播图跳转
    handleNavigator(e) {
        //1.获取轮播图的索引
        const {
            index
        } = e.currentTarget.dataset;
        //2.判断第几张轮播图对应跳转的页面
        if (index === 0) {
            //第一张轮播图跳转的页面
            wx.navigateTo({
                url: '/pages/goods_details/index?goods_id=55248'
            });
        } else if (index === 1) {
            //第二张轮播图跳转的页面
            wx.navigateTo({
                url: '/pages/goods_details/index?goods_id=17928'
            });
        } else {
            //第三张轮播图跳转的页面
            wx.navigateTo({
                url: '/pages/goods_details/index?goods_id=45833'
            })
        }
    }
})