var app = getApp();

function config(e) {
  var t, a = [{
      pagePath: "../index/index",
      text: "主页",
      iconPath: "../../resource/footer01.png",
      selectedIconPath: "../../resource/footer001.png"
    }, {
      pagePath: "../order/order",
      text: "订单",
      iconPath: "../../resource/footer02.png",
      selectedIconPath: "../../resource/footer002.png"
    }, {
      pagePath: "../user/user",
      text: "我的",
      iconPath: "../../resource/footer03.png",
      selectedIconPath: "../../resource/footer003.png"
    }, {
      pagePath: "../manage/manage",
      text: "管理中心",
      iconPath: "../../resource/footer04.png",
      selectedIconPath: "../../resource/footer004.png"
    }],
    n = -1,
    o = -1;
  if ("" != app.config && null != app.config) {
    wx.setNavigationBarTitle({
      title: app.config.content.title
    });
    var r = app.config.content;
    if ("" != r.footer && null != r.footer)
      for (var c = 0; c < r.footer.length; c++) "" != r.footer[c].text && null != r.footer[c].text && (a[c].text = r.footer[c].text),
        "" != r.footer[c].icon && null != r.footer[c].icon && (a[c].iconPath = r.footer[c].icon),
        "" != r.footer[c].select && null != r.footer[c].select && (a[c].selectedIconPath = r.footer[c].select),
        "" != r.footer[c].link && null != r.footer[c].link && (a[c].pagePath = r.footer[c].link);
    "" != r.map_status && null != r.map_status && (n = r.map_status), "" != r.times && null != r.times && (o = r.times);
  }
  for (c = 0; c < a.length; c++) a[c].pagePath == e.data.pagePath && (t = c);
  var s = app.userinfo;
  "" != s && null != s ? 4 == s.level ? a.splice(3, 1) : 1 == s.level ? a[3].pagePath = "../manage/manage" : 2 == s.level ? a[3].pagePath = "../run/run" : 3 == s.level && (a[3].pagePath = "../test/test") : a.splice(3, 1),
    app.map_status = n, app.config_times = o, e.updateUserInfo = updateUserInfo, is_user(e),
    e.user_close = user_close, e.setData({
      config: app.config,
      footer: a,
      footerCurr: t,
      userinfo: app.userinfo
    });
}

function theme(e) {
  var t = {
    name: "theme1",
    color: "#12b8f6",
    icon: ["../../resource/icon01.png", "../../resource/icon13.png", "../../resource/icon12.png", "../../resource/footer03.png", "../../resource/icon06.png", "../../resource/icon14.png", "../../resource/icon08.png", "../../resource/nav01.png", "../../resource/nav02.png", "../../resource/nav03.png", "../../resource/nav04.png", "../../resource/icon02.png", "../../resource/icon07.png", "../../resource/icon03.png", "../../resource/icon04.png", "../../resource/icon05.png", "../../resource/ch01.png", "../../resource/ch02.png", "../../resource/ch03.png", "../../resource/ch04.png", "../../resource/ch05.png", "../../resource/icon09.png", "../../resource/icon10.png", "../../resource/icon20.png", "../../resource/icon17.png", "../../resource/icon18.png", "../../resource/ch06.png"]
  };
  if ("" != app.theme && null != app.theme) {
    var a = app.theme.content;
    if (2 == a.theme && (t.name = "theme" + a.theme, t.color = a.color, "" != a.icon && null != a.icon))
      for (var n = 0; n < a.icon.length; n++) "" != a.icon[n] && null != a.icon[n] && (t.icon[n] = a.icon[n]);
  }
  wx.setNavigationBarColor({
    frontColor: "#ffffff",
    backgroundColor: t.color,
    animation: {
      duration: 400,
      timingFunc: "easeIn"
    }
  }), e.setData({
    theme: t
  });
}

function index(a) {
  app.util.request({
    url: "entry/wxapp/index",
    showLoading: !1,
    data: {
      op: "index"
    },
    success: function(e) {
      var t = e.data;
      "" != t.data && ("" != t.data.banner && null != t.data.banner && a.setData({
        banner: t.data.banner
      }), "" != t.data.announcement && null != t.data.announcement && a.setData({
        announcement: t.data.announcement
      }), "" != t.data.coupon && null != t.data.coupon && a.setData({
        coupon: t.data.coupon
      }), "" != t.data.class && null != t.data.class && a.setData({
        class: t.data.class
      }), "" != t.data.card && null != t.data.card && a.setData({
        card: t.data.card
      }), "" != t.data.address && null != t.data.address && a.setData({
        name: t.data.address.name,
        mobile: t.data.address.mobile,
        address: t.data.address.address,
        map: t.data.address.map
      }), "" != t.data.distance && null != t.data.distance && a.setData({
        distance: t.data.distance
      }), "" != t.data.area && null != t.data.area && a.setData({
        area: t.data.area
      }));
    }
  });
}

function admin_footer(e) {
  for (var t, a = [{
      pagePath: "../index/index",
      text: "主页",
      iconPath: "../../resource/footer01.png",
      selectedIconPath: "../../resource/footer001.png"
    }, {
      pagePath: "../manage/order",
      text: "待接单",
      iconPath: "../../resource/admin01.png",
      selectedIconPath: "../../resource/admin001.png"
    }, {
      pagePath: "../manage/order_on",
      text: "已接单",
      iconPath: "../../resource/admin02.png",
      selectedIconPath: "../../resource/admin002.png"
    }, {
      pagePath: "../manage/manage",
      text: "管理中心",
      iconPath: "../../resource/footer04.png",
      selectedIconPath: "../../resource/footer004.png"
    }], n = 0; n < a.length; n++) a[n].pagePath == e.data.pagePath && (t = n);
  e.setData({
    admin_footerCurr: t,
    admin_footer: a
  });
}

function run(e) {
  var t, a = [{
      pagePath: "../index/index",
      text: "主页",
      iconPath: "../../resource/footer01.png",
      selectedIconPath: "../../resource/footer001.png"
    }, {
      pagePath: "../run/order",
      text: "待接单",
      iconPath: "../../resource/admin01.png",
      selectedIconPath: "../../resource/admin001.png"
    }, {
      pagePath: "../run/order_on",
      text: "已接单",
      iconPath: "../../resource/admin02.png",
      selectedIconPath: "../../resource/admin002.png"
    }, {
      pagePath: "../run/run",
      text: "管理中心",
      iconPath: "../../resource/footer04.png",
      selectedIconPath: "../../resource/footer004.png"
    }],
    n = 1,
    o = app.shop;
  "" != o && null != o && "" != o.content.type && null != o.content.type && (n = o.content.type),
    1 == n && a.splice(1, 1);
  for (var r = 0; r < a.length; r++) a[r].pagePath == e.data.pagePath && (t = r);
  e.setData({
    admin_footerCurr: t,
    admin_footer: a
  });
}

function test(e) {
  for (var t, a = [{
      pagePath: "../index/index",
      text: "主页",
      iconPath: "../../resource/footer01.png",
      selectedIconPath: "../../resource/footer001.png"
    }, {
      pagePath: "../test/test",
      text: "管理中心",
      iconPath: "../../resource/footer04.png",
      selectedIconPath: "../../resource/footer004.png"
    }], n = 0; n < a.length; n++) a[n].pagePath == e.data.pagePath && (t = n);
  e.setData({
    admin_footerCurr: t,
    admin_footer: a
  });
}

function login(e, t) {
  app.util.getUserInfo(function(e) {
    var t = {};
    "" != e.wxInfo && null != e.wxInfo ? (t = e.wxInfo).op = "userinfo" : t.op = "userinfo",
      app.util.request({
        url: "entry/wxapp/index",
        showLoading: !1,
        data: t,
        success: function(e) {
          var t = e.data;
          "" != t.data && (app.userinfo = t.data);
        }
      });
  });
}

function updateUserInfo(e) {
  var a = getApp();
  "" != e.detail.userInfo && null != e.detail.userInfo && a.util.getUserInfo(function(e) {
    var t = {};
    "" != e.wxInfo && null != e.wxInfo ? (t = e.wxInfo).op = "userinfo" : t.op = "userinfo",
      a.util.request({
        url: "entry/wxapp/index",
        showLoading: !1,
        data: t,
        success: function(e) {
          var t = e.data;
          "" != t.data && (a.userinfo = t.data);
        }
      });
  }, e.detail);
}

function is_user(e) {
  var t = wx.getStorageSync("userInfo") || {};
  "" != t.wxInfo && null != t.wxInfo || e.setData({
    shadow: !0,
    get_userinfo: !0
  });
}

function user_close() {
  this.setData({
    shadow: !1,
    get_userinfo: !1,
    menu: !1,
    menu1: !1
  });
}

module.exports = {
  config: config,
  index: index,
  theme: theme,
  admin_footer: admin_footer,
  run: run,
  test: test,
  login: login,
  updateUserInfo: updateUserInfo,
  is_user: is_user,
  user_close: user_close
};