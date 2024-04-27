import { Ctx, I18n, compileTemplate, count, text } from "../src";

it("шаблонизатор должен подставлять значения параметров вместо плейсхолдеров", () => {
  const t = compileTemplate("У меня { appleCount } яблок и {pieCount} пирог");

  const str = t({ appleCount: 12, pieCount: 21 }).join("");

  expect(str).toEqual("У меня 12 яблок и 21 пирог");
});

it("если в контексте нет перевода для ключа, то должно использоваться значение по умолчанию", () => {
  const ctx = new Ctx({
    defaultLocale: "ru",
    locale: "en",
  });

  const keyset = {
    hello: text("Hello, {name}!"),
  };

  const i = new I18n(keyset, ctx);

  expect(i.translate("hello", { name: "Вася" })).toBe("Hello, Вася!");
});

it("если в контексте есть перевод для ключа, то должно использоваться значение из контекста", () => {
  const ctxRU = new Ctx({
    defaultLocale: "ru",
    locale: "en",
    messages: { hello: "Привет, {name}!" },
  });

  const keyset = {
    hello: text("Hello, {name}!"),
  };

  const i = new I18n(keyset, ctxRU);

  expect(i.translate("hello", { name: "Вася" })).toBe("Привет, Вася!");
});

it("используется форма слова, в зависимости от количества", () => {
  const ctx = new Ctx({
    defaultLocale: "ru",
    locale: "ru",
  });

  const keyset = {
    amout: count({
      one: "{count} сообщение",
      two: "{count} сообщения",
      many: "{count} сообщений",
    }),
  };

  const i = new I18n(keyset, ctx);

  expect(i.translate("amout", { count: 21 })).toBe("21 сообщение");
});

it("используется форма слова из контекста, в зависимости от количества", () => {
  const ctx = new Ctx({
    messages: {
      amount_one: "one message",
      amount_other: "{count} messages",
    },
    defaultLocale: "ru",
    locale: "en",
  });

  const keyset = {
    amount: count({
      one: "{count} сообщение",
      two: "{count} сообщения",
      many: "{count} сообщений",
    }),
  };

  const i = new I18n(keyset, ctx);

  expect(i.translate("amount", { count: 21 })).toBe("21 messages");
});
