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

export type Content = ReturnType<typeof text> | ReturnType<typeof count>;

export type Keyset<T extends string> = Record<T, Content>;
