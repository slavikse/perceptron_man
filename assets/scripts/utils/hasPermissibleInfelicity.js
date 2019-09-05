// Диапазон ускорения в пределах погрешности при столновении с объектом.
module.exports = (value) => {
  // Допустимая погрешность эмуляции физических тел.
  const infelicity = 3;
  return value > -infelicity && value < infelicity;
};
