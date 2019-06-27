import * as React from 'react';
import { render } from '@testing-library/react';
import Form from './Form';
import { IFormService, IFormModel } from '../../services/formService';
import { container as ioc, injectable } from "inversify-hooks";
import { Testing } from '../../utils';
import { decorate } from 'inversify';
import { Loading } from '../../components/loading';

describe('Form with suspense & ioc features', () => {
    const saveDataMock = jest.fn();
    const dataStub = {
        userName: "SERRANO",
        firstName: "José Manuel"
    };
    
    beforeAll(() => {
        class FormServiceStub implements IFormService {
            public getData(): Promise<IFormModel> {
                return Promise.resolve(dataStub);
            };
            public saveData = () => saveDataMock();
        }

        decorate(injectable(), FormServiceStub);
        ioc.addSingleton<IFormService>(FormServiceStub, "FormService");
    });

    it('Should render & loading username / firstname inputs', async () => {
        const { container } = render(
            <React.Suspense fallback={<Loading />}>
                <Form />
            </React.Suspense>
        );
        
        const fallbackElementBefore = Testing.getFallbackElement(container);
        const usernameInput = await Testing.getInputByName<IFormModel>("userName", container);
        const firstNameInput = await Testing.getInputByName<IFormModel>("firstName", container);
        const fallbackElementAfter = Testing.getFallbackElement(container);

        expect(fallbackElementBefore).not.toBeNull();
        expect(fallbackElementAfter).toBeNull();
        expect(usernameInput.value).toBe(dataStub.userName);
        expect(firstNameInput.value).toBe(dataStub.firstName);
    });

    it('Should not send the form information if form hasnt been changed', async () => {
        const { container } = render(
            <React.Suspense fallback={<Loading />}>
                <Form />
            </React.Suspense>
        );

        await Testing.clickSubmitButton(container);

        expect(saveDataMock).toHaveBeenCalledTimes(0);
    });

    it('Should send the form information when an input is changed', async () => {
        const userNameChanged = 'jmserrano';

        const { container, debug } = render(
            <React.Suspense fallback={<Loading />}>
                <Form />
            </React.Suspense>
        );

        const usernameInput = await Testing.changeInputByName<IFormModel>("userName", container, userNameChanged);
        await Testing.clickSubmitButton(container);

        expect(usernameInput.value).toBe(userNameChanged);
        expect(saveDataMock).toHaveBeenCalledTimes(1);
    });
});