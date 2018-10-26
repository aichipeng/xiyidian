var app = getApp(), common = require("../common/common.js"), QR = require("../../../utils/qrcode.js");

Page({
    data: {
        pagePath: "../run/order_on",
        curr: -1,
        page: 1,
        pagesize: 20,
        isbottom: !1,
        maskHidden: !0,
        imagePath: ""
    },
    tab: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        t != e.data.curr && (e.setData({
            curr: t,
            list: [],
            page: 1,
            isbottom: !1
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "run_order",
                curr: e.data.curr,
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        }));
    },
    menu_close: function() {
        this.setData({
            menu: !1,
            shadow: !1,
            btn1: !1,
            btn2: !1,
            btn3: !1,
            btn4: !1
        });
    },
    call: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.list;
        wx.makePhoneCall({
            phoneNumber: e[t].userinfo.mobile
        });
    },
    map: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.list;
        wx.openLocation({
            latitude: e[t].userinfo.map.latitude,
            longitude: e[t].userinfo.map.longitude,
            name: e[t].userinfo.map.name,
            address: e[t].userinfo.map.address,
            scale: 28
        });
    },
    order_change: function(a) {
        var t = this, e = a.currentTarget.dataset.name, n = a.currentTarget.dataset.index, s = a.currentTarget.dataset.id, o = t.data.list;
        wx.showModal({
            title: "提示",
            content: "确定操作吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/orderchange",
                    data: {
                        name: e,
                        index: n,
                        id: o[s].id
                    },
                    success: function(a) {
                        "" != a.data.data && (wx.showToast({
                            title: "成功",
                            icon: "success",
                            duration: 2e3
                        }), "get_status" == e && 1 == n && (o[s].get_status = 1), "send_status" == e && 1 == n && (o[s].send_status = 1, 
                        o[s].end = 1, o[s].order_status = "已完成"), t.setData({
                            list: o
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    getcode: function(a) {
        var t = this, e = a.currentTarget.dataset.index, n = t.data.list[e].id;
        t.setData({
            maskHidden: !1
        }), wx.showToast({
            title: "生成中...",
            icon: "loading",
            duration: 2e3
        });
        var s = setTimeout(function() {
            wx.hideToast();
            var a = t.setCanvasSize();
            t.createQrCode(n, "mycanvas", a.w, a.h), t.setData({
                maskHidden: !0,
                shadow: !0,
                code: !0
            }), clearTimeout(s);
        }, 2e3);
    },
    code_close: function() {
        this.setData({
            shadow: !1,
            code: !1
        });
    },
    order_cancel: function(a) {
        var t = a.currentTarget.dataset.index;
        this.setData({
            index: t,
            shadow: !0,
            menu: !0
        });
    },
    cancel_close: function() {
        this.setData({
            shadow: !1,
            menu: !1
        });
    },
    cancel_input: function(a) {
        this.setData({
            cancel_content: a.detail.value
        });
    },
    cancel_btn: function(a) {
        var e = this, n = e.data.index, t = e.data.cancel_content;
        console.log(e.data.list), console.log(n), "" != t && null != t ? app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "order_cancel",
                id: e.data.list[n].id,
                content: t
            },
            success: function(a) {
                if ("" != a.data.data) {
                    var t = e.data.list;
                    t.splice(n, 1), e.setData({
                        list: t,
                        cancel_content: "",
                        menu: !1,
                        shadow: !1
                    }), wx.showToast({
                        title: "取消成功",
                        icon: "success",
                        duration: 2e3
                    });
                }
            }
        }) : wx.showModal({
            title: "错误",
            content: "请填写备注！",
            success: function(a) {
                a.confirm ? console.log("用户点击确定") : a.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), common.run(e), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "run_order",
                curr: e.data.curr,
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: t.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var e = this;
        e.data.isbottom || app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "run_order",
                curr: e.data.curr,
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? e.setData({
                    list: e.data.list.concat(t.data),
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        });
    },
    setCanvasSize: function() {
        var a = {};
        try {
            var t = wx.getSystemInfoSync(), e = .6 * t.windowWidth, n = e;
            a.w = e, a.h = n;
        } catch (a) {
            console.log("获取设备信息失败" + a);
        }
        return a;
    },
    createQrCode: function(a, t, e, n) {
        QR.qrApi.draw(a, t, e, n);
        var s = this, o = setTimeout(function() {
            s.canvasToTempImage(), clearTimeout(o);
        }, 3e3);
    },
    canvasToTempImage: function() {
        var e = this;
        wx.canvasToTempFilePath({
            canvasId: "mycanvas",
            success: function(a) {
                var t = a.tempFilePath;
                console.log(t), e.setData({
                    imagePath: t
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    previewImg: function(a) {
        var t = this.data.imagePath;
        wx.previewImage({
            current: t,
            urls: [ t ]
        });
    }
});