import GarageView from './view/garage/garage-view';
import GarageNavView from './view/garage/nav-view';
import WinnersView from './view/winners/winners-view';

export default class App {
  constructor() {
    this.createAppStructure();
  }
  private createAppStructure(): void {
    //Create main container
    const contentContainer = document.createElement('div');
    contentContainer.id = 'content-container';
    document.body.appendChild(contentContainer);

    //Create navigation
    const navView = new GarageNavView();
    document.body.insertBefore(navView.getElement(), contentContainer);

    //Initialize views
    const garageView = new GarageView();
    const winnersView = new WinnersView();

    //Add views to the DOM, but hide winners
    contentContainer.appendChild(garageView.getElement());
    contentContainer.appendChild(winnersView.getElement());
    winnersView.getElement().style.display = 'none';
  }
}
