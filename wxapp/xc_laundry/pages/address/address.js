var app = getApp(), common = require("../common/common.js");

function sign(a) {
    var t = a.data.name, e = a.data.mobile, s = a.data.address, n = app.map_status, d = a.data.map, i = !0;
    "" != t && null != t || (i = !1), "" != e && null != e || (i = !1);
    /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/.test(e) || (i = !1), 
    "" != s && null != s || (i = !1), -1 == n && ("" != d && null != d || (i = !1)), 
    a.setData({
        submit: i
    });
}

Page({
    data: {
        sex: 1,
        submit: !1
    },
    menu_on: function(a) {
        var t = this, e = a.currentTarget.dataset.edit;
        if (-1 == e) t.setData({
            menu: !0,
            shadow: !0,
            edit: -1
        }); else if (1 == e) {
            var s = a.currentTarget.dataset.index, n = t.data.list[s];
            t.setData({
                menu: !0,
                shadow: !0,
                edit: s,
                name: n.name,
                sex: n.sex,
                mobile: n.mobile,
                address: n.address,
                map: n.map
            });
        }
    },
    menu_close: function() {
        this.setData({
            menu: !1,
            shadow: !1,
            name: "",
            mobile: "",
            sex: 1,
            address: "",
            map: ""
        });
    },
    choose: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        e != t.data.sex && (t.setData({
            sex: e
        }), sign(t));
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
        }
        sign(t);
    },
    map: function() {
        var t = this;
        wx.chooseLocation({
            success: function(a) {
                t.setData({
                    address: a.address,
                    map: a
                }), sign(t);
            }
        });
    },
    confirm: function() {
        var e = this, a = {
            op: "setaddress",
            name: e.data.name,
            sex: e.data.sex,
            mobile: e.data.mobile,
            address: e.data.address
        };
        "" != e.data.map && null != e.data.map && (a.map = JSON.stringify(e.data.map)), 
        -1 != e.data.edit && (a.id = e.data.list[e.data.edit].id), e.data.submit && app.util.request({
            url: "entry/wxapp/user",
            data: a,
            success: function(a) {
                "" != a.data.data && (wx.showToast({
                    title: "操作成功",
                    icon: "success",
                    duration: 2e3
                }), e.setData({
                    menu: !1,
                    shadow: !1,
                    name: "",
                    mobile: "",
                    sex: 1,
                    address: "",
                    map: ""
                }), app.util.request({
                    url: "entry/wxapp/user",
                    data: {
                        op: "address"
                    },
                    showLoading: !1,
                    success: function(a) {
                        var t = a.data;
                        "" != t.data && e.setData({
                            list: t.data
                        });
                    }
                }));
            }
        });
    },
    add_default: function(a) {
        var s = this, n = a.currentTarget.dataset.index;
        -1 == s.data.list[n].status && app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "add_default",
                id: s.data.list[n].id
            },
            success: function(a) {
                if ("" != a.data.data) {
                    for (var t = s.data.list, e = 0; e < t.length; e++) t[e].status = -1;
                    t[n].status = 1, s.setData({
                        list: t
                    });
                }
            }
        });
    },
    delete: function(a) {
        var e = this, s = a.currentTarget.dataset.index;
        wx.showModal({
            title: "删除",
            content: "确定删除吗？",
            success: function(a) {
                if (a.confirm) {
                    var t = e.data.list;
                    1 == t[s].status ? wx.showModal({
                        title: "错误",
                        content: "默认地址不能删除",
                        showCancel: !1,
                        confirmText: "我知道了",
                        confirmColor: e.data.theme.color,
                        success: function(a) {}
                    }) : app.util.request({
                        url: "entry/wxapp/user",
                        data: {
                            op: "add_del",
                            id: e.data.list[s].id
                        },
                        success: function(a) {
                            "" != a.data.data && (wx.showToast({
                                title: "删除成功",
                                icon: "success",
                                duration: 2e3
                            }), t.splice(s, 1), e.setData({
                                list: t
                            }));
                        }
                    });
                }
            }
        });
    },
    onLoad: function(a) {
        var e = this;
        common.config(e, app), common.theme(e), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "address"
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    list: t.data
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