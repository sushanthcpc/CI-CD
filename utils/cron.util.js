// var cron = require('node-cron');
// const { queryFlag_Generator } = require('../utils/cdc.util')
// const { sendBFSD } = require('../controllers/new.controller');
// const eodStatus = false;

const moment = require('moment');


// const cdcQueries = () => {
//     const flagQuery = () => {
//         console.log('This executes first to check CDC flag status')
//     }

//     const setEodStaus = ()=> {
//         console.log('This runs second to set EOD')
//     }

//     const issueCDCQuery = () => {
//         console.log('This runs atlast') 
//     }

//     return{
//         flagQuery: flagQuery,
//         setEodStaus: setEodStaus,
//         issueCDCQuery: issueCDCQuery
//     }

// }

// // module.exports = cdcQueries();

// const job2RunEvery20Mins = cron.schedule("*/2 * * * *", async () => {
//     console.log(new Date().toLocaleString());
//     console.log('This is the Block First')
//     console.log(await cdcQueries.flagQuery())
//     console.log(await cdcQueries.setEodStaus())
//     console.log(await cdcQueries.issueCDCQuery())
//     //   sendBFSD()

//   });



// const getSysDate = () => {
//   let newDate = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })
//   console.log("date", newDate)
//   let dateString = new Date().toLocaleDateString()
//   var finaleString = moment(newDate).format('YYYY-MM-DD');
//   console.log(finaleString)
//   console.log('SYS DATE ==>', moment().format("YYYY-MM-DD HH:mm:ss"))
//   return formatedate
// }

// getSysDate()



// isLCHGValid("2023-05-18 03:07:02")

// isLCHGValid("2023-05-18 19:00:02")




/**Date Parts */
const splitDate = (dateIn, key) => {
  console.log("Incoming Param ==>", dateIn)
  const dateparts = dateIn.split(" ");
  const retResult = (key == 'datestamp' || 'undefined') ? dateparts[0] : dateparts[1]
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
  console.log(parseInt(l) - parseInt(s))
  const timeStatus = (Math.abs(parseInt(l) - parseInt(s)) >= 0 && Math.abs(parseInt(l) - parseInt(s)) < 1) ? true : false
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



checkDate('04:30:18')