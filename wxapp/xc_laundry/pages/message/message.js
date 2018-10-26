var app = getApp(), common = require("../common/common.js");

function sign(a) {
    var t = a.data.name, e = a.data.mobile, n = a.data.content, o = !0;
    "" != t && null != t || (o = !1), "" != e && null != e || (o = !1), /^1[34578]\d{9}$/.test(e) || (o = !1), 
    "" != n && null != n || (o = !1), a.setData({
        submit: o
    });
}

Page({
    data: {
        online: !1,
        shadow: !1,
        submit: !1,
        page: 1,
        pagesize: 15,
        isbottom: !1,
        list: []
    },
    call: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.contact.content.mobile
        });
    },
    map: function() {
        var a = this;
        wx.openLocation({
            latitude: parseFloat(a.data.contact.content.latitude),
            longitude: parseFloat(a.data.contact.content.longitude),
            name: a.data.contact.content.address,
            address: a.data.contact.content.address,
            scale: 28
        });
    },
    page_open: function() {
        this.setData({
            menu: !0,
            shadow: !0
        });
    },
    menu_close: function() {
        this.setData({
            menu: !1,
            shadow: !1
        });
    },
    online: function(a) {
        var t = a.currentTarget.dataset.id;
        this.setData({
            online: !0,
            shadow: !0,
            pid: t
        });
    },
    online_close: function() {
        this.setData({
            online: !1,
            shadow: !1
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

          case "content":
            t.setData({
                content: a.detail.value
            });
        }
        sign(t);
    },
    submit: function(a) {
        var t = this, e = a.detail.formId;
        if (1 == t.data.submit) {
            var n = {
                op: "addmessage",
                name: t.data.name,
                mobile: t.data.mobile,
                content: t.data.content,
                form_id: e
            };
            app.util.request({
                url: "entry/wxapp/service",
                data: n,
                success: function(a) {
                    0 == a.data.errno && (t.setData({
                        online: !1,
                        shadow: !1,
                        name: "",
                        mobile: "",
                        content: ""
                    }), wx.showToast({
                        title: "留言成功",
                        icon: "success",
                        duration: 2e3
                    }));
                }
            });
        }
    },
    wx: function(a) {
        function t() {
            return a.apply(this, arguments);
        }
        return t.toString = function() {
            return a.toString();
        }, t;
    }(function() {
        var t = this;
        wx.chooseAddress({
            success: function(a) {
                t.setData({
                    name: a.userName,
                    mobile: a.telNumber
                }), sign(t);
            }
        });
    }),
    onLoad: function(a) {
        var e = this;
        common.config(e), common.theme(e), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "message",
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data ? ("" != t.data.contact && null != t.data.contact && e.setData({
                    contact: t.data.contact
                }), "" != t.data.message && null != t.data.message ? e.setData({
                    list: t.data.message,
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
            url: "entry/wxapp/service",
            data: {
                op: "message",
                page: e.data.page,
                pagesize: e.data.pagesize
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && "" != t.data.message && null != t.data.message ? e.setData({
                    list: e.data.list.concat(t.data.message),
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        });
    }
});