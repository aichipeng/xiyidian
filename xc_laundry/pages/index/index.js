var app = getApp(), common = require("../common/common.js");

function sign(a) {
    var t = a.data.name, e = a.data.mobile, n = a.data.address, o = app.map_status, s = a.data.map, c = a.data.total, i = !0;
    "" != t && null != t || (i = !1);
    "" != e && null != e && /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/.test(e) || (i = !1), 
    "" != n && null != n || (i = !1), "" != c && null != c || (i = !1), -1 == o && ("" != s && null != s || (i = !1)), 
    a.setData({
        submit: i
    });
}

Page({
    data: {
        pagePath: "../index/index",
        indicatorDots: !0,
        autoplay: !0,
        interval: 5e3,
        duration: 1e3,
        submit: !1
    },
    menu_on: function() {
        var a = this, t = a.data.card, e = 0;
        "" != t && null != t && "" != t.content.price && null != t.content.price && (e = t.content.price), 
        1 == a.data.userinfo.card && parseFloat(e) <= parseFloat(a.data.userinfo.money) ? a.setData({
            shadow: !0,
            menu: !0
        }) : a.setData({
            shadow: !0,
            menu_condition: !0
        });
    },
    menu_close: function() {
        this.setData({
            shadow: !1,
            menu: !1,
            menu_condition: !1
        });
    },
    to_card: function(a) {
        var t = a.currentTarget.dataset.index;
        1 == t ? wx.reLaunch({
            url: "../user/user"
        }) : 2 == t && (1 == this.data.userinfo.card ? wx.navigateTo({
            url: "../recharge/recharge"
        }) : wx.reLaunch({
            url: "../user/user"
        }));
    },
    wx_address: function() {
        var t = this;
        wx.chooseAddress({
            success: function(a) {
                t.setData({
                    name: a.userName,
                    mobile: a.telNumber
                }), sign(t);
            }
        });
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
                            distance: t.data.distance,
                            area: t.data.area
                        });
                    }
                }), sign(e);
            }
        });
    },
    input: function(a) {
        var t = this;
        switch (a.currentTarget.dataset.name) {
          case "name":
            t.setData({
                name: a.detail.value
            });
            break;

          case "mobile":
            t.setData({
                mobile: a.detail.value
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

          case "content":
            t.setData({
                content: a.detail.value
            });
        }
        sign(t);
    },
    submit: function(a) {
        var t = this;
        if (t.data.submit) {
            var e = {
                name: t.data.name,
                mobile: t.data.mobile,
                address: t.data.address,
                total: t.data.total,
                pay_type: 1,
                form_id: a.detail.formId
            };
            "" != t.data.map && null != t.data.map && (e.map = JSON.stringify(t.data.map)), 
            "" != t.data.content && null != t.data.content && (e.content = t.data.content), 
            "" != t.data.distance && null != t.data.distance && (e.distance = t.data.distance), 
            app.util.request({
                url: "entry/wxapp/setorder",
                data: e,
                success: function(a) {
                    var t = a.data;
                    console.log(a), "" != t.data && wx.reLaunch({
                        url: "../order/order"
                    });
                }
            });
        }
    },
    link: function(a) {
        // var t = a.currentTarget.dataset.link;
        // "" != t && null != t && (t = escape(t), wx.navigateTo({
        //     url: "../link/link?&url=" + t
        // }));
    },
    setcoupon: function(a) {
        var t = this, e = a.currentTarget.dataset.index, n = t.data.coupon;
        1 == n[e].user ? wx.showModal({
            title: "提示",
            content: "此优惠券已领取",
            success: function(a) {
                a.confirm ? console.log("用户点击确定") : a.cancel && console.log("用户点击取消");
            }
        }) : wx.showModal({
            title: "提示",
            content: "确定领取优惠券吗？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/index",
                    data: {
                        op: "setcoupon",
                        cid: n[e].id
                    },
                    success: function(a) {
                        "" != a.data.data && (n[e].user = 1, t.setData({
                            coupon: n
                        }), wx.showToast({
                            title: "领取成功",
                            icon: "success",
                            duration: 2e3
                        }));
                    }
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(a) {
        var t = this;
        common.config(t), common.theme(t), common.index(t);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var a = "/xc_laundry/pages/index/index";
        return a = escape(a), {
            title: this.data.config.content.title + "-首页",
            path: "/xc_laundry/pages/base/base?&share=" + a,
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log(a);
            }
        };
    }
});