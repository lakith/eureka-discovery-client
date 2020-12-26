const logger = require("../config/logger/logger");
const discovery = require('./discovery-server')

const retriveServiceAddress = (service) => {
    //.replaceAll('-', ' ').replaceAll('_', ' ').split(' ').join('')
    let serviceName = service
    let instanceData = discovery.getData();

    if(instanceData.syncStatus) {
        instanceData = instanceData.serverList.find(instance => {
            return instance.name === serviceName
        })
    }

    if(instanceData.instance.length) {
        if(discovery.getData().serverRoundRobinIndexes[serviceName].currentIndex < (instanceData.instance.length - 1)) {
            discovery.getData().serverRoundRobinIndexes[serviceName].currentIndex += 1
        } else if(discovery.getData().serverRoundRobinIndexes[serviceName].currentIndex === (instanceData.instance.length - 1)) {
            discovery.getData().serverRoundRobinIndexes[serviceName].currentIndex = 0
        }
    }

    let host = instanceData.instance[discovery.getData().serverRoundRobinIndexes[serviceName].currentIndex].hostName;
    
    /*******Add service calling logic here**********/
   return host
} 

module.exports = retriveServiceAddress