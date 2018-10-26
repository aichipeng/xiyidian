var app = getApp(), common = require("../common/common.js");

function shop_amount(s) {
    app.util.request({
        url: "entry/wxapp/service",
        showLoading: !1,
        data: {
            op: "shop_amount"
        },
        success: function(a) {
            var t = a.data;
            "" != t.data && s.setData({
                shop_amount: t.data
            });
        }
    });
}

Page({
    data: {
        curr: 0,
        page: 1,
        pagesize: 20,
        amount: 0,
        order: [],
        menu: !1
    },
    tab: function(a) {
        var i = this, t = a.currentTarget.dataset.index;
        if (t != i.data.curr) {
            var s = i.data.class;
            if (i.setData({
                curr: t
            }), !s[t].isbottom && 0 == s[t].list.length) {
                var e = {
                    op: "service",
                    page: s[t].page,
                    pagesize: i.data.pagesize,
                    cid: i.data.class[t].id
                };
                app.util.request({
                    url: "entry/wxapp/service",
                    data: e,
                    success: function(a) {
                        var t = a.data, s = i.data.class;
                        if ("" != t.data) {
                            for (var e = 0; e < s.length; e++) e == i.data.curr && (s[e].page = s[e].page + 1, 
                            "" != t.data.list && null != t.data.list ? s[e].list = s[e].list.concat(t.data.list) : s[e].isbottom = !0);
                            i.setData({
                                class: s
                            });
                        }
                    }
                });
            }
        }
    },
    up: function(a) {
        var s = this, t = a.currentTarget.dataset.index, e = s.data.class;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "shop_status",
                status: 1,
                member: 1,
                cid: e[s.data.curr].list[t].id
            },
            success: function(a) {
                "" != a.data.data && (e[s.data.curr].list[t].total = parseInt(e[s.data.curr].list[t].total) + 1, 
                s.setData({
                    class: e
                }), shop_amount(s), app.util.request({
                    url: "entry/wxapp/service",
                    showLoading: !1,
                    data: {
                        op: "shop"
                    },
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && s.setData({
                            shop_list: t.data
                        });
                    }
                }));
            }
        });
    },
    down: function(a) {
        var s = this, t = a.currentTarget.dataset.index, e = s.data.class;
        0 < e[s.data.curr].list[t].total && app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "shop_status",
                status: 1,
                member: -1,
                cid: e[s.data.curr].list[t].id
            },
            success: function(a) {
                "" != a.data.data && (e[s.data.curr].list[t].total = parseInt(e[s.data.curr].list[t].total) - 1, 
                s.setData({
                    class: e
                }), shop_amount(s), app.util.request({
                    url: "entry/wxapp/service",
                    showLoading: !1,
                    data: {
                        op: "shop"
                    },
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && s.setData({
                            shop_list: t.data
                        });
                    }
                }));
            }
        });
    },
    menu_on: function() {
        var s = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "shop"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && s.setData({
                    shop_list: t.data,
                    shadow: !0,
                    menu: !0
                });
            }
        });
    },
    pay: function() {
        var a = this;
        if (0 == parseInt(a.data.shop_amount.total)) a.setData({
            toast: !0,
            toast_text: "请先添加"
        }), setTimeout(function() {
            a.setData({
                toast: !1
            });
        }, 2e3); else {
            for (var t = [], s = a.data.shop_list, e = 0; e < s.length; e++) if (0 < parseInt(s[e].member)) {
                var i = {};
                i.id = s[e].cid, i.total = s[e].member, t.push(i);
            }
            wx.navigateTo({
                url: "../pay/pay2?&goods=" + JSON.stringify(t) + "&amount=" + a.data.shop_amount.amount + "&total=" + a.data.shop_amount.total
            });
        }
    },
    menu_close: function() {
        var c = this;
        c.setData({
            menu: !1,
            shadow: !1,
            page: 1,
            isbottom: !1
        });
        var a = c.data.curr, r = (c.data.class, {
            op: "service",
            page: 1,
            pagesize: c.data.pagesize,
            cid: c.data.class[a].id
        });
        app.util.request({
            url: "entry/wxapp/service",
            data: r,
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    if ("" != t.data.class && null != t.data.class) {
                        var s = 0;
                        if ("" != r.cid && null != r.cid) for (var e = 0; e < t.data.class.length; e++) t.data.class[e].id == r.cid && (s = e, 
                        c.setData({
                            curr: s
                        }));
                        for (var i = 0; i < t.data.class.length; i++) t.data.class[i].page = 1, t.data.class[i].pagesize = 20, 
                        t.data.class[i].isbottom = !1, t.data.class[i].list = [], i == c.data.curr && (t.data.class[i].page = t.data.class[i].page + 1, 
                        "" != t.data.list && null != t.data.list ? t.data.class[i].list = t.data.list : t.data.class[i].isbottom = !0);
                        c.setData({
                            class: t.data.class
                        });
                    }
                } else c.setData({
                    isbottom: !0
                });
            }
        });
    },
    shop_down: function(a) {
        var t = this, s = a.currentTarget.dataset.index, e = t.data.shop_list;
        0 < e[s].member && app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "shop_status",
                status: 1,
                member: -1,
                cid: e[s].cid
            },
            success: function(a) {
                "" != a.data.data && (e[s].member = parseInt(e[s].member) - 1, t.setData({
                    shop_list: e
                }), shop_amount(t));
            }
        });
    },
    shop_up: function(a) {
        var t = this, s = a.currentTarget.dataset.index, e = t.data.shop_list;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "shop_status",
                status: 1,
                member: 1,
                cid: e[s].cid
            },
            success: function(a) {
                "" != a.data.data && (e[s].member = parseInt(e[s].member) + 1, t.setData({
                    shop_list: e
                }), shop_amount(t));
            }
        });
    },
    shop_del: function(a) {
        var t = this, s = a.currentTarget.dataset.index, e = t.data.shop_list;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "shop_status",
                status: -1,
                cid: e[s].cid
            },
            success: function(a) {
                "" != a.data.data && (e.splice(s, 1), t.setData({
                    shop_list: e
                }), shop_amount(t));
            }
        });
    },
    onLoad: function(a) {
        var c = this;
        common.config(c), common.theme(c);
        var r = {
            op: "service",
            page: c.data.page,
            pagesize: c.data.pagesize
        };
        "" != a.cid && null != a.cid && (r.cid = a.cid), app.util.request({
            url: "entry/wxapp/service",
            data: r,
            success: function(a) {
                var t = a.data;
                if ("" != t.data) {
                    if ("" != t.data.class && null != t.data.class) {
                        var s = 0;
                        if ("" != r.cid && null != r.cid) for (var e = 0; e < t.data.class.length; e++) t.data.class[e].id == r.cid && (s = e, 
                        c.setData({
                            curr: s
                        }));
                        for (var i = 0; i < t.data.class.length; i++) t.data.class[i].page = 1, t.data.class[i].pagesize = 20, 
                        t.data.class[i].isbottom = !1, t.data.class[i].list = [], i == c.data.curr && (t.data.class[i].page = t.data.class[i].page + 1, 
                        "" != t.data.list && null != t.data.list ? t.data.class[i].list = t.data.list : t.data.class[i].isbottom = !0);
                        c.setData({
                            class: t.data.class
                        });
                    }
                } else c.setData({
                    isbottom: !0
                });
            }
        }), shop_amount(c), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "shop"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && c.setData({
                    shop_list: t.data
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
        var i = this, a = i.data.curr, t = i.data.class;
        if (!t[a].isbottom) {
            var s = {
                op: "service",
                page: t[a].page,
                pagesize: i.data.pagesize,
                cid: i.data.class[a].id
            };
            app.util.request({
                url: "entry/wxapp/service",
                data: s,
                success: function(a) {
                    var t = a.data, s = i.data.class;
                    if ("" != t.data) {
                        for (var e = 0; e < s.length; e++) e == i.data.curr && (s[e].page = s[e].page + 1, 
                        "" != t.data.list && null != t.data.list ? s[e].list = s[e].list.concat(t.data.list) : s[e].isbottom = !0);
                        i.setData({
                            class: s
                        });
                    }
                }
            });
        }
    }
});