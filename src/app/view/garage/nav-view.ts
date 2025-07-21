import ElementCreator, { ElementParams } from '../../util/element-creator';
import View from '../../util/view-creator';
import WinnersView from '../winners/winners-view';
import GarageView from './garage-view';
import './styles/nav.css';
export default class GarageNavView extends View {
  garageView: GarageView | null = null;
  winnersView: WinnersView | null = null;
  constructor() {
    const params: ElementParams = {
      tag: 'div',
      classNames: ['nav'],
    };
    super(params);
  }
  configureView(): void {
    const garageBtn = new ElementCreator({
      tag: 'button',
      classNames: ['button'],
      textContent: 'Garage',
      callback: () => this.showGarage(),
    });
    this.elementCreator.addInnerElement(garageBtn);

    const winnersBtn = new ElementCreator({
      tag: 'button',
      classNames: ['button'],
      textContent: 'Winners',
      callback: () => this.showWinners(),
    });
    this.elementCreator.addInnerElement(winnersBtn);
  }
  showGarage() {
    const garage: HTMLElement | null = document.querySelector('.main.garage');
    const winners: HTMLElement | null = document.querySelector('.main.winners');
    if (garage && winners) {
      winners.style.display = 'none';
      garage.style.display = 'block';
    }
  }
  showWinners() {
    const garage: HTMLElement | null = document.querySelector('.main.garage');
    const winners: HTMLElement | null = document.querySelector('.main.winners');
    winners?.remove();
    const newWinners = new WinnersView();
    document.body.appendChild(newWinners.getElement());
    if (garage && winners) {
      garage.style.display = 'none';
      newWinners.getElement().style.display = 'block';
    }
  }
}
