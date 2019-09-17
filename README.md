# Game project: perceptron_man

## Соглашения по именованию
### Файлы
Имя файла (компонента) должно иметь уникальное имя, поэтому именовать его нужно по пути и имени.

**Пример:**
* Путь до компонента: `character/utils`
* Имя компонента / имя функции на экспорт: `hasPermissibleInfelicity`
* Результат - имя файла: `character_utils_hasPermissibleInfelicity.js`

### Переменные
**Примеры:**
* Узел: `${name}Node` = `cc.find(name)`
* Компонент: `${name}Component` = `this.node.getComponent(name)`

### Функции
**Примеры:**
* Из редактора (кнопка): `editor${name}`
* Из анимации по имени: `editorAnimation${name}`
* Из внешнего компонента: `externalComponent${name}`

## Общие соглашения
* `Prefab` только для клонирования объекта из кода.

## Директории собранного проекта:
> exe:  
`C:\Projects\perceptron_man\build\jsb-default\frameworks\runtime-src\proj.win32\Release.win32`

> web:  
`C:\Projects\perceptron_man\build\web-desktop`

> apk:  
`C:\Projects\perceptron_man\build\jsb-default\frameworks\runtime-src\proj.android-studio\app\build\outputs\apk\release`
