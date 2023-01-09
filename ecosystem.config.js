module.exports = {
  apps : [
      {
          name   : "node-proxy",
          script : "./index.js",
          env_dev: {
              NODE_ENV: "dev"
          },
      },
      {
          name   : "node-proxy-bsi",
          script : "./index.js",
          env_development: {
              NODE_ENV: "bsi-dev"
          },
      },
      {
          name   : "node-proxy-bni",
          script : "./index.js",
          env_development: {
              NODE_ENV: "bni-dev"
          },
      },
  ]
}
