const eurekaConnect = require('./services/eureka-connect')
const {discoveryServer, getData} = require('./services/discovery-server')

function connectEureka(eurekaServerData) {
  eurekaConnect(eurekaServerData)
}

function serviceDiscovery(eurekaServerData) {
  discoveryServer(eurekaServerData)
}

function getInstanceData() {
  return getData()
}

module.exports = {
  connectEureka,
  serviceDiscovery,
  getInstanceData
}