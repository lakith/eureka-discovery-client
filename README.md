## A Simple Discovery client

### Inputs
```
SSL
EUREKA_HOST
PORT
APP_NAME
VIP_ADDRESS
IP_ADDR
STATUS - UP/DOWN/STARTING/OUT_OF_SERVICE/UNKNOWN
DATA_CENTER_INFO_CLASS - 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo'
DATA_CENTER_INFO_NAME - 'MyOwn'/'Amazon'
```

### Outputs
```
  connectEureka() - specify this in your root server config
  serviceDiscovery() - Use This for service discovery
  getInstanceData() - Use This go get registerd services from Eureka
  getInstanceForServiceCommunication(servicename) - Use This to get a load balanced instance address. 
```
### Features

- Register with Eureka
- Automatic Hartbeat Signals
- Automatic Eureka Reconnect
- Service Discovery
- Get Registed Instance Details
- RoundRobin Loadbalancer