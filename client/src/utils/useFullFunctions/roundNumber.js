export function roundNumber(num) {
  const [integerPart, fractionalPart] = num.toString().split(".");

  if (!fractionalPart || fractionalPart.length < 2) {
    return num.toFixed(2);
  }

  const firstDecimalDigit = parseInt(fractionalPart.charAt(0));

  const roundedInteger =
    firstDecimalDigit >= 5 ? Math.ceil(integerPart) : Math.floor(integerPart);

  return `${roundedInteger}.00`;
}
