# Игровой проект на движке Cocos2d-x: Perceptron Man

## Соглашения по именованию
### Файлы
Имя файла (компонента) должно иметь уникальное имя, поэтому именовать его нужно по пути и имени.

**Пример:**
* Путь до компонента: `character/utils`
* Имя компонента / имя функции на экспорт: `hasPermissibleInfelicity`
* Результат - имя файла: `character_utils_hasPermissibleInfelicity.js`

### Свойства компонента
* Тип *prefab*: `namePrefab`
* Тип *audio*: `nameAudio`

### Переменные
**Примеры:**
* Узел: `${name}Node` = `cc.find(name)`
* Клон: `${name}Node = cc.instantiate(prefab)`
* Компонент: `${name}Component` = `this.node.getComponent(name)`
* Состояние: `this.node.state = { }`

### Функции
**Примеры:**
* Событие: `on${actionName}`
* Внешние: `externalComponent${actionName}`
* Редактор: `editor${actionName}`
* Анимация: `editorAnimation${actionName}`

## Общие соглашения
* `Prefab` только для клонирования объекта из кода.

## Директории собранного проекта:
> exe:  
`C:\Projects\perceptron_man\build\jsb-default\frameworks\runtime-src\proj.win32\Release.win32`

> web:  
`C:\Projects\perceptron_man\build\web-desktop`

> apk:  
`C:\Projects\perceptron_man\build\jsb-default\frameworks\runtime-src\proj.android-studio\app\build\outputs\apk\release`
