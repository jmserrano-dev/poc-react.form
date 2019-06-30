export default class Utils {
  public static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static nameof<T>(name: keyof T) {
    return name;
  }

  public static nameofFactory = <T>() => (name: keyof T) => name;
}
