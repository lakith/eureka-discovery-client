const axios = require('axios').default;
const logger = require('../config/logger/logger')
const eventEmitter = require('../config/events/events')

let hartbeatInterval = 0

const connectEureka = async (eurekaServerData = null) => {

    const instanceID = `${eurekaServerData && eurekaServerData.HOST || 'localhost'}:${eurekaServerData && eurekaServerData.APP_NAME || 'userService'}:${eurekaServerData && eurekaServerData.PORT || 3000}`;
    const eurekaHost = `${eurekaServerData && eurekaServerData.SSL ? 'https' : 'http'}://${eurekaServerData && eurekaServerData.EUREKA_HOST || 'localhost:8761'}/eureka/apps/${eurekaServerData && eurekaServerData.APP_NAME || 'userService'}`;
    await eurekaRegister(instanceID, eurekaHost, eurekaServerData)
}

const eurekaRegister = async (instanceID, eurekaHost, eurekaServerData = null) => {
    const dataSet = {
        instance: {
            hostName: `${eurekaServerData && eurekaServerData.HOST || 'localhost'}:${ eurekaServerData && eurekaServerData.PORT || 3000}`,
            instanceId: instanceID,
            app: `${eurekaServerData && eurekaServerData.APP_NAME || 'userService'}`,
            vipAddress: `${eurekaServerData && eurekaServerData.VIP_ADDRESS}`,
            ipAddr: `${eurekaServerData && eurekaServerData.IP_ADDR || 'jq.test.userService.com'}`,
            status: `${eurekaServerData && eurekaServerData.STATUS || 'UP'}`,
            port: {
                '$': `${eurekaServerData && eurekaServerData.PORT || 3000}`,
                '@enabled': true
            },
            healthCheckUrl: `${eurekaServerData && eurekaServerData.SSL ? 'https' : 'http'}://${eurekaServerData && eurekaServerData.HOST || 'localhost'}:${eurekaServerData && eurekaServerData.PORT || 3000}/api/health/`,
            statusPageUrl: `${eurekaServerData && eurekaServerData.SSL ? 'https' : 'http'}://${eurekaServerData && eurekaServerData.HOST || 'localhost'}:${eurekaServerData && eurekaServerData.PORT || 3000}/api/status/`,
            homePageUrl: `${eurekaServerData && eurekaServerData.SSL ? 'https' : 'http'}://${eurekaServerData && eurekaServerData.HOST || 'localhost'}:${eurekaServerData && eurekaServerData.PORT || 3000}/api/`,
            dataCenterInfo: {
                '@class': `${eurekaServerData && eurekaServerData.DATA_CENTER_INFO_CLASS || 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo'}`,
                'name': `${eurekaServerData && eurekaServerData.DATA_CENTER_INFO_NAME || 'MyOwn'}`
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
            logger.info("Eureka HartBeat Success")
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