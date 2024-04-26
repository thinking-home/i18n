import { CompiledTemplate, compileTemplate } from "./compileTemplate";
import { Content, Keyset, Params, PluralForm } from "./model";

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

export class I18n<A extends Keyset> {
    constructor(private keyset: A, private ctx: Ctx) {

    }

    translateRaw<K extends keyof A>(key: K, params: Params<A[K]['type']>): unknown[] {
        const k = String(key);
        const { type, content }: Content = this.keyset[k];
        let message: string = '';

        switch (type) {
            case 'plain':
                message = this.ctx.getMessage(k) || content;
                break;
            case 'plural':
                const form = this.ctx.pluralRules.select(Number(params.count));
                message = this.ctx.getMessage(k, form) || content[form] || k;
                break;
        }

        return this.ctx.getTemplate(message)(params);
    }

    translate<K extends keyof A>(key: K, params: Params<A[K]['type']>): string {
        return this.translateRaw(key, params).join("");
    }
}
