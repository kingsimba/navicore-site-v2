const PROXY_CONFIG = [
  {
      context: [
          "/api"
      ],
      target: "http://localhost:9080",
      secure: false
  }
]

module.exports = PROXY_CONFIG;
