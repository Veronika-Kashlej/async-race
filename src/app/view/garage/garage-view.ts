import ElementCreator, { ElementParams } from '../../util/element-creator';
import View from '../../util/view-creator';
import GarageFormView from './form-view';
import GarageNavView from './nav-view';
import GarageRaceView from './race/race-view';
import './styles/garage.css';

export default class GarageView extends View {
  constructor() {
    const params: ElementParams = {
      tag: 'main',
      classNames: ['main', 'garage'],
    };
    super(params);
  }
  configureView() {
    const title = new ElementCreator({
      tag: 'h1',
      classNames: ['title'],
      textContent: 'Async Race',
    });
    this.elementCreator.addInnerElement(title);

    const garageForm = new GarageFormView();
    this.addInnerView(garageForm);

    const garageRace = new GarageRaceView();
    this.addInnerView(garageRace);
  }
}
