import { Utils } from "../utils";
import { injectable } from "inversify-props";

export interface IFormModel {
  userName: string;
  firstName: string;
}

export interface IFormService {
  getData: () => Promise<IFormModel>;
  saveData: (model: IFormModel) => Promise<void>;
}

@injectable()
export default class FormService implements IFormService {
  public getData(): Promise<IFormModel> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({
        userName: "jmserrano",
        firstName: "José Manuel"
      }), 5000)
    });
  }

  public async saveData(model: IFormModel) {
    await Utils.sleep(300);
    window.alert(JSON.stringify(model));
  }
}
