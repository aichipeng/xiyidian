var app = getApp(), common = require("../common/common.js");

function time_dowm(a) {
    var e = setInterval(function() {
        var t = a.data.times;
        0 == t ? (a.setData({
            isload: !1
        }), clearInterval(e)) : (t -= 1, a.setData({
            times: t
        }));
    }, 1e3);
}

Page({
    data: {
        isload: !1
    },
    edit: function() {
        var t = this;
        1 == t.data.card.content.sms ? t.setData({
            step1: !0
        }) : t.setData({
            step2: !0
        });
    },
    getcode: function() {
        var a = this;
        a.data.isload || app.util.request({
            url: "entry/wxapp/getcode",
            data: {
                mobile: a.data.userinfo.mobile
            },
            success: function(t) {
                a.setData({
                    isload: !0,
                    times: 60
                }), time_dowm(a);
            }
        });
    },
    to_step: function() {
        var a = this, t = a.data.code;
        "" == t || null == t ? (a.setData({
            toast: !0,
            toast_text: "验证码不能为空"
        }), setTimeout(function() {
            a.setData({
                toast: !1
            });
        }, 2e3)) : app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "code",
                code: a.data.code
            },
            success: function(t) {
                "" != t.data.status && a.setData({
                    step2: !0,
                    step1: !1,
                    isload: !1,
                    code: ""
                });
            }
        });
    },
    input: function(t) {
        var a = this;
        switch (t.currentTarget.dataset.name) {
          case "mobile":
            a.setData({
                mobile: t.detail.value
            });
            break;

          case "code":
            a.setData({
                code: t.detail.value
            });
            break;

          case "password":
            a.setData({
                password: t.detail.value
            });
            break;

          case "old_password":
            a.setData({
                old_password: t.detail.value
            });
        }
    },
    submit: function() {
        var t = this, a = t.data.type, e = {};
        if ("mobile" == a) {
            var s = t.data.mobile;
            if ("" != s && null != s && /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/.test(s)) e = {
                name: "mobile",
                content: s,
                op: "card_edit"
            }, 1 == t.data.card.content.sms && (e.code = t.data.code); else t.setData({
                toast: !0,
                toast_text: "手机号不正确"
            }), setTimeout(function() {
                t.setData({
                    toast: !1
                });
            }, 2e3);
        } else if ("password" == a) {
            var o = t.data.password;
            if ("" == o || null == o || o.length < 6) t.setData({
                toast: !0,
                toast_text: "密码不正确"
            }), setTimeout(function() {
                t.setData({
                    toast: !1
                });
            }, 2e3); else if (-1 == t.data.card.content.sms) {
                var n = t.data.old_password;
                "" == n || null == n || n.length < 6 ? (t.setData({
                    toast: !0,
                    toast_text: "密码不正确"
                }), setTimeout(function() {
                    t.setData({
                        toast: !1
                    });
                }, 2e3)) : e = {
                    name: "password",
                    content: o,
                    op: "card_edit",
                    old_password: n
                };
            } else e = {
                name: "password",
                content: o,
                op: "card_edit"
            };
        }
        "" != e.name && null != e.name && app.util.request({
            url: "entry/wxapp/user",
            data: e,
            success: function(t) {
                var a = t.data;
                "" != a.data && (wx.showToast({
                    title: "修改成功",
                    icon: "success",
                    duration: 2e3
                }), app.userinfo = a.data, setTimeout(function() {
                    wx.navigateBack({
                        delta: 1
                    });
                }, 2e3));
            }
        });
    },
    onLoad: function(t) {
        var e = this;
        common.config(e), common.theme(e), e.setData({
            type: t.type
        }), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "card"
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && e.setData({
                    card: a.data
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