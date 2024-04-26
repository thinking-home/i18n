export type PluralForm = ReturnType<Intl.PluralRules["select"]>;

export const text = (content: string) =>
  ({
    type: "plain",
    content,
  } as const);

export const count = (content: Partial<Record<PluralForm, string>>) =>
  ({
    type: "plural",
    content,
  } as const);

export type PlainContent = ReturnType<typeof text>;
export type PluralContent = ReturnType<typeof count>;
export type Content = PlainContent | PluralContent;

export type Params<T extends Content["type"]> = T extends "plural"
  ? { count: number }
  : { [key: string]: unknown };

export type Keyset = Record<string, Content>;
