import { Context, Keyset, compileTemplate, count, text } from "../src";

it("шаблонизатор должен подставлять значения параметров вместо плейсхолдеров", () => {
  const t = compileTemplate("У меня { appleCount } яблок и {pieCount} пирог");

  const str = t({ appleCount: 12, pieCount: 21 }).join("");

  expect(str).toEqual("У меня 12 яблок и 21 пирог");
});

it("если в контексте нет перевода для ключа, то должно использоваться значение по умолчанию", () => {
  const ctx = new Context({ locale: "ru" });

  const i = new Keyset("en", {
    hello: text("Hello, {name}!"),
  });

  expect(i.translate(ctx, "hello", { name: "Вася" })).toBe("Hello, Вася!");
});

it("если в контексте есть перевод для ключа, то должно использоваться значение из контекста", () => {
  const ctxRU = new Context({
    locale: "ru",
    messages: { hello: "Привет, {name}!" },
  });

  const i = new Keyset("en", {
    hello: text("Hello, {name}!"),
  });

  expect(i.translate(ctxRU, "hello", { name: "Вася" })).toBe("Привет, Вася!");
});

it("используется форма слова, в зависимости от количества", () => {
  const ctx = new Context({ locale: "ru" });

  const i = new Keyset("ru", {
    amout: count({
      one: "{count} сообщение",
      two: "{count} сообщения",
      many: "{count} сообщений",
    }),
  });

  expect(i.translate(ctx, "amout", { count: 21 })).toBe("21 сообщение");
});

it("используется форма слова из контекста, в зависимости от количества", () => {
  const ctx = new Context({
    messages: {
      amount_one: "one message",
      amount_other: "{count} messages",
    },
    locale: "en",
  });

  const i = new Keyset("ru", {
    amount: count({
      one: "{count} сообщение",
      two: "{count} сообщения",
      many: "{count} сообщений",
    }),
  });

  expect(i.translate(ctx, "amount", { count: 21 })).toBe("21 messages");
});

it("если в контексте нет нужной формы слова, то используется форма для локали по умолчанию", () => {
  const ctx = new Context({ locale: "en" });

  const i = new Keyset("ru", {
    amount: count({
      one: "{count} сообщение",
      two: "{count} сообщения",
      many: "{count} сообщений",
    }),
  });

  // в английском языке должна быть форма other,
  // но т.к. такого ключа нет, то используется форма one из языка по умолчанию (ru)
  expect(i.translate(ctx, "amount", { count: 21 })).toBe("21 сообщение");
});

it("можно переопределить правило формирования ключей, зависящих от количества", () => {
  const ctx = new Context({
    messages: {
      amount$one: "one message",
      amount$other: "{count} messages",
    },
    locale: "en",
    getPluralKey: (key, form) => `${key}$${form}`,
  });

  const i = new Keyset("ru", {
    amount: count({}),
  });

  expect(i.translate(ctx, "amount", { count: 21 })).toBe("21 messages");
});
