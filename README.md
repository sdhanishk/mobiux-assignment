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
  monthWiseSalesTotal: {
    [month1]: number,
    [month2]: number,
    ...
  },
  itemsDataForEachMonth: {
    [month1]: {
      maximumSoldItemName: string,
      maximumRevenueGeneratedItemName: string,
      metadataOfPopularItem: {
        minimumOrdersPerMonth: number,
        maximumOrdersPerMonth: number,
        averageOrdersPerMonth: number
      }
    },
    ...
  }
}
```
