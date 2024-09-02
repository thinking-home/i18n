import { CompiledTemplate, compileTemplate } from "./compileTemplate";
import { Content, Params, PluralForm } from "./model";

export type TParams = { count?: number;[key: string]: unknown };

export interface ContextArgs {
  locale: string; // текущий выбранный язык
  messages?: Record<string, string>;
  getPluralKey?: (key: string, form?: PluralForm) => string;
}

export class Context {
  readonly pluralRules: Intl.PluralRules;

  readonly getPluralKey: (key: string, form?: PluralForm) => string;
  readonly messages: Record<string, string>;
  readonly locale: string;

  private readonly templates: Record<string, CompiledTemplate> = {};

  constructor({
    locale,
    messages = {},
    getPluralKey = (k, f) => `${k}_${f}`,
  }: ContextArgs) {
    this.getPluralKey = getPluralKey;
    this.messages = messages;
    this.locale = locale;
    this.pluralRules = new Intl.PluralRules(locale);
  }

  public getTemplate(message: string): CompiledTemplate {
    return (
      this.templates[message] ||
      (this.templates[message] = compileTemplate(message))
    );
  }

  getMessage(key: string, form?: PluralForm) {
    const f = form ? this.messages[this.getPluralKey(key, form)] : undefined;

    return f || this.messages[key];
  }
}

export class Keyset<A extends Record<string, Content>> {
  readonly pluralRules: Intl.PluralRules;

  constructor(defaultLocale: string, private keyset: A) {
    this.pluralRules = new Intl.PluralRules(defaultLocale);
  }

  private getMessage<K extends keyof A>(
    ctx: Context,
    { type, content }: Content,
    key: K,
    params?: Params<A[K]["type"]>
  ): string | undefined {
    const k = String(key);

    switch (type) {
      case "plain":
        return ctx.getMessage(k) || content || k;
      case "plural":
        const count = Number(params?.count || 0);
        const form = ctx.pluralRules.select(count);

        let message = ctx.getMessage(k, form);

        if (message === undefined) {
          const defaultForm = this.pluralRules.select(count);

          message = content[defaultForm];
        }

        return message || k;
    }
  }

  translateRaw<K extends keyof A>(
    ctx: Context,
    key: K,
    params?: Params<A[K]["type"]>
  ): unknown[] {
    const obj = this.keyset[key];

    if (obj) {
      const message = this.getMessage(ctx, obj, key, params);

      if (message) {
        return ctx.getTemplate(message)(params);
      }
    }

    return [];
  }

  translate<K extends keyof A>(
    ctx: Context,
    key: K,
    params?: Params<A[K]["type"]>
  ): string {
    return this.translateRaw(ctx, key, params).join("");
  }
}
