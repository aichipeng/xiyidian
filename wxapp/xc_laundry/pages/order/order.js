var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        pagePath: "../order/order",
        page: 1,
        pagesize: 15,
        isbottom: !1,
        end: -1
    },
    call: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.contact.content.mobile
        });
    },
    tab: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        t != e.data.end && (e.setData({
            end: t,
            page: 1,
            isbottom: !1,
            list: []
        }), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "order",
                page: e.data.page,
                pagesize: e.data.pagesize,
                end: e.data.end
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
        }));
    },
    del_order: function(a) {
        var t = this, e = a.currentTarget.dataset.index, o = t.data.list;
        wx.showModal({
            title: "提示",
            content: "确定取消吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/order",
                    data: {
                        op: "del_order",
                        id: o[e].id
                    },
                    success: function(a) {
                        "" != a.data.data && (wx.showToast({
                            title: "成功",
                            icon: "success",
                            duration: 2e3
                        }), o.splice(e, 1), t.setData({
                            list: o
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "order",
                page: e.data.page,
                pagesize: e.data.pagesize,
                end: e.data.end
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? ("" != t.data.contact && null != t.data.contact && e.setData({
                    contact: t.data.contact
                }), "" != t.data.list && null != t.data.list ? e.setData({
                    list: t.data.list,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                })) : e.setData({
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
            url: "entry/wxapp/order",
            data: {
                op: "order",
                page: e.data.page,
                pagesize: e.data.pagesize,
                end: e.data.end
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
    }
});