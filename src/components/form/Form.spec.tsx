import * as React from "react";
import { decorate } from "inversify";
import { container as ioc, injectable } from "inversify-hooks";
import Form from "./Form";
import {
  IFormService,
  IFormModel,
  SERVICE_NAME
} from "../../services/formService";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { waitForElement } from "enzyme-async-helpers";

jest.mock("../../utils/useResource", () => {
  const useResource = ({
    identifier,
    callback
  }: {
    identifier: string;
    callback: () => Promise<void>;
  }) => {
    return {
      userName: "SERRANO",
      firstName: "José Manuel"
    };
  };
  return useResource;
});

describe("Form with suspense & ioc features", () => {
  const dataStub = {
    userName: "SERRANO",
    firstName: "José Manuel"
  };
  const saveDataMock = jest.fn();
  beforeAll(() => {
    class FormServiceStub implements IFormService {
      public getData(): Promise<IFormModel> {
        return Promise.resolve(dataStub);
      }
      public saveData = () => saveDataMock();
    }

    decorate(injectable(), FormServiceStub);
    ioc.addSingleton<IFormService>(FormServiceStub, SERVICE_NAME);
  });

  it("Should render & loading username / firstname inputs", async () => {
    const form = mount(<Form />);

    const userNameInput = form.find(`input[name='userName']`);
    const firstNameInput = form.find(`input[name='firstName']`);

    expect(userNameInput.props().value).toBe(dataStub.userName);
    expect(firstNameInput.props().value).toBe(dataStub.firstName);
  });

  it("Should not send the form information if form hasnt been changed", async () => {
    const form = mount(<Form />);

    form.find(`button[type='submit']`).simulate("click");

    expect(saveDataMock).toHaveBeenCalledTimes(0);
  });

  it("Should send the form information when an input is changed", async () => {
      const userNameChanged = "jmserrano";

      const form = mount(<Form />);

      form
        .find(`input[name='userName']`)
        .simulate("change", { target: { value: userNameChanged } });
      const usernameInputChanged = form.find(`input[name='userName']`);

      form.find(`button[type='submit']`).simulate("submit");

      expect(usernameInputChanged.props().value).toBe(userNameChanged);
      expect(saveDataMock).toHaveBeenCalledTimes(1);
  });
});
