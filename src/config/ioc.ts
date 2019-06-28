import { container } from "inversify-hooks";
import FormService, { IFormService, SERVICE_NAME } from "../services/formService";

export default class Ioc {
  public static containerBuilder(): void {
    container.addSingleton<IFormService>(FormService, SERVICE_NAME);
  }
}
