const PROXY_CONFIG = [
  {
      context: [
          "/login",
          "/logout",
          "/list"
      ],
      target: "http://dal.navicore.cn:9080",
      secure: false
  }
]

module.exports = PROXY_CONFIG;
