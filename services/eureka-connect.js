const axios = require('axios').default;
const logger = require('../config/logger/logger')
const eventEmitter = require('../config/events/events')

let hartbeatInterval = 0

const connectEureka = async (eurekaServerData) => {
    const instanceID = `${eurekaServerData.HOST || 'localhost'}:${eurekaServerData.APP_NAME || 'userService'}:${eurekaServerData.PORT || 3000}`
    const eurekaHost = `${eurekaServerData.SSL ? 'https' : 'http'}://${eurekaServerData.EUREKA_HOST || 'localhost:8761'}/eureka/apps/${eurekaServerData.APP_NAME || 'userService'}`;
    await eurekaRegister(instanceID, eurekaHost, eurekaServerData)
}

const eurekaRegister = async (instanceID, eurekaHost, eurekaServerData) => {
    const dataSet = {
        instance: {
            hostName: `${eurekaServerData.HOST || 'localhost'}:${eurekaServerData.PORT || 3000}`,
            instanceId: instanceID,
            app: `${eurekaServerData.APP_NAME || 'userService'}`,
            vipAddress: `${eurekaServerData.VIP_ADDRESS}`,
            ipAddr: `${eurekaServerData.IP_ADDR || 'jq.test.userService.com'}`,
            status: `${eurekaServerData.STATUS || 'UP'}`,
            port: {
                '$': `${eurekaServerData.PORT || 3000}`,
                '@enabled': true
            },
            healthCheckUrl: `${eurekaServerData.SSL ? 'https' : 'http'}://${eurekaServerData.HOST || 'localhost'}:${eurekaServerData.PORT || 3000}/api/health/`,
            statusPageUrl: `${eurekaServerData.SSL ? 'https' : 'http'}://${eurekaServerData.HOST || 'localhost'}:${eurekaServerData.PORT || 3000}/api/status/`,
            homePageUrl: `${eurekaServerData.SSL ? 'https' : 'http'}://${eurekaServerData.HOST || 'localhost'}:${eurekaServerData.PORT || 3000}/api/`,
            dataCenterInfo: {
                '@class': `${eurekaServerData.DATA_CENTER_INFO_CLASS || 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo'}`,
                'name': `${eurekaServerData.DATA_CENTER_INFO_NAME || 'MyOwn'}`
            }
        }
    };

    try {
        const data = await axios.post(eurekaHost, dataSet)
        logger.info(data.status);
        eventEmitter.emit('eureka-connection-successfull');
        eurekaHartBeat(eurekaHost, instanceID)
    } catch (error) {
        eventEmitter.emit('eureka-connection-fail');
        logger.error(error);
    }
}

const eurekaHartBeat = async (eurekaHost, instanceID) => {

    if (hartbeatInterval !== 0) {
        clearHartBeat()
    }
    hartbeatInterval = setInterval(async () => {
        try {
            await axios.put(`${eurekaHost}/${instanceID}`)
            eventEmitter.emit('eureka-hartbeat-successfull');
            // logger.info("Eureka HartBeat Success")
        } catch (error) {
            logger.error(error);
            eventEmitter.emit('eureka-hartbeat-fail');
            clearHartBeat(eurekaHost, instanceID)
            eurekaReconnect(eurekaHost, instanceID)
        }
    }, 5000)
}

const eurekaReconnect = async (eurekaHost, instanceID) => {

    hartbeatInterval = setInterval(async () => {
        logger.info("Eureka Reconnect")
        await eurekaRegister(instanceID, eurekaHost)
    }, 5000)
}

const clearHartBeat = (() => {
    clearInterval(hartbeatInterval)
    hartbeatInterval = 0
})


module.exports = connectEureka;