var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        curr: 1
    },
    tab: function(t) {
        var a = t.currentTarget.dataset.index;
        a != this.data.curr && this.setData({
            curr: a
        });
    },
    onLoad: function(t) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/order",
            data: {
                op: "detail",
                id: t.id
            },
            success: function(t) {
                var a = t.data;
                if ("" != a.data) {
                    for (var n = 0, o = 0; o < a.data.step.length; o++) "" != a.data.step[o] && (n = o);
                    e.setData({
                        list: a.data,
                        step: n
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