var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        curr: 0,
        page: 1,
        pagesize: 20,
        isbottom: !1
    },
    tab: function(a) {
        var s = this, t = a.currentTarget.dataset.index;
        if (t != s.data.curr) {
            s.setData({
                curr: t,
                list: [],
                page: 1,
                isbottom: !1
            });
            var e = {
                op: "service",
                page: s.data.page,
                pagesize: s.data.pagesize,
                cid: s.data.class[t].id
            };
            "" != s.data.search && null != s.data.search && (e.search = s.data.search), app.util.request({
                url: "entry/wxapp/service",
                data: e,
                success: function(a) {
                    var t = a.data;
                    "" != t.data && "" != t.data.list && null != t.data.list ? s.setData({
                        list: t.data.list,
                        page: s.data.page + 1
                    }) : s.setData({
                        isbottom: !0
                    });
                }
            });
        }
    },
    input: function(a) {
        this.setData({
            search: a.detail.value
        });
    },
    search: function() {
        var s = this;
        if (" " != s.data.sarch && null != s.data.search) {
            s.setData({
                list: [],
                page: 1,
                isbottom: !1
            });
            var a = {
                op: "service",
                page: s.data.page,
                pagesize: s.data.pagesize,
                cid: s.data.class[s.data.curr].id,
                search: s.data.search
            };
            app.util.request({
                url: "entry/wxapp/service",
                data: a,
                success: function(a) {
                    var t = a.data;
                    "" != t.data && "" != t.data.list && null != t.data.list ? s.setData({
                        list: t.data.list,
                        page: s.data.page + 1
                    }) : s.setData({
                        isbottom: !0
                    });
                }
            });
        }
    },
    onLoad: function(a) {
        var i = this;
        common.config(i), common.theme(i);
        var c = {
            op: "service",
            page: i.data.page,
            pagesize: i.data.pagesize
        };
        app.util.request({
            url: "entry/wxapp/service",
            data: c,
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    if ("" != t.data.class && null != t.data.class) {
                        var s = 0;
                        if ("" != c.cid && null != c.cid) for (var e = 0; e < t.data.class.length; e++) t.data.class[e].id == c.cid && (s = e);
                        i.setData({
                            class: t.data.class,
                            curr: s
                        });
                    }
                    "" != t.data.list && null != t.data.list ? i.setData({
                        list: t.data.list,
                        page: i.data.page + 1
                    }) : i.setData({
                        isbottom: !0
                    });
                } else i.setData({
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
        var s = this;
        if (!s.data.isbottom) {
            var a = {
                op: "service",
                page: s.data.page,
                pagesize: s.data.pagesize,
                cid: s.data.class[s.data.curr].id
            };
            "" != s.data.search && null != s.data.search && (a.search = s.data.search), app.util.request({
                url: "entry/wxapp/service",
                data: a,
                success: function(a) {
                    var t = a.data;
                    "" != t.data && "" != t.data.list && null != t.data.list ? s.setData({
                        list: s.data.list.concat(t.data.list),
                        page: s.data.page + 1
                    }) : s.setData({
                        isbottom: !0
                    });
                }
            });
        }
    }
});