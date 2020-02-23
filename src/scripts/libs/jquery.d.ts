declare module "jquery" {
  const content: Function | object;
  export default content;
  function prop(): string | boolean;

  export interface Event<T extends HTMLElement>{
    target: T;
    currentTarget: T;
  }
}
