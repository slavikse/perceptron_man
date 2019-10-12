# Игровой проект на движке Cocos Creator: Perceptron Man

## Соглашения по именованию

### Файлы

Имя файла-компонента должно иметь уникальное имя.
Именовать файл нужно по правилу **одноуровневого** именования.

**Пример для компонентов:**

- Директория файла с компонентом: `perceptron`
- Имя файла компонента: `perceptron_neuron`

**Пример для функций:**

- Директория файла с функцией: `perceptron/utils`
- Имя файла = Имя функции на экспорт: `hasPermissibleInfelicity`
- Результат имени файла: `perceptron_utils_hasPermissibleInfelicity.js`

**Пример создания события:**

```js
const event = new cc.Event.EventCustom('hierarchy/directory/functionName');
event.detail = { data: {} };
cc.director.dispatchEvent(event);
```

**Пример подписки на событие:**

```js
cc.director.on('hierarchy/directory/functionName', this.functionName, this);
this.functionName({ detail: { data } }) { };
```

### Свойства компонента

- Тип _prefab_: `namePrefab`
- Тип _audio_: `nameAudio`

### Переменные

**Примеры:**

- Узел: `${name}Node` = `cc.find(name)`
- Клон: `${name}Node = cc.instantiate(prefab)`
- Компонент: `${name}Component` = `this.node.getComponent(name)`
- Состояние: `this.node.state = {}`

### Функции

**Примеры:**

- Событие: `on${actionName}`
- Внешние: `external${actionName}`
- Редактор: `onEditor${actionName}`
- Анимация: `onAnimation${actionName}`

## Общие соглашения

- В компоненте по порядку реализуются методы из Cocos, а затем все остальные.
- `Prefab` только для клонирования объекта из кода.
- Размеры графики в степенях двойки. _ex: 2^4._

## Директории собранного проекта:

> exe: `C:\Projects\perceptron_man\build\jsb-default\publish\win32`

> apk: `C:\Projects\perceptron_man\build\jsb-default\publish\android`

> web: `C:\Projects\perceptron_man\build\web-desktop`
