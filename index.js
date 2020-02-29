fetch('http://localhost:3000')
.then((response) => {
return response.json();
})
.then((data) => {
    try {
        renderDetails(data);
    } catch (error) {
        throw error;
    }
}).catch((error) => {
alert('Please check if the server is running');
});

function renderMonthWiseSales(monthWiseSalesData) {
    
const months = Object.keys(monthWiseSalesData);

for (let month of months) {

    const monthWiseSalesMonthSection = document.createElement('div');

    monthWiseSalesMonthSection.className = 'section';

    const monthLabel = document.createElement('label');

    monthLabel.className = 'month-label';

    const valueLabel = document.createElement('label');

    monthLabel.innerHTML = month;

    valueLabel.innerHTML = monthWiseSalesData[month].totalSalesOfMonth;

    monthWiseSalesMonthSection.append(monthLabel);

    monthWiseSalesMonthSection.append(valueLabel);

    $('#month-wise-sales-section').append(monthWiseSalesMonthSection);

}

}

function renderPopularItemDetails(itemsDataForEachMonth) {

const months = Object.keys(itemsDataForEachMonth);

for (let month of months) {

    const popularItemSection = document.createElement('div');

    const monthLabel = document.createElement('label');

    monthLabel.className = 'month-label';

    const valueLabel = document.createElement('label');

    monthLabel.innerHTML = month;

    valueLabel.innerHTML = itemsDataForEachMonth[month].popularItem.name;

    popularItemSection.append(monthLabel);

    popularItemSection.append(valueLabel);

    const minimumLabel = document.createElement('label');

    const minimumValueLabel = document.createElement('label');

    minimumLabel.innerHTML = 'Minimum orders';

    minimumValueLabel.innerHTML = itemsDataForEachMonth[month].popularItem.minimumOrders;

    popularItemSection.append(minimumLabel);

    popularItemSection.append(minimumValueLabel);

    const maximumLabel = document.createElement('label');

    const maximumValueLabel = document.createElement('label');

    maximumLabel.innerHTML = 'Maximum orders';

    maximumValueLabel.innerHTML = itemsDataForEachMonth[month].popularItem.maximumOrders;

    popularItemSection.append(maximumLabel);

    popularItemSection.append(maximumValueLabel);

    const averageLabel = document.createElement('label');

    const averageValueLabel = document.createElement('label');

    averageLabel.innerHTML = 'Average orders';

    averageValueLabel.innerHTML = itemsDataForEachMonth[month].popularItem.averageOrders;

    popularItemSection.append(averageLabel);

    popularItemSection.append(averageValueLabel);

    $('#popular-item-section').append(popularItemSection);

}

}

function renderMostRevenueGeneratedItemDetails(itemsDataForEachMonth) {

const months = Object.keys(itemsDataForEachMonth);

for (let month of months) {

    const mostRevenueGeneratedItemSection = document.createElement('div');

    mostRevenueGeneratedItemSection.className = 'section';

    const monthLabel = document.createElement('label');

    monthLabel.className = 'month-label';

    const valueLabel = document.createElement('label');

    monthLabel.innerHTML = month;

    valueLabel.innerHTML = itemsDataForEachMonth[month].maximumRevenueGeneratedItemName;

    mostRevenueGeneratedItemSection.append(monthLabel);

    mostRevenueGeneratedItemSection.append(valueLabel);
    
    $('#most-revenue-generated-section').append(mostRevenueGeneratedItemSection);

    }

}

function renderDetails(data) {

$('#total-sales').html(data.totalSales);

renderMonthWiseSales(data.monthWiseSalesData);

renderPopularItemDetails(data.monthWiseSalesData);

renderMostRevenueGeneratedItemDetails(data.monthWiseSalesData);

};