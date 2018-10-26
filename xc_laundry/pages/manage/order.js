var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        pagePath: "../manage/order",
        page: 1,
        pagesize: 20,
        isbottom: !1,
        curr: 1,
        run_choose: -1
    },
    tab: function(t) {
        var e = this, a = t.currentTarget.dataset.index;
        a != e.data.curr && (e.setData({
            curr: a,
            list: [],
            page: 1,
            isbottom: !1
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "order",
                orders: e.data.curr,
                page: e.data.page,
                pagesize: e.data.pagesize,
                run: 1
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && "" != a.data.list && null != a.data.list ? e.setData({
                    list: a.data.list,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        }));
    },
    orders: function(t) {
        var a, e = this, s = t.currentTarget.dataset.index, n = e.data.list, o = t.currentTarget.dataset.orders;
        1 == o ? a = "接单" : 2 == o && (a = "送单"), wx.showModal({
            title: "提示",
            content: "确定" + a + "吗？",
            success: function(t) {
                t.confirm ? app.util.request({
                    url: "entry/wxapp/addorders",
                    data: {
                        id: n[s].id,
                        orders: o
                    },
                    success: function(t) {
                        "" != t.data.data && (wx.showToast({
                            title: a + "成功",
                            icon: "success",
                            duration: 2e3
                        }), n.splice(s, 1), e.setData({
                            list: n
                        }));
                    }
                }) : t.cancel && console.log("用户点击取消");
            }
        });
    },
    menu_on: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            menu: !0,
            shadow: !0,
            index: a
        });
    },
    menu_close: function() {
        this.setData({
            menu: !1,
            shadow: !1,
            btn1: !1,
            btn2: !1,
            btn3: !1,
            btn4: !1
        });
    },
    choose: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            run_choose: a
        });
    },
    menu_btn: function() {
        var a = this, t = a.data.run_choose;
        if (a.setData({
            menu: !1,
            shadow: !1
        }), -1 == t) wx.showModal({
            title: "错误",
            content: "请选择跑腿人",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        }); else {
            var e, s, n = a.data.list, o = a.data.index;
            null != n[o].get_openid && "" != n[o].get_openid || null != n[o].send_openid && "" != n[o].send_openid ? null == n[o].get_openid && "" == n[o].get_openid || null != n[o].send_openid && "" != n[o].send_openid || (e = 2, 
            s = "送单") : (e = 1, s = "接单");
            var i = {
                orders: e,
                openid: a.data.run_list[t].openid,
                id: n[o].id
            };
            wx.showModal({
                title: "提示",
                content: "确定" + s + "吗？",
                success: function(t) {
                    t.confirm ? app.util.request({
                        url: "entry/wxapp/addorders",
                        data: i,
                        success: function(t) {
                            "" != t.data.data && (wx.showToast({
                                title: s + "成功",
                                icon: "success",
                                duration: 2e3
                            }), n.splice(o, 1), a.setData({
                                list: n,
                                choose: -1
                            }));
                        }
                    }) : t.cancel && console.log("用户点击取消");
                }
            });
        }
    },
    call: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.list;
        wx.makePhoneCall({
            phoneNumber: e[a].userinfo.mobile
        });
    },
    map: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.list;
        wx.openLocation({
            latitude: e[a].userinfo.map.latitude,
            longitude: e[a].userinfo.map.longitude,
            name: e[a].userinfo.map.name,
            address: e[a].userinfo.map.address,
            scale: 28
        });
    },
    order_change: function(t) {
        var a = this, e = t.currentTarget.dataset.name, s = t.currentTarget.dataset.index, n = t.currentTarget.dataset.id, o = a.data.list;
        wx.showModal({
            title: "提示",
            content: "确定操作吗？",
            success: function(t) {
                t.confirm ? app.util.request({
                    url: "entry/wxapp/orderchange",
                    data: {
                        name: e,
                        index: s,
                        id: o[n].id
                    },
                    success: function(t) {
                        "" != t.data.data && (wx.showToast({
                            title: "成功",
                            icon: "success",
                            duration: 2e3
                        }), "get_status" == e && 1 == s && (o[n].get_status = 1), "send_status" == e && 1 == s && (o[n].send_status = 1, 
                        o[n].end = 1, o[n].order_status = "已完成"), a.setData({
                            list: o
                        }));
                    }
                }) : t.cancel && console.log("用户点击取消");
            }
        });
    },
    test: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            test: !0,
            shadow: !0,
            index: a
        });
    },
    test_close: function() {
        this.setData({
            test: !1,
            shadow: !1
        });
    },
    test_btn: function(t) {
        var a = this, e = t.currentTarget.dataset.index, s = a.data.index, n = a.data.list;
        1 == e ? -1 == n[s].service_status && a.setData({
            shadow: !0,
            btn2: !0,
            test: !1
        }) : 2 == e ? 1 == n[s].pay_type && (-1 == n[s].service_status ? wx.showModal({
            title: "错误",
            content: "请先检验确认",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        }) : null == n[s].amount || "" == n[s].amount ? a.setData({
            shadow: !0,
            btn3: !0,
            test: !1
        }) : wx.showModal({
            title: "错误",
            content: "已扣款",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        })) : 3 == e && 1 == n[s].service_status && (null == n[s].amount || "" == n[s].amount ? wx.showModal({
            title: "错误",
            content: "请先扣款",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        }) : a.setData({
            shadow: !0,
            btn4: !0,
            test: !1
        }));
    },
    test_change: function(t) {
        var a = this, e = t.currentTarget.dataset.status, s = a.data.index, n = a.data.list, o = t.currentTarget.dataset.name;
        a.setData({
            btn2: !1,
            btn3: !1,
            btn4: !1,
            shadow: !1
        }), app.util.request({
            url: "entry/wxapp/orderchange",
            data: {
                name: o,
                index: e,
                id: n[s].id
            },
            success: function(t) {
                "" != t.data.data && (wx.showToast({
                    title: "成功",
                    icon: "success",
                    duration: 2e3
                }), "service_status" == o && (2 == e ? n.splice(s, 1) : 1 == e ? (n[s].service_status = e, 
                n[s].orders = 3, n[s].order_status = "服务中") : 3 == e && n.splice(s, 1)), a.setData({
                    list: n
                }));
            }
        });
    },
    input: function(t) {
        this.setData({
            test_amount: t.detail.value
        });
    },
    chargeback: function() {
        var a = this, e = a.data.index, s = a.data.list, n = a.data.test_amount;
        "" != n && null != n ? app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "chargeback",
                id: s[e].id,
                amount: n
            },
            success: function(t) {
                "" != t.data.data && (wx.showToast({
                    title: "成功",
                    icon: "success",
                    duration: 2e3
                }), a.setData({
                    btn3: !1,
                    shadow: !1
                }), s[e].amount = n, a.setData({
                    list: s
                }));
            }
        }) : wx.showModal({
            title: "错误",
            content: "请输入金额",
            success: function(t) {
                t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(t) {
        var e = this;
        common.config(e), common.theme(e), common.admin_footer(e), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "order",
                orders: e.data.curr,
                page: e.data.page,
                pagesize: e.data.pagesize,
                run: 1
            },
            success: function(t) {
                var a = t.data;
                "" != a.data ? ("" != a.data.list && null != a.data.list ? e.setData({
                    list: a.data.list,
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                }), "" != a.data.run_list && null != a.data.run_list && e.setData({
                    run_list: a.data.run_list
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
            url: "entry/wxapp/manage",
            data: {
                op: "order",
                orders: e.data.curr,
                page: e.data.page,
                pagesize: e.data.pagesize,
                run: 1
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && "" != a.data.list && null != a.data.list ? e.setData({
                    list: e.data.list.concat(a.data.list),
                    page: e.data.page + 1
                }) : e.setData({
                    isbottom: !0
                });
            }
        });
    }
});