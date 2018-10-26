var app = getApp(), common = require("../common/common.js");

function sign(a) {
    var t = a.data.name, e = a.data.address, n = a.data.total, s = a.data.amount, d = !0;
    "" != t && null != t || (d = !1), "" != e && null != e || (d = !1), "" != n && null != n || (d = !1), 
    "" != s && null != s || (d = !1), a.setData({
        submit: d
    });
}

Page({
    data: {
        submit: !1,
        pay_curr: 2,
        curr: 1
    },
    search: function() {
        var e = this, a = e.data.mobile;
        "" != a && null != a && (e.setData({
            card_id: "",
            name: "",
            address: ""
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "card",
                mobile: a
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? (e.setData({
                    card_id: t.data.userinfo.card_id,
                    name: t.data.userinfo.name,
                    userinfo: t.data.userinfo
                }), "" != t.data.address && null != t.data.address && e.setData({
                    name: t.data.address.name,
                    address: t.data.address.address,
                    map: t.data.address.map
                }), "" != t.data.distance && null != t.data.distance && e.setData({
                    distance: t.data.distance
                })) : e.setData({
                    card_id: "非会员",
                    name: "匿名",
                    address: "本店"
                });
            }
        }));
    },
    choose: function(a) {
        var t = a.currentTarget.dataset.index;
        t != this.data.curr && this.setData({
            curr: t
        });
    },
    pay_choose: function(a) {
        var t = a.currentTarget.dataset.index;
        t != this.data.pay_curr && this.setData({
            pay_curr: t
        });
    },
    input: function(a) {
        var t = this;
        switch (a.currentTarget.dataset.name) {
          case "mobile":
            t.setData({
                mobile: a.detail.value
            });
            break;

          case "content":
            t.setData({
                content: a.detail.value
            });
            break;

          case "name":
            t.setData({
                name: a.detail.value
            });
            break;

          case "address":
            t.setData({
                address: a.detail.value
            });
            break;

          case "total":
            t.setData({
                total: a.detail.value
            });
            break;

          case "amount":
            t.setData({
                amount: a.detail.value
            });
        }
        sign(t);
    },
    map: function() {
        var e = this;
        wx.chooseLocation({
            success: function(a) {
                e.setData({
                    address: a.address,
                    map: a
                });
                var t = {
                    op: "distance",
                    to: a.latitude + "," + a.longitude
                };
                app.util.request({
                    url: "entry/wxapp/index",
                    showLoading: !1,
                    data: t,
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && e.setData({
                            distance: t.data.distance
                        });
                    }
                }), sign(e);
            }
        });
    },
    submit: function() {
        var a = this;
        if (a.data.submit) {
            var t = {
                name: a.data.name,
                mobile: a.data.mobile,
                address: a.data.address,
                total: a.data.total,
                amount: a.data.amount,
                curr: a.data.curr,
                pay_curr: a.data.pay_curr
            }, e = a.data.userinfo;
            "" != e && null != e && (t.openid = e.openid), "" != a.data.map && null != a.data.map && (t.map = a.data.map), 
            "" != a.data.content && null != a.data.content && (t.content = a.data.content), 
            "" != a.data.distance && null != a.data.distance && (t.distance = a.data.distance), 
            1 == a.data.pay_curr && parseFloat(a.data.userinfo.money) <= parseFloat(a.data.amount) ? wx.showModal({
                title: "错误",
                content: "余额不足",
                success: function(a) {
                    a.confirm ? console.log("用户点击确定") : a.cancel && console.log("用户点击取消");
                }
            }) : app.util.request({
                url: "entry/wxapp/shoporder",
                data: t,
                success: function(a) {
                    "" != a.data.data && (wx.showToast({
                        title: "提交成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.reLaunch({
                            url: "manage"
                        });
                    }, 2e3));
                }
            });
        }
    },
    onLoad: function(a) {
        var t = this;
        common.config(t), common.theme(t), t.setData({
            userinfo: ""
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});