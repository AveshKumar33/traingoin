const parameterSchema = require("../modal/parameterModal");
const singleProductCombinationSchema = require("../modal/singleProductCombinationModal");

function generateCombinations(arrays) {
  function helper(index, currentCombination) {
    if (index === arrays.length) {
      combinations.push(currentCombination.slice());
      return;
    }

    for (let i = 0; i < arrays[index].length; i++) {
      currentCombination.push({
        parameterId: arrays[index][i]._id,
        attributeId: arrays[index][i].attributeId,
      });
      helper(index + 1, currentCombination);
      currentCombination.pop();
    }
  }

  const combinations = [];
  helper(0, []);
  return combinations;
}
async function createCombination(attributeIds, id, userId) {
  const groupedParameter = [
    {
      $match: {
        attributeId: {
          $in: attributeIds,
        },
      },
    },
    {
      $project: {
        attributeId: 1,
      },
    },
    {
      $group: {
        _id: "$attributeId",
        items: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        items: 1,
      },
    },
  ];
  const matchedDocuments = await parameterSchema.aggregate(groupedParameter);

  const AllItems = matchedDocuments.map((item) => item.items);

  const AllAttributeCombination = generateCombinations(AllItems);

  const AllCombination = AllAttributeCombination.map((combination, index) => ({
    singleProductId: id,
    SKU: " ",
    Barcode: " ",
    SalePrice: 0,
    MRP: 0,
    ProductInStockQuantity: 0,
    image: "default.png",
    combinations: combination,
    isDefault: index === 0 ? true : false,
    createdBy: userId,
    updatedBy: userId,
  }));

  await singleProductCombinationSchema.insertMany(AllCombination);
}

async function createCombinationOnParameterCreate(
  productsData,
  parameterId,
  attributeid,
  userId
) {
  const allCombinations = [];

  for (let productData of productsData) {
    productData = productData[0];

    if (productData.attribute.length === 0) {
      allCombinations.push({
        singleProductId: productData._id,
        SKU: " ",
        Barcode: " ",
        SalePrice: 0,
        MRP: 0,
        ProductInStockQuantity: 0,
        image: "default.png",
        combinations: [{ parameterId: parameterId, attributeId: attributeid }],
        isDefault: false,
        createdBy: userId,
        updatedBy: userId,
      });
      continue;
    }

    const groupedParameter = [
      {
        $match: {
          attributeId: {
            $in: productData.attribute,
          },
        },
      },
      {
        $group: {
          _id: "$attributeId",
          items: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          items: 1,
        },
      },
    ];

    const matchedDocuments = await parameterSchema.aggregate(groupedParameter);
    const allItems = matchedDocuments.map((item) => item.items);

    const allAttributeCombination = generateCombinations([
      ...allItems,
      [{ _id: parameterId, attributeId: attributeid }],
    ]);

    const combinationsToAdd = allAttributeCombination.map((combination) => ({
      singleProductId: productData._id,
      SKU: " ",
      Barcode: " ",
      SalePrice: 0,
      MRP: 0,
      ProductInStockQuantity: 0,
      image: "default.png",
      combinations: combination,
      isDefault: false,
      createdBy: userId,
      updatedBy: userId,
    }));

    allCombinations.push(...combinationsToAdd);
  }

  await singleProductCombinationSchema.insertMany(allCombinations);
}

function compareArraysOfObjectsAndStrings(arr1, arr2) {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    return true;
  }

  // Convert array of object to an array of strings containing the "$oid" values
  // const arr1Strings = arr1.map((item) => item.toString());

  // Sort both arrays
  arr1.sort();
  arr2.sort();

  // console.log("arr1?", Array.isArray(arr1));
  // console.log("arr2?", Array.isArray(arr2));

  // console.log("Array111: ", arr1);
  // console.log("Array222: ", arr2);
  // Compare each element of the arrays

  for (let i = 0; i < arr1.length; i++) {
    // console.log("Array111: " + arr1[i]);
    // console.log("Array222: " + arr2[i]);
    if (arr1[i].toString() !== arr2[i].toString()) {
      return true;
    }
  }

  return false;
}
function isAttributesChanged(arr1, arr2) {
  // Check if the arrays have the same length
  if (arr1?.length !== arr2?.length) {
    return true;
  }

  // Convert array of object to an array of strings containing the "$oid" values
  const stringArr1 = arr1.map((item) => item.toString());
  const stringArr2 = arr2.map((item) => item.toString());

  // Sort both arrays
  stringArr1.sort((a, b) => a - b);
  stringArr2.sort((a, b) => a - b);

  // Compare each element of the arrays
  for (let i = 0; i < stringArr1.length; i++) {
    if (!stringArr2.includes(stringArr1[i])) {
      return true;
    }
  }
  return false;
}
function removedAttributeIds(arr1, arr2) {
  // Convert array of object to an array of strings containing the "$oid" values
  const attributeIds = [];
  const dbArr = arr1.map((item) => item.toString());
  const editArr = arr2.map((item) => item.toString());

  // Create remove attribute ids  arrays
  for (let i = 0; i < dbArr.length; i++) {
    if (!editArr.includes(dbArr[i])) {
      attributeIds.push(dbArr[i]);
    }
  }
  return attributeIds;
}

module.exports = {
  isAttributesChanged,
  createCombination,
  removedAttributeIds,
  compareArraysOfObjectsAndStrings,
  createCombinationOnParameterCreate,
};
