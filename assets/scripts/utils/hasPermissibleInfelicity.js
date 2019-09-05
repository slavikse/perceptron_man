// Диапазон ускорения в пределах погрешности при столновении с объектом.
module.exports = (value) => {
  // Допустимая погрешность эмуляции физических тел.
  const infelicity = 1;
  return -infelicity <= value && value <= infelicity;
};
