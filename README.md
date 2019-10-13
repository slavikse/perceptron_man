# Игровой проект на движке Cocos Creator: Perceptron Man

## Соглашения по именованию

### Файлы

- Имя файла-компонента должно иметь уникальное имя по правилу **одноуровневого** именования.

**Пример для компонентов:**

- Директория: `perceptron`
- Имя файла компонента: `perceptron_neuron`

**Пример для функций:**

- Директория: `perceptron/utils`
- Имя файла = Имя функции на экспорт: `hasPermissibleInfelicity`
- Имя файла компонента: `perceptron_utils_hasPermissibleInfelicity.js`

### Свойства компонента

- Тип _prefab_: `${name}Prefab`
- Тип _audio_: `${name}Audio`

### Переменные

**Примеры:**

- Узел: `${name}Node` = `cc.find(${name})`
- Клон: `${namePrefab}Node = cc.instantiate(${namePrefab})`
- Компонент: `${name}Component` = `this.node.getComponent(${name})`
- Состояние: `this.node.state = {}`

### Функции

**Примеры:**

- Событие: `on${actionName}`
- Внешние: `external${actionName}`
- Редактор: `onEditor${actionName}`
- Анимация: `onAnimation${actionName}`

## Общие соглашения

- В компоненте сначала описываются методы Cocos, а затем все остальные.
- `Prefab` только для клонирования объекта из кода.
- Размеры графики в степенях двойки. _ex: 2^4._

## Директории собранного проекта:

> exe: `C:\Projects\perceptron_man\build\jsb-default\publish\win32`

> apk: `C:\Projects\perceptron_man\build\jsb-default\publish\android`

> web: `C:\Projects\perceptron_man\build\web-desktop`
