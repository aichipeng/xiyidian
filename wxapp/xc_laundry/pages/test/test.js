var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        pagePath: "../test/test"
    },
    input: function(t) {
        switch (t.currentTarget.dataset.name) {
          case "search":
            this.setData({
                search: t.detail.value
            });
            break;

          case "test_amount":
            this.setData({
                test_amount: t.detail.value
            });
        }
    },
    search: function() {
        var e = this, t = e.data.search;
        "" == t || null == t ? wx.showModal({
            title: "错误",
            content: "请输入订单号",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        }) : app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "test_order",
                search: t
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && e.setData({
                    list: a.data
                });
            }
        });
    },
    call: function(t) {
        wx.makePhoneCall({
            phoneNumber: this.data.list.userinfo.mobile
        });
    },
    test_btn: function(t) {
        var a = this, e = t.currentTarget.dataset.index, n = a.data.list;
        1 == e ? -1 == n.service_status && a.setData({
            shadow: !0,
            btn2: !0,
            test: !1
        }) : 2 == e ? 1 == n.pay_type && (-1 == n.service_status ? wx.showModal({
            title: "错误",
            content: "请先检验确认",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        }) : null == n.amount || "" == n.amount ? a.setData({
            shadow: !0,
            btn3: !0,
            test: !1
        }) : wx.showModal({
            title: "错误",
            content: "已扣款",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        })) : 3 == e && 1 == n.service_status && (null == n.amount || "" == n.amount ? wx.showModal({
            title: "错误",
            content: "请先扣款",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        }) : a.setData({
            shadow: !0,
            btn4: !0,
            test: !1
        }));
    },
    test_change: function(t) {
        var a = this, e = t.currentTarget.dataset.status, n = a.data.list, s = t.currentTarget.dataset.name;
        a.setData({
            btn2: !1,
            btn3: !1,
            btn4: !1,
            shadow: !1
        }), app.util.request({
            url: "entry/wxapp/orderchange",
            data: {
                name: s,
                index: e,
                id: n.id
            },
            success: function(t) {
                "" != t.data.data && (wx.showToast({
                    title: "成功",
                    icon: "success",
                    duration: 2e3
                }), "service_status" == s && (2 == e ? n = "" : 1 == e ? (n.service_status = e, 
                n.orders = 3, n.order_status = "服务中") : 3 == e && (n = "")), a.setData({
                    list: n
                }));
            }
        });
    },
    chargeback: function() {
        var a = this, e = a.data.list, n = a.data.test_amount;
        "" != n && null != n ? app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "chargeback",
                id: e.id,
                amount: n
            },
            success: function(t) {
                "" != t.data.data && (wx.showToast({
                    title: "成功",
                    icon: "success",
                    duration: 2e3
                }), a.setData({
                    btn3: !1,
                    shadow: !1
                }), e.amount = n, a.setData({
                    list: e
                }));
            }
        }) : wx.showModal({
            title: "错误",
            content: "请输入金额",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        });
    },
    scan: function() {
        var e = this;
        wx.scanCode({
            onlyFromCamera: !0,
            success: function(t) {
                console.log(t), app.util.request({
                    url: "entry/wxapp/manage",
                    data: {
                        op: "test_order",
                        id: t.result
                    },
                    success: function(t) {
                        var a = t.data;
                        "" != a.data && e.setData({
                            list: a.data
                        });
                    }
                });
            }
        });
    },
    menu_close: function() {
        this.setData({
            shadow: !1,
            btn1: !1,
            btn2: !1,
            btn3: !1,
            btn4: !1
        });
    },
    onLoad: function(t) {
        common.config(this), common.theme(this), common.test(this);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});