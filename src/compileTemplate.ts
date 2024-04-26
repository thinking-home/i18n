export type TemplateParams = Record<string, unknown> | null | undefined;
export type CompiledTemplate = (p: TemplateParams) => unknown[];

const REGEX = /\{\s*([a-zA-Z0-9._/:-]+?)\s*\}/g;

export const compileTemplate = (template: string): CompiledTemplate => {
  const tokens = template.split(REGEX);

  // после выполнения split на нечетных местах стоят названия ключей
  return (p: TemplateParams) =>
    tokens.map((t, i) => (i % 2 ? (p ? p[t] : undefined) : t));
};
