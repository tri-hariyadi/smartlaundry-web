const currencyFormat = (value: number | string) => {
  const num = value ? Number(value.toString().replace(/[^\d]/g, '')) : 0;
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });
  return formatter.format(num);
};

export default currencyFormat;
