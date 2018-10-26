var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        pagePath: "../run/order",
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    orders: function(a) {
        var t, e = this, o = a.currentTarget.dataset.index, s = e.data.list, n = a.currentTarget.dataset.orders;
        1 == n ? t = "接单" : 2 == n && (t = "送单"), wx.showModal({
            title: "提示",
            content: "确定" + t + "吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/addorders",
                    data: {
                        id: s[o].id,
                        orders: n
                    },
                    success: function(a) {
                        "" != a.data.data && (wx.showToast({
                            title: t + "成功",
                            icon: "success",
                            duration: 2e3
                        }), s.splice(o, 1), e.setData({
                            list: s
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), common.run(e), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "order",
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && "" != t.data.list && null != t.data.list ? e.setData({
                    list: t.data.list,
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
                op: "order",
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && "" != t.data.list && null != t.data.list ? e.setData({
                    list: e.data.list.concat(t.data.list),
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        });
    }
});