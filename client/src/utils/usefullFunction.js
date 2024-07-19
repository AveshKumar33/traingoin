export const returnCardDate = (inputDateString) => {
  const inputDate = new Date(inputDateString);

  const day = inputDate.getDate().toString().padStart(2, "0");
  const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
  const year = inputDate.getFullYear();

  const outputDateString = `${day}/${month}/${year}`;
  return outputDateString;
};

export const returnSearchArrOfCollection = (SelectedCollectionType = []) => {
  return SelectedCollectionType.map((ele) => ele.value).filter(
    (ele) => ele !== ""
  );
};

export const getPercentage = (originalAmount, discountPercentage) => {
  let Amount = (originalAmount * discountPercentage) / 100;
  return Math.round(Amount);
};

export const FinialAmount = (Amount, productdetails) => {
  let Sum = Amount;
  Sum = Sum + getPercentage(Sum, productdetails?.GSTIN || 0);
  return Math.round(Sum);
};

export const CustomizedFinialAmount = (Amount, productdetails) => {
  let Sum = Amount;
  Sum = Sum + productdetails?.installnationCharge;
  Sum = Sum + productdetails?.Wastage;
  Sum = Sum + getPercentage(Sum, productdetails?.GSTIN ?? 0);
  return Math.round(Sum);
};

export const FinialAmountWithAllAmount = (Amount, productdetails) => {
  let Sum = Amount;
  const Wastage_Amount = getPercentage(Sum, productdetails?._Amount ?? 0);
  Sum = Sum + Wastage_Amount;
  Sum = Sum + (productdetails?.InstallmentAmount ?? 0);
  const GST_Amount = getPercentage(Sum, productdetails?.GSTIN ?? 0);
  Sum = Sum + GST_Amount;
  return Math.round(Sum);
};
