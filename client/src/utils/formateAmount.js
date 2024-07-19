export const formateAmount = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// export function numberToWords(number) {
//   const units = [
//     "",
//     "One",
//     "Two",
//     "Three",
//     "Four",
//     "Five",
//     "Six",
//     "Seven",
//     "Eight",
//     "Nine",
//   ];
//   const teens = [
//     "Ten",
//     "Eleven",
//     "Twelve",
//     "Thirteen",
//     "Fourteen",
//     "Fifteen",
//     "Sixteen",
//     "Seventeen",
//     "Eighteen",
//     "Nineteen",
//   ];
//   const tens = [
//     "",
//     "",
//     "Twenty",
//     "Thirty",
//     "Forty",
//     "Fifty",
//     "Sixty",
//     "Seventy",
//     "Eighty",
//     "Ninety",
//   ];

//   function convert(num) {
//     if (num < 10) return units[num];
//     if (num < 20) return teens[num - 10];
//     if (num < 100) return tens[Math.floor(num / 10)] + " " + units[num % 10];
//     if (num < 1000)
//       return units[Math.floor(num / 100)] + " Hundred " + convert(num % 100);
//     if (num < 100000)
//       return (
//         convert(Math.floor(num / 1000)) + " Thousand " + convert(num % 1000)
//       );
//     if (num < 10000000)
//       return (
//         convert(Math.floor(num / 100000)) + " Lakh " + convert(num % 100000)
//       );
//     return "Number too large";
//   }

//   if (number === 0) return "Zero";
//   return convert(number) + " Rupees Only";
// }

export function numberToWords(number) {
  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convert(num) {
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 !== 0 ? " " + units[num % 10] : "")
      );
    if (num < 1000)
      return (
        units[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 !== 0 ? " " + convert(num % 100) : "")
      );
    if (num < 100000)
      return (
        convert(Math.floor(num / 1000)) +
        " Thousand" +
        (num % 1000 !== 0 ? " " + convert(num % 1000) : "")
      );
    if (num < 10000000)
      return (
        convert(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 !== 0 ? " " + convert(num % 100000) : "")
      );
    return "Number too large";
  }

  if (number === 0) return "Zero Rupees Only";

  const [integerPart, decimalPart] = number.toString().split(".");

  const integerWords = convert(parseInt(integerPart)) + " Rupees";
  const decimalWords = decimalPart
    ? " and " + convert(parseInt(decimalPart)) + " Paise"
    : "";

  return integerWords + decimalWords + " Only";
}
