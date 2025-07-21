import ElementCreator, { ElementParams } from './element-creator';

export default class View {
  protected elementCreator: ElementCreator;
  constructor(params: ElementParams) {
    this.elementCreator = this.createView(params);
    this.configureView();
  }
  createView(params: ElementParams) {
    const elementCreator = new ElementCreator(params);
    return elementCreator;
  }
  public getElement(): HTMLElement {
    return this.elementCreator.getElement()!;
  }

  public addInnerView(view: View): this {
    this.elementCreator.addInnerElement(view.getElement());
    return this;
  }

  //   public addInnerElement(element: HTMLElement | ElementCreator | null): void {
  //     if (element instanceof ElementCreator) {
  //       const creatorElement = element.getElement();
  //       if (creatorElement) {
  //         this.elementCreator.addInnerElement(creatorElement);
  //       }
  //     } else if (element instanceof HTMLElement) {
  //       this.elementCreator.addInnerElement(element);
  //     }
  //   }
  configureView() {}
}
