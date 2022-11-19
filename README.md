# Sample BlockTrustSupermarket Project

This project demonstrates how to checkout items found in the merch array

The checkOutReceipt contains a series of all checkouts events that have happened on the Supermarket

The merch and prices variables are independent arrays but are mapped together by the constructor
at the point of deployment. 

A better way of tracking the prices of the merch is by using the checkMerch mapping
and parsing the merch's name into it. This is used in the checkOut function
to identify prices.

The checkOut function takes in the items users want to purchase,
as well as the quantity of each item. The index of each item is linked
to the index of the quantity parameter. For example if you want to buy 
3 T-Shirts and 2 Trousers, you have to input like so:
(["T-Shirt", "Trouser"], [3, 2]) or
(["Trouser", "T-Shirt"], [2, 3]).


Run the following commands to run this project:

```shell
npm install --save-dev hardhat
npm install @nomicfoundation/hardhat-toolbox
npm install chai-bn
npx hardhat
```

To compile the contract run:

```npx hardhat compile```

To deploy the contract run:

```npx hardhat run scripts/deploy.js```

To run the tests run:

```npx hardhat test```
#
