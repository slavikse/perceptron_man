# Игровой проект на движке Cocos Creator: Perceptron Man

## Соглашения по именованию

### Файлы

Имя файла-компонента должно иметь уникальное имя.
Именовать файл нужно по правилу **одноуровневого** именования.

**Пример для компонентов:**

- Директория файла с компонентом: `perceptron`
- Имя файла компонента: `perceptron_neuron`

**Пример для функций:**

- Директория файла с функцией: `utils`
- Имя файла = Имя функции на экспорт: `hasPermissibleInfelicity`
- Результат имени файла: `utils_hasPermissibleInfelicity.js`

### Свойства компонента

- Тип _prefab_: `namePrefab`
- Тип _audio_: `nameAudio`

### Переменные

**Примеры:**

- Узел: `${name}Node` = `cc.find(name)`
- Клон: `${name}Node = cc.instantiate(prefab)`
- Компонент: `${name}Component` = `this.node.getComponent(name)`
- Состояние: `this.node.state = { }`

### Функции

**Примеры:**

- Событие: `on${actionName}`
- Внешние: `external${actionName}`
- Редактор: `editor${actionName}`
- Анимация: `animation${actionName}`

## Общие соглашения

- `Prefab` только для клонирования объекта из кода.
- Размеры графики в степенях двойки. ex: 2^4.

## Директории собранного проекта:

> exe: `C:\Projects\perceptron_man\build\jsb-default\publish\win32`

> apk: `C:\Projects\perceptron_man\build\jsb-default\publish\android`

> web: `C:\Projects\perceptron_man\build\web-desktop`
