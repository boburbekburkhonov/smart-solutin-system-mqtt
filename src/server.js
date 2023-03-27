import htpp from 'http'
import mqtt from 'mqtt'
import mongo from './utils/mongo.js'
import dataModel from './model/data.model.js'
import infoModel from './model/info.model.js'

mongo()
  .then(() => console.log("Connect"))
  .catch((err) => console.log(err));

const topicData = "W/+/+/+/data";
const topicInfo = "W/+/+/+/info";

const options = {
  clean: true,

  connectTimeout: 4000,
  host: "185.196.214.190",
  port: 1883,
  username: "emqx",
  password: "12345",
};

// !CLIENT
const client = mqtt.connect(options);

// !DATA ----------------------------------------------------------------
client.on("connect", () => {
  client.subscribe(topicData);
  console.log("Connected");
});

client.on("error", (error) => {
  console.log("Error" + err);
});

client.on("message", async (topicData, message) => {
  const data = JSON.parse(message.toString());

  console.log(data);

  const timeData = new Date(
    `${Number(data.t.split("/")[0]) + 2000}-${data.t.split("/")[1]}-${data.t
      .split("/")[2]
      .slice(0, 2)} ${data.t.split("/")[2].slice(3, 14)}`
  ).toLocaleString({ timeZone: "Asia/Tashkent" });
  let dataName;

  try {
    const foundDataName = await infoModel.findOne({ imei: data.i });
    dataName = foundDataName.device_name;
  } catch (err) {
    console.log(err);
  }

  const foundData = await dataModel
    .findOne({ imei: data.i })
    .catch((err) => console.log(err));

  if (foundData) {
    await dataModel
      .findOneAndUpdate(
        { imei: data.i },
        {
          imei: data.i,
          time: timeData,
          data_name: dataName,
          distance: data.d,
          volume: data.v,
          correction: data.c,
        }
      )
      .catch((err) => console.log(err));
  } else {
    const newData = new dataModel({
      imei: data.i,
      time: timeData,
      data_name: dataName,
      distance: data.d,
      volume: data.v,
      correction: data.c,
    });
    await newData.save().catch((err) => console.log(err));
  }
});

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
//    data = JSON.parse(message)
//   } catch(e) {
//     console.log(e);
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

// ! SERVER --------------------------------------------------------
htpp
  .createServer(async (request, response) => {
    if (request.method == "GET") {
      const url = request.url.split("/")[1];
      const urlSecond = request.url.split("/")[2];

      // DATALIST ----------------------------------------------------
      if (url == "data" && urlSecond == "list") {
        // PRESENT
        let currentPresentDate = new Date();
        currentPresentDate.setHours(currentPresentDate.getHours() - 5);
        const dataPresent = await dataModel.find({
          time: {
            $gte: currentPresentDate,
            $lt: new Date(),
          },
        });

        // THREE
        let currentThreeDate = new Date();
        let threeDaysAgoDate = new Date();
        threeDaysAgoDate.setDate(threeDaysAgoDate.getDate() - 3);
        currentThreeDate.setDate(currentThreeDate.getDate() - 1);
        const dataThreeDay = await dataModel.find({
          time: {
            $gte: threeDaysAgoDate,
            $lt: currentThreeDate,
          },
        });

        // TEN
        let currentTenDate = new Date();
        let tenDaysAgoDate = new Date();
        tenDaysAgoDate.setDate(tenDaysAgoDate.getDate() - 10);
        currentTenDate.setDate(currentTenDate.getDate() - 4);

        const dataTenDay = await dataModel.find({
          time: {
            $gte: tenDaysAgoDate,
            $lt: currentTenDate,
          },
        });

        // MONTH
        let currentMonthDate = new Date();
        let startMonthDate = new Date();

        currentMonthDate.setDate(currentMonthDate.getDate() - 11);
        startMonthDate.setMonth(startMonthDate.getMonth() - 1);
        startMonthDate.setDate(startMonthDate.getDate() - 11);

        const dataMonthDay = await dataModel.find({
          time: {
            $gte: startMonthDate,
            $lt: currentMonthDate,
          },
        });

        // YEAR
        let currentYearDate = new Date();
        let startYearDate = new Date();

        currentYearDate.setMonth(currentYearDate.getMonth() - 1);
        currentYearDate.setDate(currentYearDate.getDate() - 11);
        startYearDate.setFullYear(startYearDate.getFullYear() - 1);
        startYearDate.setMonth(startYearDate.getMonth() - 1);
        startYearDate.setDate(startYearDate.getDate() - 11);
        const dataYear = await dataModel.find({
          time: {
            $gte: startYearDate,
            $lt: currentYearDate,
          },
        });

        response.end(
          JSON.stringify({
            presentDay: dataPresent.length,
            dataThreeDay: dataThreeDay.length,
            dataTenDay: dataTenDay.length,
            dataMonthDay: dataMonthDay.length,
            dataYear: dataYear.length,
          })
        );
      }

      // PRESENT DAYS OF DATA
      if (url == "data" && urlSecond == "present") {
        let currentDate = new Date();
        currentDate.setHours(currentDate.getHours() - 5);
        const dataPresent = await dataModel.find({
          time: {
            $gte: currentDate,
            $lt: new Date(),
          },
        });

        response.end(
          JSON.stringify({
            dataPresentDay: dataPresent,
          })
        );
      }

      // THREE DAYS OF DATA
      if (url == "data" && urlSecond == "three") {
        let threeDaysAgoDate = new Date();
        let currentDate = new Date();

        threeDaysAgoDate.setDate(threeDaysAgoDate.getDate() - 3);
        currentDate.setDate(currentDate.getDate() - 1);
        const dataThreeDay = await dataModel.find({
          time: {
            $gte: threeDaysAgoDate,
            $lt: currentDate,
          },
        });

        response.end(
          JSON.stringify({
            dataThreeDay: dataThreeDay,
          })
        );
      }

      // TEN DAYS OF DATA
      if (url == "data" && urlSecond == "ten") {
        let tenDaysAgoDate = new Date();
        let currentDate = new Date();

        tenDaysAgoDate.setDate(tenDaysAgoDate.getDate() - 10);
        currentDate.setDate(currentDate.getDate() - 4);
        const dataTenDay = await dataModel.find({
          time: {
            $gte: tenDaysAgoDate,
            $lt: currentDate,
          },
        });

        response.end(
          JSON.stringify({
            dataTenDay: dataTenDay,
          })
        );
      }

      // MONTH DAYS OF DATA
      if (url == "data" && urlSecond == "month") {
        let currentMonthDate = new Date();
        let startMonthDate = new Date();

        currentMonthDate.setDate(currentMonthDate.getDate() - 11);
        startMonthDate.setMonth(startMonthDate.getMonth() - 1);
        startMonthDate.setDate(startMonthDate.getDate() - 11);

        const dataMonthDay = await dataModel.find({
          time: {
            $gte: startMonthDate,
            $lt: currentMonthDate,
          },
        });

        response.end(
          JSON.stringify({
            dataFiveDay: dataMonthDay,
          })
        );
      }

      // ANNUAL DATA DAYS OF DATA
      if (url == "data" && urlSecond == "year") {
        let currentYearDate = new Date();
        let startYearDate = new Date();

        currentYearDate.setMonth(currentYearDate.getMonth() - 1);
        currentYearDate.setDate(currentYearDate.getDate() - 11);
        startYearDate.setFullYear(startYearDate.getFullYear() - 1);
        startYearDate.setMonth(startYearDate.getMonth() - 1);
        startYearDate.setDate(startYearDate.getDate() - 11);

        const dataYear = await dataModel.find({
          time: {
            $gte: startYearDate,
            $lt: currentYearDate,
          },
        });

        response.end(
          JSON.stringify({
            dataAnnualDay: dataYear,
          })
        );
      }
    }
  })
  .listen(1000, console.log(1000));