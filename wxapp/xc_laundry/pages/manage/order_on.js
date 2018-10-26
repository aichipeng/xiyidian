var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        pagePath: "../manage/order_on",
        curr: -1,
        page: 1,
        pagesize: 20,
        isbottom: !1
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
    tab: function(t) {
        var e = this, a = t.currentTarget.dataset.index;
        a != e.data.curr && (e.setData({
            curr: a,
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
            success: function(t) {
                var a = t.data;
                "" != a.data ? e.setData({
                    list: a.data,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        }));
    },
    call: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.list;
        wx.makePhoneCall({
            phoneNumber: e[a].userinfo.mobile
        });
    },
    map: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.list;
        wx.openLocation({
            latitude: e[a].userinfo.map.latitude,
            longitude: e[a].userinfo.map.longitude,
            name: e[a].userinfo.map.name,
            address: e[a].userinfo.map.address,
            scale: 28
        });
    },
    order_change: function(t) {
        var a = this, e = t.currentTarget.dataset.name, n = t.currentTarget.dataset.index, s = t.currentTarget.dataset.id, o = a.data.list;
        wx.showModal({
            title: "提示",
            content: "确定操作吗？",
            success: function(t) {
                t.confirm ? app.util.request({
                    url: "entry/wxapp/orderchange",
                    data: {
                        name: e,
                        index: n,
                        id: o[s].id
                    },
                    success: function(t) {
                        "" != t.data.data && (wx.showToast({
                            title: "成功",
                            icon: "success",
                            duration: 2e3
                        }), "get_status" == e && 1 == n && (o[s].get_status = 1), "send_status" == e && 1 == n && (o[s].send_status = 1, 
                        o[s].end = 1, o[s].order_status = "已完成"), a.setData({
                            list: o
                        }));
                    }
                }) : t.cancel && console.log("用户点击取消");
            }
        });
    },
    test: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            test: !0,
            shadow: !0,
            index: a
        });
    },
    test_close: function() {
        this.setData({
            test: !1,
            shadow: !1
        });
    },
    test_btn: function(t) {
        var a = this, e = t.currentTarget.dataset.index, n = a.data.index, s = a.data.list;
        1 == e ? -1 == s[n].service_status && a.setData({
            shadow: !0,
            btn2: !0,
            test: !1
        }) : 2 == e ? 1 == s[n].pay_type && (-1 == s[n].service_status ? wx.showModal({
            title: "错误",
            content: "请先检验确认",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        }) : null == s[n].amount || "" == s[n].amount ? a.setData({
            shadow: !0,
            btn3: !0,
            test: !1
        }) : wx.showModal({
            title: "错误",
            content: "已扣款",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        })) : 3 == e && 1 == s[n].service_status && (null == s[n].amount || "" == s[n].amount ? wx.showModal({
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
        var a = this, e = t.currentTarget.dataset.status, n = a.data.index, s = a.data.list, o = t.currentTarget.dataset.name;
        a.setData({
            btn2: !1,
            btn3: !1,
            btn4: !1,
            shadow: !1
        }), app.util.request({
            url: "entry/wxapp/orderchange",
            data: {
                name: o,
                index: e,
                id: s[n].id
            },
            success: function(t) {
                "" != t.data.data && (wx.showToast({
                    title: "成功",
                    icon: "success",
                    duration: 2e3
                }), "service_status" == o && (2 == e ? s.splice(n, 1) : 1 == e ? (s[n].service_status = e, 
                s[n].orders = 3, s[n].order_status = "服务中") : 3 == e && s.splice(n, 1)), a.setData({
                    list: s
                }));
            }
        });
    },
    input: function(t) {
        this.setData({
            test_amount: t.detail.value
        });
    },
    chargeback: function() {
        var a = this, e = a.data.index, n = a.data.list, s = a.data.test_amount;
        "" != s && null != s ? app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "chargeback",
                id: n[e].id,
                amount: s
            },
            success: function(t) {
                "" != t.data.data && (wx.showToast({
                    title: "成功",
                    icon: "success",
                    duration: 2e3
                }), a.setData({
                    btn3: !1,
                    shadow: !1
                }), n[e].amount = s, a.setData({
                    list: n
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
    order_cancel: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            index: a,
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
    cancel_input: function(t) {
        this.setData({
            cancel_content: t.detail.value
        });
    },
    cancel_btn: function(t) {
        var e = this, n = e.data.index, a = e.data.cancel_content;
        console.log(e.data.list), console.log(n), "" != a && null != a ? app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "order_cancel",
                id: e.data.list[n].id,
                content: a
            },
            success: function(t) {
                if ("" != t.data.data) {
                    var a = e.data.list;
                    a.splice(n, 1), e.setData({
                        list: a,
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
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(t) {
        var e = this;
        common.config(e), common.theme(e), common.admin_footer(e), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "run_order",
                curr: e.data.curr,
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(t) {
                var a = t.data;
                "" != a.data ? e.setData({
                    list: a.data,
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
            success: function(t) {
                var a = t.data;
                "" != a.data ? e.setData({
                    list: e.data.list.concat(a.data),
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        });
    }
});