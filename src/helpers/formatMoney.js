function formatMoney(number) {
  const [wholeNum, decimal] = number.toFixed(2).split('.');
  const c = wholeNum.substring(wholeNum.length % 3, wholeNum.length);
  let res = '';
  for (let i = 0; i < c.length; i += 3) {
    res +=
      (i === 0 && wholeNum.length % 3 === 0 ? '' : '.') + c.substring(i, i + 3);
  }
  res = wholeNum.substring(0, wholeNum.length % 3) + res + ',' + decimal;
  return res;
}

export default formatMoney;
