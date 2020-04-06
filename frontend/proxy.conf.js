const PROXY_CONFIG = [
  {
      context: [
          "/api"
      ],
      target: "http://navicore.mapbar.com:9080",
      secure: false
  }
]

module.exports = PROXY_CONFIG;
