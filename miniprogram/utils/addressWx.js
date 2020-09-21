//promise形式的wx.getSetting
export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

//promise形式的wx.chooseAddress
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

//promise形式的wx.openSetting
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

//promise形式的wx.showModel
export const showModel = ({
    content
}) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {}
        });
    })
}

//promise形式的wx.showToast
export const showToast = ({
    title
}) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title,
            icon: 'none',
            duration: 2000,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {}
        });
    })
}

//promise形式的wx.login
export const login = () => {
        return new Promise((resolve, reject) => {
            wx.login({
                timeout: 10000,
                success: (result) => {
                    resolve(result)
                },
                fail: (err) => {
                    reject(err)
                }
            });
        })
    }
    //promise形式的微信支付wx.requestPayment
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}