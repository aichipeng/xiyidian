var app = getApp(), common = require("../common/common.js");

function sum(t, a) {
    for (var o = 0, e = 0; e < a.length; e++) 2 == a[e].status && (o = (parseFloat(o) + parseFloat(a[e].price) * a[e].total).toFixed(2));
    t.setData({
        amount: o
    });
}

Page({
    data: {
        all_choose: !1
    },
    up: function(t) {
        var a = this, o = t.currentTarget.dataset.index, e = a.data.order;
        e[o].total = e[o].total + 1, sum(a, e), a.setData({
            order: e
        });
    },
    down: function(t) {
        var a = this, o = t.currentTarget.dataset.index, e = a.data.order;
        1 < e[o].total && (e[o].total = e[o].total - 1, sum(a, e), a.setData({
            order: e
        }));
    },
    choose: function(t) {
        var a = this, o = t.currentTarget.dataset.index, e = a.data.order;
        1 == e[o].status ? e[o].status = 2 : e[o].status = 1, sum(a, e);
        for (var n = !0, r = 0; r < e.length; r++) 1 == e[r].status && (n = !1);
        a.setData({
            order: e,
            all_choose: n
        });
    },
    all_choose: function() {
        var t, a = this, o = a.data.order, e = a.data.all_choose;
        t = e ? 1 : 2;
        for (var n = 0; n < o.length; n++) o[n].status = t;
        sum(a, o), a.setData({
            all_choose: !e,
            order: o
        });
    },
    pay: function() {
        var t = this;
        if (0 == parseFloat(t.data.amount).toFixed(2)) t.setData({
            toast: !0,
            toast_text: "请先添加"
        }), setTimeout(function() {
            t.setData({
                toast: !1
            });
        }, 2e3); else {
            for (var a = [], o = t.data.order, e = 0, n = 0; n < o.length; n++) if (2 == o[n].status) {
                var r = {};
                r.id = o[n].id, r.total = o[n].total, r.price = o[n].price, a.push(r), e += o[n].total;
            }
            wx.navigateTo({
                url: "pay2?&goods=" + JSON.stringify(a) + "&amount=" + t.data.amount + "&total=" + e
            });
        }
    },
    onLoad: function(t) {
        var a = this;
        common.config(a), common.theme(a);
        for (var o = JSON.parse(t.order), e = 0; e < o.length; e++) o[e].total = 1;
        a.setData({
            order: o,
            amount: "0.00"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});