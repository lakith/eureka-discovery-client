const axios = require('axios').default;
const logger = require('../config/logger/logger')
const eventEmitter = require('../config/events/events');

let serverList = []
let syncStatus = false
let serverRoundRobinIndexes = {}

const discoveryServer = async (eurekaServerData) => {
    eventEmitter.on('eureka-hartbeat-successfull', async () => {
        const eurekaHost = `${eurekaServerData.SSL ? 'https' : 'http'}://${eurekaServerData.EUREKA_HOST || 'localhost:8761'}/eureka/apps/`;
        try {
            let eurekaResponse = await axios.get(eurekaHost)
            syncStatus = true
            serverList = eurekaResponse.data && eurekaResponse.data.applications && eurekaResponse.data.applications.application
            let serverTypes = serverList.map(server => server.name)
            let keys = Object.keys(serverRoundRobinIndexes)

            if(keys.length < serverTypes.length) {
                serverList.forEach(server => {
                    let value = keys.includes(server.name)
                    if(!value) {
                        serverRoundRobinIndexes[server.name] = {currentIndex : 0}
                    }
                })
            } else if(keys.length > serverTypes.length) {
                /***************Add Logic For Server Removal***************/
            }

        } catch (error) {
            syncStatus = false
            logger.error(error)
        }
    })

    eventEmitter.on('eureka-hartbeat-fail', () => {
        syncStatus = false
    })
}

const getData = () => {
    return {
        serverList,
        syncStatus,
        serverRoundRobinIndexes
    }
}

module.exports = {
    discoveryServer,
    getData
};