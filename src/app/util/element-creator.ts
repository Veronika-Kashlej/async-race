export interface ElementParams {
  tag: string;
  classNames: string[];
  textContent?: string;
  callback?: (event: Event) => void;
}
export default class ElementCreator {
  element: HTMLElement | null;
  constructor(param: ElementParams) {
    this.element = null;
    this.createElement(param);
    this.setCssClasses(param.classNames);
    this.setTextContent(param.textContent);
    this.setCallback(param.callback);
  }
  createElement(param: ElementParams) {
    this.element = document.createElement(param.tag);
  }
  getElement(): HTMLElement | null {
    return this.element;
  }
  addInnerElement(element: HTMLElement | ElementCreator | null) {
    if (element instanceof ElementCreator) {
      element = element.getElement();
      if (element) {
        this.element?.append(element);
      }
    } else if (element instanceof HTMLElement) {
      this.element?.append(element);
    }
  }
  setCssClasses(cssClasses: string[]) {
    cssClasses.forEach((className) => {
      if (this.element) {
        this.element.classList.add(className);
      }
    });
  }
  setTextContent(text?: string) {
    if (this.element && text) {
      this.element.textContent = text;
    }
  }
  setCallback(callback?: (event: Event) => void) {
    if (this.element && callback) {
      this.element.addEventListener('click', (event) => callback(event));
    }
  }
  setAttribute(name: string, value: string) {
    this.element?.setAttribute(name, value);
  }
  removeAttribute(name: string) {
    this.element?.removeAttribute(name);
  }
}
