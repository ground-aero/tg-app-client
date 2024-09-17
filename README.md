
# Part-1 (Frontend). Telegram Mini App 'Three-in-One'

### Name of the App if Telegram: @TgGroundBot

### Frontend deployed to 'Netlify' server:
Alternatively you may open App link: [https://tg-app-client.netlify.app/](https://tg-app-client.netlify.app/) to view it in your browser.


#### Basic stack: React, CSS, REST API, Telegram App Library

 ```
API данные о погоде: 

 Endpoints:

 /api/weather - запрос текущей погоды  
 /api/forecast - запрос прогноза погоды
 
 ```
 В приложении Telegram найдите бота с именем: **@TgGroundBot**
 - запустите бота нажатием кнопки 'Start'
 - выйдет приветстве Вас по имени пользователя, а также появятся кнопки: "Инфо о приложении", "Открыть окно приложения"  
 - при нажатии на кнопку "Инфо о приложении" появится информация о доступных сервисах
 - при нажатии на кнопку "Открыть окно приложения" откроется окно приложения с возможностью выбора страниц 1-3 (1.Чат, 2.Погода, 3.Прогноз)   
 - дополнительно можно пользоваться альтернативным Меню в закрепе (в нижней панели/меню Телеграмма)

 ```

---
Дополнительно.
Адрес репозитория бэкэнд части-2 приложения: https://github.com/ground-aero/tg-app-server  



~~~
ToDo:
- улучшить UI/UX (сделать кнопку отправки сообщений в чате,  
не только по нажатию 'Enter', отображать имя пользователя отправившего сообщение) - выполнено.
- отображать user name напротив каждого сообщения - выполнено.
- настроить отображение картинок о погоде (внутри карточек погоды) входящих из внешнего API  - выполнено.
- сделать выпадающее меню с выборкой по нескольким городам (в окнах "Weather" "Forecast")

~~~




---

![img-1](/images/startMenu.png)  

---

![img-3](/images/chatWindow.png)

---

![img-2](/images/weatherWindow.png)





