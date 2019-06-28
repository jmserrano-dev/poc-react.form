import { unstable_createResource, Resource } from "react-cache";

interface ICreateResource {
  name: string;
  callback: Function;
}

export default class Utils {
  public static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static nameof<T>(name: keyof T) {
    return name;
  }

  public static nameofFactory = <T>() => (name: keyof T) => name;

  private static resources: Map<string, Resource<any,any>> = new Map<string, Resource<any,any>>();

  public static createResource<TIn, TOut>({ name, callback }: ICreateResource): Resource<TIn, TOut> {
    const exist = this.resources.has(name);
    if(!exist) this.resources.set(name, unstable_createResource<TIn, TOut>(() => callback()))

    return this.resources.get(name)!;
  }

  public static cleanResource() {
    this.resources.clear();
  }
}
