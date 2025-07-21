import ElementCreator, { ElementParams } from './element-creator';
export interface InputParams extends ElementParams {
  type?: string;
  placeholder?: string;
  value?: string;
  attributes?: Record<string, string>;
}

export default class InputCreator extends ElementCreator {
  constructor(params: InputParams) {
    const defaultParams: InputParams = {
      tag: 'input',
      classNames: ['input'],
    };
    super(defaultParams);
    this.configureInput(params);
  }
  configureInput(params: InputParams) {
    const inputElement = this.getElement();
    if (inputElement && inputElement instanceof HTMLInputElement) {
      if (params.type) {
        inputElement.type = params.type;
      }
      if (params.placeholder) {
        inputElement.placeholder = params.placeholder;
      }
      if (params.value) {
        inputElement.value = params.value;
      }
    }
  }
  getValue(): string {
    const inputElement = this.getElement();
    if (inputElement && inputElement instanceof HTMLInputElement) {
      return inputElement.value;
    }
    return '';
  }
  setValue(value: string) {
    const inputElement = this.getElement();
    if (inputElement && inputElement instanceof HTMLInputElement) {
      inputElement.value = value;
    }
  }
}
