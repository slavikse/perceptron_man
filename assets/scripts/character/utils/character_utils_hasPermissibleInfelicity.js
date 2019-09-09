function hasPermissibleInfelicity(value) {
  // Допустимая погрешность эмуляции физических процессов при столкновении тел.
  const infelicity = 1;
  // Диапазон ускорения в рамках погрешности.
  return -infelicity <= value && value <= infelicity;
}

module.exports = hasPermissibleInfelicity;
