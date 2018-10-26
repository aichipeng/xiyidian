var app = getApp(), common = require("../common/common.js");

function sign(a) {
    var t = a.data.name, e = a.data.mobile, o = a.data.address, s = a.data.map, n = a.data.date, d = a.data.time, i = !0;
    "" != t && null != t || (i = !1), "" != e && null != e || (i = !1);
    /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/.test(e) || (i = !1), 
    "" != o && null != o || (i = !1), -1 == app.map_status && ("" != s && null != s || (i = !1)), 
    1 == app.config_times && ("" != n && null != n || (i = !1), "" != d && null != d || (i = !1)), 
    a.setData({
        submit: i
    });
}

function wxpay(a, t) {
    a.appId;
    var e = a.timeStamp.toString(), o = a.package, s = a.nonceStr, n = a.paySign.toUpperCase();
    wx.requestPayment({
        timeStamp: e,
        nonceStr: s,
        package: o,
        signType: "MD5",
        paySign: n,
        success: function(a) {
            wx.showToast({
                title: "支付成功",
                icon: "success",
                duration: 2e3
            }), setTimeout(function() {
                wx.reLaunch({
                    url: "../order/order"
                });
            }, 2e3);
        },
        fail: function(a) {}
    });
}

Page({
    data: {
        submit: !1,
        payment: 2,
        chooseCurr: -1
    },
    bindDateChange: function(a) {
        console.log("picker发送选择改变，携带值为", a.detail.value), this.setData({
            date: a.detail.value
        }), sign(this);
    },
    bindTimeChange: function(a) {
        console.log("picker发送选择改变，携带值为", a.detail.value), this.setData({
            time: a.detail.value
        }), sign(this);
    },
    input: function(a) {
        var t = this;
        switch (a.currentTarget.dataset.name) {
          case "name":
            t.setData({
                name: a.detail.value
            });
            break;

          case "mobile":
            t.setData({
                mobile: a.detail.value
            });
            break;

          case "address":
            t.setData({
                address: a.detail.value
            });
            break;

          case "content":
            t.setData({
                content: a.detail.value
            });
            break;

          case "password":
            t.setData({
                password: a.detail.value
            });
        }
        sign(t);
    },
    wx_address: function() {
        var t = this;
        wx.chooseAddress({
            success: function(a) {
                t.setData({
                    name: a.userName,
                    mobile: a.telNumber
                }), sign(t);
            }
        });
    },
    map: function(a) {
        var o = this;
        wx.chooseLocation({
            success: function(a) {
                o.setData({
                    address: a.address,
                    map: a
                });
                var t = {
                    op: "distance",
                    to: a.latitude + "," + a.longitude
                };
                app.util.request({
                    url: "entry/wxapp/index",
                    showLoading: !1,
                    data: t,
                    success: function(a) {
                        var t = a.data;
                        if ("" != t.data) {
                            var e = (parseFloat(o.data.goods_amount) - parseFloat(o.data.coupon_fee) + parseFloat(t.data.fee)).toFixed(2);
                            o.setData({
                                fee: t.data.fee,
                                amount: e,
                                distance: t.data.distance,
                                area: t.data.area
                            });
                        }
                    }
                }), sign(o);
            }
        });
    },
    payment: function(a) {
        var t = this, e = a.currentTarget.dataset.pay;
        e != t.data.payment && (t.setData({
            payment: e
        }), sign(t));
    },
    coupon_choose: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "getcoupon",
                amount: e.data.goods_amount
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    coupon_list: t.data
                }) : e.setData({
                    coupon_list: []
                }), e.setData({
                    menu: !0,
                    shadow: !0
                });
            }
        });
    },
    coupon_close: function() {
        this.setData({
            menu: !1,
            shadow: !1
        });
    },
    choose: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        if (-1 == e) var o = 0; else o = t.data.coupon_list[e].name;
        var s = (parseFloat(t.data.goods_amount) - parseFloat(o) + parseFloat(t.data.fee)).toFixed(2);
        t.setData({
            chooseCurr: e,
            coupon_fee: o,
            amount: s
        });
    },
    pay: function(a) {
        var e = this;
        if (e.data.submit) if (2 == e.data.payment && parseFloat(e.data.amount) > parseFloat(e.data.userinfo.money)) e.setData({
            toast: !0,
            toast_text: "余额不足"
        }), setTimeout(function() {
            e.setData({
                toast: !1
            });
        }, 2e3); else if (2 == e.data.payment) e.setData({
            sign: !0,
            shadow: !0,
            form_id: a.detail.formId
        }); else {
            var o = {
                name: e.data.name,
                mobile: e.data.mobile,
                address: e.data.address,
                map: e.data.map,
                goods: e.data.goods,
                fee: e.data.fee,
                distance: e.data.distance,
                total: e.data.total,
                form_id: a.detail.formId
            };
            "" != e.data.content && null != e.data.content && (o.content = e.data.content), 
            1 == e.data.payment ? o.pay_type = 3 : 2 == e.data.payment && (o.pay_type = 2), 
            -1 != e.data.chooseCurr && (o.coupon_id = e.data.coupon_list[e.data.chooseCurr].id), 
            "" != e.data.time && null != e.data.time && "" != e.data.date && null != e.data.date && (o.date = e.data.date + " " + e.data.time), 
            app.util.request({
                url: "entry/wxapp/setorder",
                data: o,
                success: function(a) {
                    var t = a.data;
                    "" != t.data && (2 == o.pay_type ? (wx.showToast({
                        title: "支付成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.reLaunch({
                            url: "../order/order"
                        });
                    })) : 3 == o.pay_type && wxpay(t.data, e));
                }
            });
        } else e.setData({
            toast: !0,
            toast_text: "请完善信息"
        }), setTimeout(function() {
            e.setData({
                toast: !1
            });
        }, 2e3);
    },
    sign_close: function() {
        this.setData({
            sign: !1,
            shadow: !1
        });
    },
    sign_btn: function() {
        var o = this, a = o.data.password;
        "" != a && null != a ? app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "login",
                password: a
            },
            success: function(a) {
                if ("" != a.data.data) {
                    o.setData({
                        sign_error: !1,
                        sign: !1,
                        shadow: !1
                    });
                    var e = {
                        name: o.data.name,
                        mobile: o.data.mobile,
                        address: o.data.address,
                        goods: o.data.goods,
                        fee: o.data.fee,
                        distance: o.data.distance,
                        total: o.data.total,
                        form_id: o.data.form_id
                    };
                    "" != o.data.content && null != o.data.content && (e.content = o.data.content), 
                    1 == o.data.payment ? e.pay_type = 3 : 2 == o.data.payment && (e.pay_type = 2), 
                    -1 != o.data.chooseCurr && (e.coupon_id = o.data.coupon_list[o.data.chooseCurr].id), 
                    "" != o.data.map && null != o.data.map && (e.map = JSON.stringify(o.data.map)), 
                    "" != o.data.time && null != o.data.time && "" != o.data.date && null != o.data.date && (e.date = o.data.date + " " + o.data.time), 
                    app.util.request({
                        url: "entry/wxapp/setorder",
                        data: e,
                        success: function(a) {
                            var t = a.data;
                            "" != t.data && (2 == e.pay_type ? (wx.showToast({
                                title: "支付成功",
                                icon: "success",
                                duration: 2e3
                            }), setTimeout(function() {
                                wx.reLaunch({
                                    url: "../order/order"
                                });
                            })) : 3 == e.pay_type && wxpay(t.data, o));
                        }
                    });
                } else o.setData({
                    sign_error: !0
                });
            }
        }) : o.setData({
            sign_error: !0
        });
    },
    onLoad: function(e) {
        var o = this;
        common.config(o), common.theme(o), console.log(e.goods), o.setData({
            goods: e.goods
        }), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "pay",
                amount: e.amount
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && (o.setData({
                    goods_amount: parseFloat(t.data.goods_amount).toFixed(2),
                    total: e.total,
                    coupon_fee: t.data.coupon_fee,
                    fee: parseFloat(t.data.fee).toFixed(2),
                    amount: parseFloat(t.data.amount).toFixed(2),
                    area: t.data.area
                }), "" != t.data.list && null != t.data.list && o.setData({
                    name: t.data.list.name,
                    mobile: t.data.list.mobile,
                    address: t.data.list.address,
                    map: t.data.list.map,
                    distance: t.data.distance
                }), "" != t.data.userinfo && null != t.data.userinfo && (o.setData({
                    userinfo: t.data.userinfo
                }), app.userinfo = t.data.userinfo), sign(o));
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});