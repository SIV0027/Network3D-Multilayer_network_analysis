export type IClassAny<C, M extends keyof C> = {
  [K in M]: (...args: any[]) => any;
};