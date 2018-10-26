var app = getApp(), common = require("../common/common.js");

function sign(a) {
    var t = a.data.mobile, e = a.data.code, n = a.data.password, o = a.data.name, s = !0;
    "" != t && null != t || (s = !1), "" != o && null != o || (s = !1);
    /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/.test(t) || (s = !1), 
    1 == a.data.card.content.sms && ("" != e && null != e || (s = !1)), ("" == n || null == n || n.length < 6) && (s = !1), 
    a.setData({
        submit: s
    });
}

function time_dowm(t) {
    var e = setInterval(function() {
        var a = t.data.times;
        0 == a ? (t.setData({
            isload: !1
        }), clearInterval(e)) : (a -= 1, t.setData({
            times: a
        }));
    }, 1e3);
}

Page({
    data: {
        submit: !1,
        mobile: "",
        code: "",
        password: "",
        isload: !1
    },
    menu_on: function() {
        this.setData({
            shadow: !0,
            menu: !0
        });
    },
    menu_close: function() {
        this.setData({
            shadow: !1,
            menu: !1
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

          case "code":
            t.setData({
                code: a.detail.value
            });
            break;

          case "password":
            t.setData({
                password: a.detail.value
            });
            break;

          case "name":
            t.setData({
                name: a.detail.value
            });
        }
    },
    getcode: function() {
        var t = this, a = t.data.mobile;
        t.data.isload || ("" != a && null != a && /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/.test(a) ? app.util.request({
            url: "entry/wxapp/getcode",
            data: {
                mobile: t.data.mobile
            },
            success: function(a) {
                t.setData({
                    times: 60,
                    isload: !0
                }), time_dowm(t);
            }
        }) : t.setData({
            menu_error: !0
        }));
    },
    submit: function() {
        var a = this;
        if (sign(a), a.data.submit) {
            a.setData({
                menu_error: !1,
                menu: !1,
                shadow: !1
            });
            var t = {
                op: "card_activation",
                mobile: a.data.mobile,
                password: a.data.password,
                name: a.data.name
            };
            1 == a.data.card.content.sms && (t.code = a.data.code), app.util.request({
                url: "entry/wxapp/user",
                data: t,
                success: function(a) {
                    "" != a.data.data && (wx.showToast({
                        title: "激活成功",
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.reLaunch({
                            url: "../user/user"
                        });
                    }, 2e3));
                }
            });
        } else a.setData({
            menu_error: !0
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "card"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    card: t.data
                });
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