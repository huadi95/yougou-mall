// pages/feedback/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
            id: 0,
            name: "体验问题",
            isActive: true
        }, {
            id: 1,
            name: "商品、商家投诉",
            isActive: false
        }],
        //上传图片的数组
        chooseImg: [],
        //文本框的内容
        isValue: ""
    },
    UploadImg: [],
    //监听子组件传过来的自定义事件，改变标题选中状态
    handleTabsItemChange(e) {
        //获取标题当前的索引
        let index = e.detail.index;
        let tabs = this.data.tabs;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        this.setData({
            tabs
        })
    },
    //点击+添加上传的图片
    handleChooseImg() {
        //微信小程序内置的上传图片api
        wx.chooseImage({
            //图片最多可以选择的数量
            count: 9,
            //上传的原图 压缩图片
            sizeType: ['original', 'compressed'],
            //从相册选图  使用相机拍照
            sourceType: ['album', 'camera'],
            success: (result) => {
                this.setData({
                    chooseImg: [...this.data.chooseImg, ...result.tempFilePaths]
                })
            }
        })
    },
    //点击删除图片删除图片事件
    handleDleImg(e) {
        //1.获取被点击组件的索引
        const {
            index
        } = e.currentTarget.dataset;
        //2.获取data中的chooseImg
        let {
            chooseImg
        } = this.data;
        //3.将chooseImg中位置在index的的数据删除
        chooseImg.splice(index, 1);
        //4.重新返回新的chooseImg数组进data
        this.setData({
            chooseImg
        })
    },
    //获取文本框的内容
    handleTextInput(e) {
        this.setData({
            isValue: e.detail.value
        })
    },
    //点击提交按钮提交数据
    handleFormSubmit() {
        //1.获取文本内容  上传图片数组
        let {
            chooseImg,
            isValue
        } = this.data;
        //2.合法性的验证
        if (!isValue.trim()) {
            //不合法
            wx.showToast({
                title: '输入不合法',
                icon: "none",
                mask: true
            });
            return;
        }
        //弹出加载框
        wx.showLoading({
            title: "意见在上传中",
            mask: true
        });
        //判断是否有图片上传
        if (chooseImg.length != 0) {
            //3.准备上传图片到专门图片服务器
            chooseImg.forEach((v, i) => {
                wx.uploadFile({
                    //图片上传到哪里   改路径有问题不可以，仅做模拟
                    url: 'https://images.ac.cn/Home/Index/UploadAction/',
                    //被上传的文件的路径
                    filePath: v,
                    //上传的文件的名称  后台来获取文件  file
                    name: "file",
                    //顺带的文本信息
                    formData: {},
                    success: (result) => {
                        //仅适用于上传的路径正常的情况
                        /* let url = JSON.parse(result.data).url;
                        this.uploadImg.push(url) */
                        //因为路径有问题，仅做打印演示
                        console.log("图片上传成功" + i)
                        if (i === chooseImg.length - 1) {
                            //关闭提示框
                            wx.hideLoading();
                            console.log("把文本的内容和外网的图片数组提交给后台")
                                //提交成功 页面重置
                            this.setData({
                                    chooseImg: [],
                                    isValue: ''
                                })
                                //返回上一页
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    }
                });
            })
        } else {
            //关闭加载框
            wx.hideLoading();
            //提交成功 页面重置
            console.log("只上传了文本内容")
            this.setData({
                    isValue: ''
                })
                //返回上一页
            wx.navigateBack({
                delta: 1
            });
        }
    }
})