const eurekaConnect = require('./services/eureka-connect')
const {discoveryServer, getData} = require('./services/discovery-server')
const retriveServiceAddress = require('./services/retriveInstanceAddress')

function connectEureka(eurekaServerData) {
  eurekaConnect(eurekaServerData)
}

function serviceDiscovery(eurekaServerData) {
  discoveryServer(eurekaServerData)
}

function getInstanceData() {
  return getData()
}

function getInstanceForServiceCommunication(serviceName) {
  return retriveServiceAddress(serviceName)
}

module.exports = {
  connectEureka,
  serviceDiscovery,
  getInstanceData,
  getInstanceForServiceCommunication
}