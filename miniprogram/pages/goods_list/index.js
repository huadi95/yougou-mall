import {
    request
} from "../../request/index";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
            id: 0,
            name: "综合",
            isActive: true
        }, {
            id: 1,
            name: "销量",
            isActive: false
        }, {
            id: 2,
            name: "价格",
            isActive: false
        }],
        //已清空无图片的全部数据的数组
        goods: [],
        //排序后价格页的全部数据
        priceGoods: [],
        //综合页的数据
        goodsList: [],
        index: 0
    },
    //接口要的参数
    queryParams: {
        query: '',
        cid: '',
        pagenum: 1,
        pagesize: 100

    },
    //总页数
    totalPages: 1,
    //价格页的endPages到startPages页的数据
    startPages: 0,
    endPages: 1,
    //监听子组件传过来的自定义事件，改变标题选中状态
    handleTabsItemChange(e) {
        //获取标题当前的索引
        let index = e.detail.index;
        let tabs = this.data.tabs;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        this.setData({
            tabs,
            index,
            goodsList: []
        })
        this.startPages = 0;
        this.endPages = 1;
        this.getGoodsList()
    },
    //请求商品列表数据
    async getGoodsList() {
        //1.弹出加载框
        wx.showLoading({
            title: "加载中",
            mask: true
        });
        //2.获取data中的goods综合页的全部数据，sortGoodsList价格页的全部数据
        const { goods, priceGoods } = this.data;
        //3.获取总数量
        let total = goods.length;
        //4.因为每页有10条数据所有，获取总页数等于总数量除以10
        this.totalPages = Math.ceil(total / 10);
        //5.判断当前页面是否在商品列表价格页
        if (this.data.index == 2) {
            //当前页面在商品列表价格页，传priceGoods数组过去
            this.getGoodsListItem(priceGoods);
        } else {
            //当前页面不在商品列表价格页，传goods数组过去
            this.getGoodsListItem(goods);
        };
        //6.对startPages,endPages进行+1
        this.startPages++;
        this.endPages++;
        //关闭加载框
        wx.hideLoading();
        //数据获取成功，关闭下拉窗口
        wx.stopPullDownRefresh()
    },
    //获取相应的数据进行渲染
    getGoodsListItem(item) {
        //1.获取没次运行获取的10条数据
        let arr = []
            //2.将10个相应位置的数据push进arr数组
        for (let i = this.startPages * 10; i < 10 * this.endPages; i++) {
            arr.push(item[i])
        }
        //3.判断是否有空数组，有就去除，生产新的数组放在goodsListPrice
        let goodsList = arr.filter(v => v);
        //4.将获取的10条数据和之前就有的数据进行拼接
        this.setData({
            //对原来的数据进行解构进行叠加
            goodsList: [...this.data.goodsList, ...goodsList]
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
        //1.获取分类商品页传过来的cid
        this.queryParams.cid = options.cid || '';
        //2.获取首页传过来的query
        this.queryParams.query = options.query || '';
        //4.发送请求，获取所有数据
        const res = await request({
            url: '/goods/search',
            data: this.queryParams
        });
        //5.获取返回的全部数据的数组
        let isGoods = res.goods || [];
        //6.执行函数获取综合页的数据
        this.getGoodsAll(isGoods);
        //7.执行函数获取价格页的数据
        this.getSortPriceGoods(isGoods);
        //8.执行函数获取商品列表页数据
        this.getGoodsList();
    },
    //此函数用来获取综合页的数据
    getGoodsAll(isGoods) {
        //1获取清空数据中无图片的数组
        const goods = [];
        //2.清空请求回来数据中的无图片数据
        isGoods.filter(v => v.goods_small_logo ? goods.push(v) : '');
        //3.将goods数组放到data中
        this.setData({
            goods
        });
    },
    //此函数用来排序价格页的全部数据
    getSortPriceGoods(isGoods) {
        //1.获取价格页的全部数据的数组
        const priceGoods = [];
        //2.清空请求回来数据中的无图片数据
        isGoods.filter(v => v.goods_small_logo ? priceGoods.push(v) : '');
        //3.将获取的数组用价格进行一个从低到高的排序
        for (let i = priceGoods.length - 1; i > 0; i--) {
            for (let j = 0; j < i; j++) {
                if (priceGoods[j].goods_price > priceGoods[j + 1].goods_price) {
                    [priceGoods[j], priceGoods[j + 1]] = [priceGoods[j + 1], priceGoods[j]]
                }
            }
        }
        //4.将数据返回data中
        this.setData({
            priceGoods
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        //1.下拉清空价格页数据
        this.setData({
            goodsList: []
        });
        //2.将价格页的页数重新回到第一页
        this.startPages = 0;
        this.endPages = 1;
        //3.重新获取数据
        this.getGoodsList()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        //index=2是在商品列表价格页运行
        if (this.endPages > this.totalPages) {
            //没有数据了，弹出提示
            wx.showToast({
                title: '没有数据了',
            });
        } else {

            //继续执行getGoodsList()函数
            this.getGoodsList();
        }

    }
})