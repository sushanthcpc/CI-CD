const { Kafka } = require('kafkajs')
const avroSchemaRegistry = require('avro-schema-registry');
const moment = require('moment');
const { sendBFSD } = require('./new.controller');
const { BROKER_IP, SCHEMA_REGISTRY, KAFKA_KEYS } = require('../config/app.config');
const pool = require('pg')


/**Kafka Broker */
const kafka = new Kafka({
  clientId: KAFKA_KEYS.CLIENT_ID,
  brokers: [BROKER_IP.BROKER_1, BROKER_IP.BROKER_2, BROKER_IP.BROKER_3]
})

/**Shema Registry */
const schemaRegistry = SCHEMA_REGISTRY.REGISTRY_1

/**Kafka Consumer */
const consumer = kafka.consumer({ groupId: KAFKA_KEYS.CONSUMER_NAME })
// const consumer = kafka.consumer({ groupId: 'node-consumer' })

/**Run Consumer */
const run = async () => {
  console.log("Kafka Consumer Connected");
  /**Consumer Instantiation */
  await consumer.connect()
  await consumer.subscribe({ topic: KAFKA_KEYS.TOPIC_NAME, fromBeginning: true })
  // await consumer.subscribe({ topic: 'nodejs', fromBeginning: true })

  /**Schema Registry Instantiation */
  const registry = avroSchemaRegistry(schemaRegistry);



  //Original and working
  try {
    /**Consumer Run */
    await consumer.run({
      eachMessage: async ({ partition, message }) => {
        // console.log('Heartbeat ==>', await consumer.poll() )
        const { value } = message
        registry.decode(value)
          .then(async (msg) => {
            const { DC_RESTARTABILITY_FLG, DB_STAT_DATE, DC_STAT_CODE, LCHG_TIME } = msg.data
            const validSysTime = isLCHGValid(LCHG_TIME) //2023-05-24 00:40:37
            console.log("Check Valid ==>", validSysTime)
            const db_date = splitDate(DB_STAT_DATE, 'datestamp')
            console.log('DB_DATE:', db_date)
            const acceptedDate = await checkDate(DB_STAT_DATE)
            console.log(`${DC_RESTARTABILITY_FLG} == 'N' && ${acceptedDate} && ${DC_STAT_CODE} == 'Y' && ${validSysTime}`)
            if (DC_RESTARTABILITY_FLG == 'N' && acceptedDate && DC_STAT_CODE == 'Y' && validSysTime) {
              console.log(`Validation Keys DC_RESTARTABILITY_FLG Should be N is ${DC_RESTARTABILITY_FLG}, DB_STAT_DATE Should be Today's ${getSysDate()} is ${db_date}, DC_STAT_CODE Should be Y is ${DC_STAT_CODE} passed on ${getSysDate()}`)
              /**BFSD Method Call */
              console.log(`************************${partition}************************`)
              sendBFSD()

            } else {
              console.log(`Validation Keys DC_RESTARTABILITY_FLG Should be N is ${DC_RESTARTABILITY_FLG}, DB_STAT_DATE Should be Today's ${getSysDate()} is ${db_date}, DC_STAT_CODE Should be Y is ${DC_STAT_CODE} failed on ${getSysDate()}`)
            }
          })
          .catch(err => console.log(err))
      },
    })

  } catch (error) {
    console.log(`Consumer error: ${error}`)
  }


}
// run()
module.exports = run



const getCurrentDate = () => {
  const todayDate = new Date()
  const datee = todayDate.toISOString().split('T')[0]
  return datee
}

/**Date Parts */
const splitDate = (dateIn, key) => {
  const dateparts = dateIn.split(" ");
  const retResult = (key == 'datestamp' || key == undefined) ? dateparts[0] : dateparts[1]
  return retResult
}

/**Validate Current Date */
const checkDate = async (dat) => {
  // const currenDate = await getCurrentDate()
  const currenDate = await getSysDate()
  const partDate = await splitDate(dat)
  if (currenDate == partDate) {
    return true
  }
  else {
    console.log('Current Date is ', currenDate, '  ==> Part Date is', partDate)
    return false
  }
}

/**Compose Date Format */
const getSysDate = () => {
  let dateString = new Date().toLocaleDateString()
  var finaleString = moment(dateString).format('YYYY-MM-DD');
  console.log(finaleString)
  console.log('SYS DATE ==>', finaleString)
  return finaleString
}



const compareTime = (l, s) => {
  console.log(`lCHG CHECK${l}, SYS CHECK${s}`)
  console.log("Time Diff:", parseInt(l) - parseInt(s))
  // const timeStatus = (Math.abs(parseInt(l) - parseInt(s)) >= 0 && Math.abs(parseInt(l) - parseInt(s)) < 1) ? true : false
  const timeStatus = (Math.abs(parseInt(l)) >= 0 && Math.abs(parseInt(l)) < 9) ? true : false
  console.log('Compare Time Difference', timeStatus)
  return timeStatus
}

const getSysTime = () => {
  let sysTime = new Date().toLocaleTimeString('en-US', {
    hour12: false,
  })
  let partTime = sysTime.split(" ")[0]
  console.log('SYS Time ==>', partTime)
  return partTime
}


const isLCHGValid = (lchg) => {
  const lchgTime = splitDate(lchg, 'timeStamp')
  console.log("LCHG TIME ==>", lchgTime)
  const sysTimee = getSysTime()
  const fst = moment(sysTimee, "hh:mm:ss P").format("HH:mm:ss")
  console.log('Formated Sys Time ==>', fst)
  const validStatus = compareTime(lchgTime.split(":")[0], fst.split(":")[0])
  console.log("LCHG & SYS TIME VALIDITY ==>", validStatus)
  return validStatus
}


