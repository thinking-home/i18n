import { CompiledTemplate, compileTemplate } from "./compileTemplate";
import { Content, Keyset, PluralForm } from "./model";

export type TParams = { count?: number; [key: string]: unknown };

export class Ctx {
  readonly pluralRules: Intl.PluralRules;
  readonly dateTimeFormat: Intl.DateTimeFormat;

  private readonly templates: Record<string, CompiledTemplate> = {};

  constructor(
    public readonly locale: string,
    public readonly messages: Record<string, string>
  ) {
    this.pluralRules = new Intl.PluralRules(locale);
    this.dateTimeFormat = new Intl.DateTimeFormat(locale);
  }

  public getTemplate(message: string): CompiledTemplate {
    if (!this.templates[message]) {
      this.templates[message] = compileTemplate(message);
    }

    return this.templates[message];
  }

  getMessage(key: string, form?: PluralForm) {
    const f = form ? this.messages[`${key}_${form}`] : undefined;

    return f || this.messages[key];
  }
}

export class I18n<Key extends string, T extends Keyset<Key>> {
  constructor(private def: Keyset<Key>, private ctx: Ctx) {}

  private getMessage(key: keyof T): string {
    const definition: Content = this.def[key];

    switch (definition.type) {
      case "plain":
        return this.ctx.getMessage(String(key)) || definition.content;
      case "plural":
        return "";
    }
  }

  translateRaw(key: keyof T, params: TParams): unknown[] {
    let message = this.getMessage(key);

    return this.ctx.getTemplate(message)(params);
  }

  translate(key: keyof T, params: TParams): string {
    return this.translateRaw(key, params).join("");
  }
}
