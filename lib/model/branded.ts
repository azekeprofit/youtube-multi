declare const __brand: unique symbol;

export type Brand<T, B> = { [__brand]: B } & T;