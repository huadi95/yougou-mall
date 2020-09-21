//对地址的引入进行promise优化
let num = 0;
export const request = (params) => {
    
    //判断url是否带上私有的请求路径/my/ 有就在请求头头加上token值 
    //因为token值是默认的，所有是请求不到数据的，返回的是null
    /* let header = {}
    if (params.url.includes("/my/")) {
        header["Authorization"] = wx.getStorageSync("token");
    } */
    //上面这段代码是在有企业版微信小程序账号开发的前提下才能运行成功

    //执行了n次异步请求就++n次
    num++;
    //页面加载，显示加载效果
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url: "https://api-hmugo-web.itheima.net/api/public/v1" + params.url,
            success: (result) => {
                resolve(result.data.message)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                num--;
                //num为零时才执行关闭加载效果
                if (num === 0) {
                    //关闭加载效果
                    wx.hideLoading();
                }
            }
        });
    })
}