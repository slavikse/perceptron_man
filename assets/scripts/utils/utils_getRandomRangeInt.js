/**
 * Получение случайного целого числа в диапазоне [min, max].
 * @param min {number} Минимальное число диапазона.
 * @param max {number} Максимальное число диапазона.
 * @returns {number} Случайное целое число из диапазона.
 */
function getRandomRangeInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = getRandomRangeInt;
