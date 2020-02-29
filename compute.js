const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

function convertToRecordsFromFile(filePath) {

  const fileData = fs.readFileSync(filePath);

  let records = fileData.toString().replace(/\r/g,'').split('\n');

  let fields = records.splice(0,1)[0].split(',');

  fields = fields.map((field) => {
    return field.toLowerCase().replace(' ','_');
  });

  records = records.map((recordString) => {

    const recordDataArray = recordString.split(',');

    if (recordDataArray.length < 5){
      return;
    }

    let record = {};

    for(let recordDataIndex = 0; recordDataIndex < recordDataArray.length; recordDataIndex++) {

      record[fields[recordDataIndex]] = recordDataArray[recordDataIndex];

    }

    return record;
    
  }).filter((record) => typeof record !== 'undefined');

  return records;

}

function getDateObjectFromDateString(dateString) {

  let dateMonthYear = dateString.split('-');

  return {
    year: dateMonthYear[0],
    month: dateMonthYear[1],
    date: dateMonthYear[2]
  };

}

function getMonthYearStringFromDateObject(dateObject) {

  return `${dateObject.year}-${dateObject.month}`;

}

function getUniqueMonthsFromRecords(records, defaultValue) {

  const uniqueMonths = {};

  for (let record of records) {

    const dateObject = getDateObjectFromDateString(record.date);

    const monthAndYearString = getMonthYearStringFromDateObject(dateObject);

    if(typeof uniqueMonths[monthAndYearString] === 'undefined') {

      if(typeof defaultValue === 'undefined') {
        defaultValue = null;
      }

      uniqueMonths[monthAndYearString] = defaultValue;
    }

  }

  return uniqueMonths;

}

function getRecordsGroupedByMonth(records) {

  let recordsGroupedByUniqueMonth = getUniqueMonthsFromRecords(records);

  for (let record of records) {

    const dateObject = getDateObjectFromDateString(record.date);

    const monthYearString = getMonthYearStringFromDateObject(dateObject);

    if(recordsGroupedByUniqueMonth[monthYearString] === null) {
      recordsGroupedByUniqueMonth[monthYearString] = {
        records: [record]
      };
    } else {
      recordsGroupedByUniqueMonth[monthYearString].records.push(record);
    }

  }

  return recordsGroupedByUniqueMonth;

}

function getRecordsGroupedByDate(records, monthAndYear) {

  let recordsGroupedByUniqueDate = {};

  for (let record of records) {

    let date = record.date;

    if (date.includes(monthAndYear) === false) {
      continue;
    }

    if(typeof recordsGroupedByUniqueDate[record.date] === 'undefined') {
      recordsGroupedByUniqueDate[record.date] = {
        records: [record]
      };
    } else {
      recordsGroupedByUniqueDate[record.date].records.push(record);
    }

  }

  return recordsGroupedByUniqueDate;

}

function getItemOrderQuantityPerDate(records, monthAndYear) {

  const recordsGroupedByUniqueDate = getRecordsGroupedByDate(records, monthAndYear);

  const dates = Object.keys(recordsGroupedByUniqueDate);

  for (let date of dates) {

    const items = {};

    for (let record of recordsGroupedByUniqueDate[date].records) {
  
      if(typeof items[record.sku] === 'undefined') {
        items[record.sku] = +record.quantity;
      } else {
        items[record.sku] += +record.quantity;
      }
  
    }

    recordsGroupedByUniqueDate[date] = items;

    delete(recordsGroupedByUniqueDate[date].records);

  }

  return recordsGroupedByUniqueDate;

}

function getMinMaxAndAvgOfItem(itemName, records, monthAndYear, totalItems) {

  const itemOrderQuantityPerDate = getItemOrderQuantityPerDate(records, monthAndYear);

  const dates = Object.keys(itemOrderQuantityPerDate);

  const metadataOfItem = {
    minimumOrdersPerMonth: null,
    maximumOrdersPerMonth: 0,
    averageOrdersPerMonth: (totalItems / dates.length).toFixed(2)
  };

  for (let date of dates) {

    const items = Object.keys(itemOrderQuantityPerDate[date]);

    for (let item of items) {

      if (item !== itemName) {
        continue;
      }

      if (metadataOfItem.minimumOrdersPerMonth === null) {
        metadataOfItem.minimumOrdersPerMonth = itemOrderQuantityPerDate[date][item];
      }
  
      if (itemOrderQuantityPerDate[date][item] > metadataOfItem.maximumOrdersPerMonth) {
        metadataOfItem.maximumOrdersPerMonth = itemOrderQuantityPerDate[date][item];
      }
  
      if (itemOrderQuantityPerDate[date][item] < metadataOfItem.minimumOrdersPerMonth) {
        metadataOfItem.minimumOrdersPerMonth = itemOrderQuantityPerDate[date][item];
      }

    }

  }

  return metadataOfItem;

}

function getTotalSalesOfRecord(records) {

  let totalSales = 0;

  for (let record of records) {
    totalSales += +record.total_price;
  }

  return totalSales;

}

function getItemsDataForEachMonth(records) {

  let recordsOfUniqueMonth = getRecordsGroupedByMonth(records);

  for (let month of Object.keys(recordsOfUniqueMonth)) {

    const totalSalesOfMonth = getTotalSalesOfRecord(recordsOfUniqueMonth[month].records);

    recordsOfUniqueMonth[month].totalSalesOfMonth = totalSalesOfMonth;

    const items = {};

    for(let record of recordsOfUniqueMonth[month].records) {

      if (typeof items[record.sku] === 'undefined') {
        items[record.sku] = {
          quantity: +record.quantity,
          revenue: +record.total_price
        }; 
      } else {
        items[record.sku].quantity += +record.quantity;
        items[record.sku].revenue += +record.total_price;
      }

    }

    recordsOfUniqueMonth[month]['items'] = items;

    let maximumSoldItemName = '';
    let maximumSoldItemCount = 0;
    let maximumRevenueGeneratedItemName = '';
    let maximumRevenueGeneratedItemRevenue = 0;

    for (let itemName of Object.keys(recordsOfUniqueMonth[month].items)) {

      if(recordsOfUniqueMonth[month].items[itemName].quantity > maximumSoldItemCount) {
        maximumSoldItemName = itemName;
        maximumSoldItemCount = recordsOfUniqueMonth[month].items[itemName].quantity;
      }

      if(recordsOfUniqueMonth[month].items[itemName].revenue > maximumRevenueGeneratedItemRevenue) {
        maximumRevenueGeneratedItemName = itemName;
        maximumRevenueGeneratedItemRevenue = recordsOfUniqueMonth[month].items[itemName].revenue;
      }

    }

    const totalQuantity = recordsOfUniqueMonth[month].items[maximumSoldItemName].quantity;

    const metadataOfPopularItem = getMinMaxAndAvgOfItem(maximumSoldItemName, records, month, totalQuantity);

    recordsOfUniqueMonth[month].maximumSoldItemName = maximumSoldItemName;
    recordsOfUniqueMonth[month].maximumRevenueGeneratedItemName = maximumRevenueGeneratedItemName;
    recordsOfUniqueMonth[month].metadataOfPopularItem = metadataOfPopularItem;
    delete(recordsOfUniqueMonth[month].items);
    delete(recordsOfUniqueMonth[month].records);

  }

  return recordsOfUniqueMonth;

}

const filePath = './sales-data.txt';

const records = convertToRecordsFromFile(filePath);

const totalSales = getTotalSalesOfRecord(records);

const monthWiseSalesData = getItemsDataForEachMonth(records);

const responseData = JSON.stringify({
  totalSales,
  monthWiseSalesData
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", null);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => res.send(responseData));

app.listen(port, () => console.log(`App is listening on port ${port}!`));