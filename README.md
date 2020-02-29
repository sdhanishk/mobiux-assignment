# mobiux-assignment

1. Run

```
npm install
```

2. Then run

```
node compute.js
```

This starts a server on port `3000` which serves the json data holding all the required computed data.

Open `index.html` to have a simple view at the computed data.

# Data structure of the generated data

```
{
  totalSales: number,
  monthWiseSalesData: {
    [month1]: {
      totalSalesOfMonth: number,
      popularItem: {
        name: string,
        minimumOrders: number,
        maximumOrders: number,
        averageOrders: number
      },
      maximumRevenueGeneratedItemName: string
    },
    ...
  }
}
```
