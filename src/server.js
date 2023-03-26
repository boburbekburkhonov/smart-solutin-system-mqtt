import htpp from 'http'
import mqtt from 'mqtt'
import mongo from './utils/mongo.js'
import dataModel from './model/data.model.js'
import infoModel from './model/info.model.js'

mongo()
  .then(() => 'Connected')
  .catch(err => console.log(err))

const topicData = 'W/+/+/+/data'
const topicInfo = 'W/+/+/+/info'


const options = {
  clean: true,
  connectTimeout: 4000,
  host: '185.196.214.190',
  port: 1883,
  username: 'emqx',
  password: '12345',
}

// !CLIENT
const client = mqtt.connect(options)

// !DATA ----------------------------------------------------------------
// client.on('connect', () => {
//   client.subscribe(topicData)
//   console.log('Connected');
// })

// client.on('error', (error) => {
//   console.log(err);
// })

// client.on('message', async(topicData, message) => {
//   const data = JSON.parse(message.toString())
//   const timeData = new Date(`${Number(data.t.split('/')[0]) + 2000}-${data.t.split('/')[1]}-${data.t.split('/')[2].
//   slice(0, 2)} ${data.t.split('/')[2].slice(3, 14)}`).toLocaleString({timeZone: "Asia/Tashkent"})
//   let dataName;

//   try{
//     const foundDataName = await infoModel.findOne({imei: data.i})
//     dataName = foundDataName.device_name
//   }catch(err){
//     console.log(err)
//   }

//   const foundData = await dataModel.findOne({imei: data.i})
//   .catch(err => console.log(err))

//   if(foundData){
//     await dataModel.findOneAndUpdate({imei: data.i}, {imei: data.i, time: timeData, data_name: dataName, distance: data.d, volume: data.v, correction: data.c})
//   .catch(err => console.log(err))
//   }else {
//     const newData = new dataModel({imei: data.i, time: timeData, data_name: dataName, distance: data.d, volume: data.v, correction: data.c})
//     await newData.save()
//   .catch(err => console.log(err))
//   }

// })

// !INFO ----------------------------------------------------------------------

// client.on('connect', () => {
//   client.subscribe(topicInfo)
//   console.log('Connected');
// })

// client.on('error', (error) => {
//   console.log(error);
// })

// client.on('message', async(topicInfo, message) => {
//   let data;
//    try {
//    data  = JSON.parse(message)
//   } catch(e) {
//     data = message
//   }
//   const foundInfo = await infoModel.findOne({ imei: data.i })
//   .catch(err => console.log(err))

//   console.log(foundInfo);

//   if(foundInfo){
//     await infoModel.findOneAndUpdate({ imei: data.i }, {
//       imei: data.i, time: data.t, region: data.p1, balance_organization: data.p2, device_name: data.p3, simCard_id: data.p4, phone_number_of_the_responsible_employee: data.p5, location: data.p6, degree: data.p7, battery_power: data.p8, signal: data.p9, firmware_type: data.p10, plate_version: data.p11, p12: data.p12, time_to_send_datarmation: data.p13, p14: data.p14, file_sending_interval: data.p15, plate_id: data.p16, sensor_type: data.p17
//     })
//   .catch(err => console.log(err))

//   }else {
//     const newInfo = new infoModel({
//       imei: data.i, time: data.t, region: data.p1, balance_organization: data.p2, device_name: data.p3, simCard_id: data.p4, phone_number_of_the_responsible_employee: data.p5, location: data.p6, degree: data.p7, battery_power: data.p8, signal: data.p9, firmware_type: data.p10, plate_version: data.p11, p12: data.p12, time_to_send_datarmation: data.p13, p14: data.p14, file_sending_interval: data.p15, plate_id: data.p16, sensor_type: data.p17
//     })

//     await newInfo.save()
//   .catch(err => console.log(err))

//   }
// })

// !SERVER ---------------------------------------------------------------
// htpp.createServer(async(request, response) => {
//   if(request.method == 'GET'){
//     const url = request.url.split('/')[1]
//     const urlSecond = request.url.split('/')[2]

//     // DATALIST ----------------------------------------------------
//     if(url == 'data' && urlSecond == 'list'){
//       const timeNow = new Date().toLocaleString({timeZone: "Asia/Tashkent"})
//       const data = await dataModel.find()
//       let present_day = 0;
//       let dataYear = 0;
//       let dataTenDay = 0;
//       let dataFiveDay = 0;
//       let dataThreeDay = 0;

//       console.log(new Date().getMonth(), new Date().getDate());

//       data.forEach(e => {
//         const timeData = new Date(e.time).toLocaleString({timeZone: "Asia/Tashkent"})

//         if(timeData.split('/')[2].slice(0, 4) == timeNow.split('/')[2].slice(0,4) && timeData.split('/')[0] == timeNow.split('/')[0]) {
//           if(timeNow.split('/')[1] - timeData.split('/')[1] == 0){
//             present_day++
//           }else if(timeNow.split('/')[1] - timeData.split('/')[1] <= 3 && timeNow.split('/')[1] - timeData.split('/')[1] != 0){
//             dataThreeDay++
//           }else if(timeNow.split('/')[1] - timeData.split('/')[1] <= 5 && timeNow.split('/')[1] - timeData.split('/')[1] > 3){
//             dataFiveDay++
//           }else if(timeNow.split('/')[1] - timeData.split('/')[1] <= 10 && timeNow.split('/')[1] - timeData.split('/')[1] > 5){
//             dataTenDay++
//           }else {
//             dataYear++
//           }
//         }else {
//           dataYear++
//         }
//       })

//       response.end(JSON.stringify({
//         presentDay: present_day,
//         dataThreeDay: dataThreeDay,
//         dataFiveDay: dataFiveDay,
//         dataTenDay: dataTenDay,
//         dataYear: dataYear
//       }))
//     }

//     // PRESENT DAYS OF DATA
//     if(url == 'data' && urlSecond == 'present'){
//       const timeNow = new Date().toLocaleString({timeZone: "Asia/Tashkent"})
//       const data = await dataModel.find()
//       let dataPresentDay = []

//       data.forEach(e => {
//         const timeData = new Date(e.time).toLocaleString({timeZone: "Asia/Tashkent"})

//         if(timeData.split('/')[2].slice(0, 4) == timeNow.split('/')[2].slice(0,4) && timeData.split('/')[0] == timeNow.split('/')[0]) {
//           if(timeNow.split('/')[1] - timeData.split('/')[1] == 0){
//             dataPresentDay.push(e)
//           }
//         }
//       })

//       response.end(JSON.stringify({
//         dataPresentDay: dataPresentDay,
//       }))
//     }

//     // THREE DAYS OF DATA
//     if(url == 'data' && urlSecond == 'three'){
//       const timeNow = new Date().toLocaleString({timeZone: "Asia/Tashkent"})
//       const data = await dataModel.find()
//       let dataThreeDay = []

//       data.forEach(e => {
//         const timeData = new Date(e.time).toLocaleString({timeZone: "Asia/Tashkent"})

//         if(timeData.split('/')[2].slice(0, 4) == timeNow.split('/')[2].slice(0,4) && timeData.split('/')[0] == timeNow.split('/')[0]) {
//           if(timeNow.split('/')[1] - timeData.split('/')[1] <= 3 && timeNow.split('/')[1] - timeData.split('/')[1] != 0){
//             dataThreeDay.push(e)
//           }
//         }
//       })

//       response.end(JSON.stringify({
//         dataThreeDay: dataThreeDay,
//       }))
//     }

//     // FIVE DAYS OF DATA
//     if(url == 'data' && urlSecond == 'five'){
//       const timeNow = new Date().toLocaleString({timeZone: "Asia/Tashkent"})
//       const data = await dataModel.find()
//       let dataFiveDay = []
//       data.forEach(e => {
//         const timeData = new Date(e.time).toLocaleString({timeZone: "Asia/Tashkent"})

//         if(timeData.split('/')[2].slice(0, 4) == timeNow.split('/')[2].slice(0,4) && timeData.split('/')[0] == timeNow.split('/')[0]) {
//           if(timeNow.split('/')[1] - timeData.split('/')[1] <= 5 && timeNow.split('/')[1] - timeData.split('/')[1] > 3){
//             dataFiveDay.push(e)
//           }
//         }
//       })

//       response.end(JSON.stringify({
//         dataFiveDay: dataFiveDay,
//       }))
//     }

//     // TEN DAYS OF DATA
//     if(url == 'data' && urlSecond == 'ten'){
//       const timeNow = new Date().toLocaleString({timeZone: "Asia/Tashkent"})
//       const data = await dataModel.find()
//       let dataTenDay = []

//       data.forEach(e => {
//         const timeData = new Date(e.time).toLocaleString({timeZone: "Asia/Tashkent"})

//         if(timeData.split('/')[2].slice(0, 4) == timeNow.split('/')[2].slice(0,4) && timeData.split('/')[0] == timeNow.split('/')[0]) {
//           if(timeNow.split('/')[1] - timeData.split('/')[1] <= 10 && timeNow.split('/')[1] - timeData.split('/')[1] > 5){
//             dataTenDay.push(e)
//           }
//         }
//       })

//       response.end(JSON.stringify({
//         dataTenDay: dataTenDay,
//       }))
//     }
//   }
// })
// .listen(9090, console.log(9090))



// // ! SERVER --------------------------------------------------------
// htpp.createServer(async(request, response) => {
//   if(request.method == 'GET'){
//     const url = request.url.split('/')[1]
//     const urlSecond = request.url.split('/')[2]
//     const yearNow = new Date().getFullYear()
//     const monthNow = new Date().getMonth() + 1
//     const dayNow = new Date().getDate()

//     // DATALIST ----------------------------------------------------
//     if(url == 'data' && urlSecond == 'list'){
//       const data = await dataModel.find({
//         time: {
//           $gte: '2021-09-25T08:49:40.000+00:00',
//           $lt:  new Date(),
//         }
//       })
//       console.log(new Date(), data);
//       // let present_day = 0;
//       // let dataYear = 0;
//       // let dataTenDay = 0;
//       // let dataFiveDay = 0;
//       // let dataThreeDay = 0;

//       // data.forEach(e => {
//       //   const yearData = e.time.getFullYear()
//       //   const monthData = e.time.getMonth() + 1
//       //   const dayData = e.time.getDate()

//       //   if(yearData == yearNow && monthData == monthNow){
//       //     if(dayNow - dayData == 0){
//       //       present_day++
//       //     }else if(dayNow - dayData <= 3 && dayNow - dayData != 0){
//       //       dataThreeDay++
//       //     }else if(dayNow - dayData <= 5 && dayNow - dayData > 3){
//       //       dataFiveDay++
//       //     }else if(dayNow - dayData <= 10 && dayNow - dayData > 5){
//       //       dataTenDay++
//       //     }else {
//       //       dataYear++
//       //     }
//       //   }else {
//       //     dataYear++
//       //   }
//       // })

//       // response.end(JSON.stringify({
//       //   presentDay: present_day,
//       //   dataThreeDay: dataThreeDay,
//       //   dataFiveDay: dataFiveDay,
//       //   dataTenDay: dataTenDay,
//       //   dataYear: dataYear
//       // }))
//     }

//     // PRESENT DAYS OF DATA
//     if(url == 'data' && urlSecond == 'present'){
//       const data = await dataModel.find()
//       let dataPresentDay = []

//       data.forEach(e => {
//         const yearData = e.time.getFullYear()
//         const monthData = e.time.getMonth() + 1
//         const dayData = e.time.getDate()

//         if(yearData == yearNow && monthData == monthNow){
//           if(dayNow - dayData == 0){
//             dataPresentDay.push(e)
//           }
//         }
//       })

//       response.end(JSON.stringify({
//         dataPresentDay: dataPresentDay,
//       }))
//     }

//     // THREE DAYS OF DATA
//     if(url == 'data' && urlSecond == 'three'){
//       const data = await dataModel.find()
//       let dataThreeDay = []

//       data.forEach(e => {
//         const yearData = e.time.getFullYear()
//         const monthData = e.time.getMonth() + 1
//         const dayData = e.time.getDate()

//         if(yearData == yearNow && monthData == monthNow){
//           if(dayNow - dayData != 0 && dayNow - dayData <= 3){
//             dataThreeDay.push(e)
//           }
//         }
//       })

//       response.end(JSON.stringify({
//         dataThreeDay: dataThreeDay,
//       }))
//     }

//     // FIVE DAYS OF DATA
//     if(url == 'data' && urlSecond == 'five'){
//       const data = await dataModel.find()
//       let dataFiveDay = []
//       data.forEach(e => {
//         const yearData = e.time.getFullYear()
//         const monthData = e.time.getMonth() + 1
//         const dayData = e.time.getDate()

//         if(yearData == yearNow && monthData == monthNow){
//           if(dayNow - dayData <= 5 && dayNow - dayData > 3){
//             dataFiveDay.push(e)
//           }
//         }
//       })

//       response.end(JSON.stringify({
//         dataFiveDay: dataFiveDay,
//       }))
//     }

//     // TEN DAYS OF DATA
//     if(url == 'data' && urlSecond == 'ten'){
//       const data = await dataModel.find()
//       let dataTenDay = []

//       data.forEach(e => {
//         const yearData = e.time.getFullYear()
//         const monthData = e.time.getMonth() + 1
//         const dayData = e.time.getDate()

//         if(yearData == yearNow && monthData == monthNow){
//           if(dayNow - dayData <= 10 && dayNow - dayData > 5){
//             dataTenDay.push(e)
//           }
//         }
//       })

//       response.end(JSON.stringify({
//         dataTenDay: dataTenDay,
//       }))
//     }

//     // ANNUAL DATA DAYS OF DATA
//     if(url == 'data' && urlSecond == 'year'){
//       const data = await dataModel.find()
//       let dataAnnualDay = []

//       data.forEach(e => {
//         const yearData = e.time.getFullYear()
//         const monthData = e.time.getMonth() + 1
//         const dayData = e.time.getDate()

//         if(yearData == yearNow && monthData == monthNow){
//           if(dayNow - dayData > 10){
//             dataAnnualDay.push(e)
//           }
//         }else {
//           dataAnnualDay.push(e)
//         }
//       })

//       response.end(JSON.stringify({
//         dataAnnualDay: dataAnnualDay,
//       }))
//     }
//   }
// })
// .listen(9090, console.log(9090))

// ! SERVER --------------------------------------------------------
htpp.createServer(async(request, response) => {
  if(request.method == 'GET'){
    const url = request.url.split('/')[1]
    const urlSecond = request.url.split('/')[2]
    const yearNow = new Date().getFullYear()
    const monthNow = new Date().getMonth() + 1
    const dayNow = new Date().getDate()

    // DATALIST ----------------------------------------------------
    if(url == 'data' && urlSecond == 'list'){
      const dataPresent = await dataModel.find({
        time: {
          $gte: '2023-03-24T08:00:00.000+00:00',
          $lt:  new Date(),
        }
      })

      const dataThreeDay = await dataModel.find({
        time: {
          $gte: '2023-03-21T08:00:00.000+00:00',
          $lt:  new Date(),
        }
      })

      const dataFiveDay = await dataModel.find({
        time: {
          $gte: '2023-03-19T08:00:00.000+00:00',
          $lt:  new Date(),
        }
      })

      const dataTenDay = await dataModel.find({
        time: {
          $gte: '2023-03-14T08:00:00.000+00:00',
          $lt:  new Date(),
        }
      })

      const dataYear = await dataModel.find({
        time: {
          $gte: '2020-03-14T08:00:00.000+00:00',
          $lt:  '2022-03-14T08:00:00.000+00:00',
        }
      })

      response.end(JSON.stringify({
        presentDay: dataPresent.length,
        dataThreeDay: dataThreeDay.length,
        dataFiveDay: dataFiveDay.length,
        dataTenDay: dataTenDay.length,
        dataYear: dataYear.length
      }))
    }

    // PRESENT DAYS OF DATA
    if(url == 'data' && urlSecond == 'present'){
      const data = await dataModel.find()
      let dataPresentDay = []

      data.forEach(e => {
        const yearData = e.time.getFullYear()
        const monthData = e.time.getMonth() + 1
        const dayData = e.time.getDate()

        if(yearData == yearNow && monthData == monthNow){
          if(dayNow - dayData == 0){
            dataPresentDay.push(e)
          }
        }
      })

      response.end(JSON.stringify({
        dataPresentDay: dataPresentDay,
      }))
    }

    // THREE DAYS OF DATA
    if(url == 'data' && urlSecond == 'three'){
      const data = await dataModel.find()
      let dataThreeDay = []

      data.forEach(e => {
        const yearData = e.time.getFullYear()
        const monthData = e.time.getMonth() + 1
        const dayData = e.time.getDate()

        if(yearData == yearNow && monthData == monthNow){
          if(dayNow - dayData != 0 && dayNow - dayData <= 3){
            dataThreeDay.push(e)
          }
        }
      })

      response.end(JSON.stringify({
        dataThreeDay: dataThreeDay,
      }))
    }

    // FIVE DAYS OF DATA
    if(url == 'data' && urlSecond == 'five'){
      const data = await dataModel.find()
      let dataFiveDay = []
      data.forEach(e => {
        const yearData = e.time.getFullYear()
        const monthData = e.time.getMonth() + 1
        const dayData = e.time.getDate()

        if(yearData == yearNow && monthData == monthNow){
          if(dayNow - dayData <= 5 && dayNow - dayData > 3){
            dataFiveDay.push(e)
          }
        }
      })

      response.end(JSON.stringify({
        dataFiveDay: dataFiveDay,
      }))
    }

    // TEN DAYS OF DATA
    if(url == 'data' && urlSecond == 'ten'){
      const data = await dataModel.find()
      let dataTenDay = []

      data.forEach(e => {
        const yearData = e.time.getFullYear()
        const monthData = e.time.getMonth() + 1
        const dayData = e.time.getDate()

        if(yearData == yearNow && monthData == monthNow){
          if(dayNow - dayData <= 10 && dayNow - dayData > 5){
            dataTenDay.push(e)
          }
        }
      })

      response.end(JSON.stringify({
        dataTenDay: dataTenDay,
      }))
    }

    // ANNUAL DATA DAYS OF DATA
    if(url == 'data' && urlSecond == 'year'){
      const data = await dataModel.find()
      let dataAnnualDay = []

      data.forEach(e => {
        const yearData = e.time.getFullYear()
        const monthData = e.time.getMonth() + 1
        const dayData = e.time.getDate()

        if(yearData == yearNow && monthData == monthNow){
          if(dayNow - dayData > 10){
            dataAnnualDay.push(e)
          }
        }else {
          dataAnnualDay.push(e)
        }
      })

      response.end(JSON.stringify({
        dataAnnualDay: dataAnnualDay,
      }))
    }
  }
})
.listen(9090, console.log(9090))