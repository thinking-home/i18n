import { Ctx, I18n, compileTemplate, count, text } from "../src";

it("шаблонизатор должен подставлять значения параметров вместо плейсхолдеров", () => {
  const t = compileTemplate("У меня { appleCount } яблок и {pieCount} пирог");

  const str = t({ appleCount: 12, pieCount: 21 }).join("");

  expect(str).toEqual("У меня 12 яблок и 21 пирог");
});

it("если в контексте нет перевода для ключа, то должно использоваться значение по умолчанию", () => {
  const ctx = new Ctx("ru", {});

  const keyset = {
    hello: text("Hello, {name}!"),
  };

  const i = new I18n(keyset, ctx);

  expect(i.translate("hello", { name: "Вася" })).toBe("Hello, Вася!");
});

it("если в контексте есть перевод для ключа, то должно использоваться значение из контекста", () => {
  const ctxRU = new Ctx("ru", { hello: "Привет, {name}!" });

  const keyset = {
    hello: text("Hello, {name}!"),
  };

  const i = new I18n(keyset, ctxRU);

  expect(i.translate("hello", { name: "Вася" })).toBe("Привет, Вася!");
});
