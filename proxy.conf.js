const PROXY_CONFIG = [
  {
      context: [
          "/api"
      ],
      target: "http://dal.navicore.cn:9080",
      secure: false
  }
]

module.exports = PROXY_CONFIG;
