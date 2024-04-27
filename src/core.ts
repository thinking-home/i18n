import { CompiledTemplate, compileTemplate } from "./compileTemplate";
import { Content, Keyset, Params, PluralForm } from "./model";

export type TParams = { count?: number; [key: string]: unknown };

export interface CtxArgs {
  locale: string; // текущий выбранный язык
  defaultLocale: string; // язык, на котором написаны тексты по умолчанию
  messages?: Record<string, string>;
}

export class Ctx {
  readonly pluralRules: Intl.PluralRules;
  readonly dateTimeFormat: Intl.DateTimeFormat;

  readonly messages: Record<string, string>;
  readonly locale: string;
  readonly defaultLocale: string;

  private readonly templates: Record<string, CompiledTemplate> = {};

  constructor({ locale, defaultLocale, messages = {} }: CtxArgs) {
    this.messages = messages;
    this.locale = locale;
    this.defaultLocale = defaultLocale;
    this.pluralRules = new Intl.PluralRules(locale);
    this.dateTimeFormat = new Intl.DateTimeFormat(locale);
  }

  public getTemplate(message: string): CompiledTemplate {
    return (
      this.templates[message] ||
      (this.templates[message] = compileTemplate(message))
    );
  }

  getMessage(key: string, form?: PluralForm) {
    const f = form ? this.messages[`${key}_${form}`] : undefined;

    return f || this.messages[key];
  }
}

export class I18n<A extends Keyset> {
  constructor(private keyset: A, private ctx: Ctx) {}

  private getMessage<K extends keyof A>(
    key: K,
    params: Params<A[K]["type"]>,
    { type, content }: Content
  ): string | undefined {
    const k = String(key);

    switch (type) {
      case "plain":
        return this.ctx.getMessage(k) || content;
      case "plural":
        const form = this.ctx.pluralRules.select(Number(params.count));
        return this.ctx.getMessage(k, form) || content[form] || k;
    }
  }

  translateRaw<K extends keyof A>(
    key: K,
    params: Params<A[K]["type"]>
  ): unknown[] {
    const obj = this.keyset[key];

    if (obj) {
      const message = this.getMessage(key, params, obj);

      if (message) {
        return this.ctx.getTemplate(message)(params);
      }
    }

    return [];
  }

  translate<K extends keyof A>(key: K, params: Params<A[K]["type"]>): string {
    return this.translateRaw(key, params).join("");
  }
}
