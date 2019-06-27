import { container } from "inversify-hooks";
import FormService, { IFormService } from "../services/formService";

export default class Ioc {
  public static containerBuilder(): void {
    container.addSingleton<IFormService>(FormService, "FormService");
  }
}
