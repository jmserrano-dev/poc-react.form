import { waitForElement, fireEvent } from "@testing-library/react";

export default class Testing {
    public static getFallbackElement(container: HTMLElement) {
        return container.querySelector('.loading');
    }
    
    public static async getInputByName<TModel>(propertyName: keyof TModel, container: HTMLElement) {
        return await Testing.wait(() => container.querySelector(`input[name='${propertyName}']`));
    }

    public static async clickSubmitButton(container: HTMLElement) {
        const input = await Testing.wait(() => container.querySelector(`button[type='submit']`));
        fireEvent.click(input);

        return input;
    }

    public static async changeInputByName<TModel>(propertyName: keyof TModel, container: HTMLElement, value: string | number | boolean) {
        const input = await Testing.getInputByName<TModel>(propertyName, container);
        fireEvent.change(input, {target : {value }});

        return input;
    }

    private static async wait(callback: Function){
        return await waitForElement(() => callback(), { timeout: 5000 });
    }
}