var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        pagePath: "../manage/manage",
        run_curr: 1,
        run_choose: -1
    },
    tab: function(t) {
        var e = this, a = t.currentTarget.dataset.index;
        a != e.data.run_curr && (e.setData({
            run: [],
            run_curr: a
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "getrun",
                curr: a
            },
            success: function(t) {
                var a = t.data;
                if ("" != a.data) {
                    for (var n = 0; n < a.data.length; n++) a.data[n].total = parseInt(a.data[n].get_total) + parseInt(a.data[n].send_total);
                    e.setData({
                        run: a.data
                    });
                }
            }
        }));
    },
    orders: function(t) {
        var a, n = this, e = t.currentTarget.dataset.index, o = n.data.order_list, r = t.currentTarget.dataset.orders;
        1 == r ? a = "接单" : 2 == r && (a = "送单"), wx.showModal({
            title: "提示",
            content: "确定" + a + "吗？",
            success: function(t) {
                t.confirm ? app.util.request({
                    url: "entry/wxapp/addorders",
                    data: {
                        id: o[e].id,
                        orders: r
                    },
                    success: function(t) {
                        "" != t.data.data && (wx.showToast({
                            title: a + "成功",
                            icon: "success",
                            duration: 2e3
                        }), o.splice(e, 1), n.setData({
                            order_list: o
                        }));
                    }
                }) : t.cancel && console.log("用户点击取消");
            }
        });
    },
    menu_on: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            menu: !0,
            shadow: !0,
            index: a
        });
    },
    menu_close: function() {
        this.setData({
            menu: !1,
            shadow: !1
        });
    },
    choose: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            run_choose: a
        });
    },
    menu_btn: function() {
        var a = this, t = a.data.run_choose;
        if (a.setData({
            menu: !1,
            shadow: !1
        }), -1 == t) wx.showModal({
            title: "错误",
            content: "请选择跑腿人",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        }); else {
            var n, e, o = a.data.order_list, r = a.data.index;
            null != o[r].get_openid && "" != o[r].get_openid || null != o[r].send_openid && "" != o[r].send_openid ? null == o[r].get_openid && "" == o[r].get_openid || null != o[r].send_openid && "" != o[r].send_openid || (n = 2, 
            e = "送单") : (n = 1, e = "接单");
            var s = {
                orders: n,
                openid: a.data.run_list[t].openid,
                id: o[r].id
            };
            wx.showModal({
                title: "提示",
                content: "确定" + e + "吗？",
                success: function(t) {
                    t.confirm ? app.util.request({
                        url: "entry/wxapp/addorders",
                        data: s,
                        success: function(t) {
                            "" != t.data.data && (wx.showToast({
                                title: e + "成功",
                                icon: "success",
                                duration: 2e3
                            }), o.splice(r, 1), a.setData({
                                order_list: o,
                                choose: -1
                            }));
                        }
                    }) : t.cancel && console.log("用户点击取消");
                }
            });
        }
    },
    onLoad: function(t) {
        var e = this;
        common.config(e), common.theme(e), common.admin_footer(e), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "manage"
            },
            success: function(t) {
                var a = t.data;
                if ("" != a.data) {
                    if (e.setData({
                        click: a.data.click,
                        members: a.data.members,
                        order: a.data.order,
                        amount: a.data.amount
                    }), "" != a.data.order_list && null != a.data.order_list && e.setData({
                        order_list: a.data.order_list
                    }), "" != a.data.run && null != a.data.run) {
                        for (var n = 0; n < a.data.run.length; n++) a.data.run[n].total = parseInt(a.data.run[n].get_total) + parseInt(a.data.run[n].send_total);
                        e.setData({
                            run: a.data.run
                        });
                    }
                    "" != a.data.run_list && null != a.data.run_list && e.setData({
                        run_list: a.data.run_list
                    });
                }
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