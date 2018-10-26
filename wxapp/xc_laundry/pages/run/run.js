var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        pagePath: "../run/run",
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    onLoad: function(a) {
        var o = this;
        common.config(o), common.theme(o), common.run(o), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "run",
                page: o.data.page,
                pagesize: o.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? ("" != t.data.userinfo && null != t.data.userinfo && o.setData({
                    userinfo: t.data.userinfo
                }), "" != t.data.list && null != t.data.list ? o.setData({
                    list: t.data.list,
                    page: o.data.page + 1
                }) : o.setData({
                    isbottom: !0
                })) : o.setData({
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
        var o = this;
        o.data.isbottom || app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "run",
                page: o.data.page,
                pagesize: o.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && "" != t.data.list && null != t.data.list ? o.setData({
                    list: t.data.list
                }) : o.setData({
                    isbottom: !0
                });
            }
        });
    }
});