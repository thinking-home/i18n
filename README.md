# @thinking-home/i18n

![](https://flat.badgen.net/npm/v/@thinking-home/i18n)
![](https://flat.badgen.net/badge/dependencies/0/blue)
![](https://flat.badgen.net/bundlephobia/minzip/@thinking-home/i18n)
![](https://flat.badgen.net/npm/types/@thinking-home/i18n)
![](https://flat.badgen.net/npm/license/@thinking-home/i18n)

`@thinking-home/i18n` — библиотека для интернационализации приложений на JavaScript и TypeScript.

- **Крошечная**. Без зависимостей, 892 байта в минифицированном виде + gzip.
- **Абстрактная**. Не требует использования каких-либо фреймворков и стейт менеджеров.
- **Быстрая**. Оптимизирована для большого количества текстов.
- **Хорошая поддержка Typescript**. Код библиотеки написан на Typescript. Есть контроль используемых ключей и типов параметров плюрализации.

## Установка

```sh
npm install @thinking-home/i18n
```

## Использование

1. Вы описываете в приложении набор ключей и задаете для них тексты по умолчанию.

   ```ts
   import { Keyset, count, text } from "@thinking-home/i18n";

   const keyset = new Keyset(
     "en", // язык, на котором написаны тексты по умолчанию
     {
       hello: text("Hello, {name}!"),
       amount: count({
         one: "one message",
         other: "{count} messages",
       }),
     }
   );
   ```

2. Вы получаете контекст, содержащий тексты для заданного языка.

   ```ts
   import { Context } from "@thinking-home/i18n";

   const ctx = new Context({
     locale: "ru",
     messages: {
       hello: "Привет, {name}!",
       amount_one: "{count} сообщение",
       amount_two: "{count} сообщения",
       amount_many: "{count} сообщений",
     },
   });
   ```

3. Когда нужно получить текст сообщения на заданном языке, вы используете функцию `translate` набора ключей и передаете в нее контекст.

   ```ts
   const title = keyset.translate(ctx, "hello", { name: "Вася" });
   // Привет, Вася!

   const hint = keyset.translate(ctx, "amount", { count: 21 });
   // 21 сообщение
   ```

3. Если вам нужно вставить внутрь текста сложные объекты, вы можете использовать функцию `translateRaw` набора ключей. Набор параметров функции `translateRaw` совпадает с функцией `translate`.

   ```ts
   const content = keyset.translateRaw(ctx, "hello", {
     name: <a href="/user/1235487">Вася</a>
   });

   expect(content).toBe([
     "Привет, ", <a href="/user/1235487">Вася</a>, "!"
   ]);
   ```

### Дополнительные возможности
