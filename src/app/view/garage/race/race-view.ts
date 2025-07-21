import { getAllCars } from '../../../db/garage/getAllCars';
import { CarResponse } from '../../../db/garage/postCar';
import ElementCreator, { ElementParams } from '../../../util/element-creator';
import View from '../../../util/view-creator';
import CarLineView from './car-line-view';

export default class GarageRaceView extends View {
  private static carContainer: ElementCreator;
  private static carListCount: ElementCreator;
  private static pageNumberElement: ElementCreator;
  private static currentPage = 1;
  private static carsPerPage = 7;
  private static allCars: CarResponse[] = [];
  static totalCarsCount = 0;

  constructor() {
    const params: ElementParams = {
      tag: 'div',
      classNames: ['race'],
    };
    super(params);
  }

  async configureView() {
    await this.loadCarsData();
    this.renderPage();
  }

  private async loadCarsData() {
    const response = await getAllCars(GarageRaceView.currentPage, GarageRaceView.carsPerPage);
    GarageRaceView.allCars = response.cars;
    GarageRaceView.totalCarsCount = response.totalCount;
  }

  private renderPage() {
    // Clear existing content
    this.elementCreator.getElement()?.replaceChildren();

    // Render car count
    GarageRaceView.carListCount = new ElementCreator({
      tag: 'h2',
      classNames: ['title'],
      textContent: `Garage (${GarageRaceView.totalCarsCount})`,
    });
    this.elementCreator.addInnerElement(GarageRaceView.carListCount);

    // Render page number
    GarageRaceView.pageNumberElement = new ElementCreator({
      tag: 'h3',
      classNames: ['title'],
      textContent: `Page #${GarageRaceView.currentPage}`,
    });
    this.elementCreator.addInnerElement(GarageRaceView.pageNumberElement);

    // Create cars container
    GarageRaceView.carContainer = new ElementCreator({
      tag: 'ul',
      classNames: ['cars-list'],
    });
    this.elementCreator.addInnerElement(GarageRaceView.carContainer);

    // Render cars for current page
    this.renderCars();

    // Create and render pagination controls
    this.renderPaginationControls();
  }

  private renderPaginationControls() {
    const paginationControls = new ElementCreator({
      tag: 'div',
      classNames: ['pagination-controls'],
    });

    const prevButton = new ElementCreator({
      tag: 'button',
      classNames: ['button', 'prev-button'],
      textContent: 'Previous',
      callback: async () => {
        if (GarageRaceView.currentPage > 1) {
          GarageRaceView.currentPage--;
          await this.loadCarsData();
          this.renderPage();
        }
      },
    });

    const nextButton = new ElementCreator({
      tag: 'button',
      classNames: ['button', 'next-button'],
      textContent: 'Next',
      callback: async () => {
        const maxPage = Math.ceil(GarageRaceView.totalCarsCount / GarageRaceView.carsPerPage);
        if (GarageRaceView.currentPage < maxPage) {
          GarageRaceView.currentPage++;
          await this.loadCarsData();
          this.renderPage();
        }
      },
    });

    // Disable buttons when appropriate
    if (GarageRaceView.currentPage === 1) {
      prevButton.getElement()?.setAttribute('disabled', 'true');
    }

    const maxPage = Math.ceil(GarageRaceView.totalCarsCount / GarageRaceView.carsPerPage);
    if (GarageRaceView.currentPage >= maxPage) {
      nextButton.getElement()?.setAttribute('disabled', 'true');
    }

    paginationControls.addInnerElement(prevButton);
    paginationControls.addInnerElement(nextButton);
    this.elementCreator.addInnerElement(paginationControls);
  }

  private renderCars() {
    GarageRaceView.carContainer.getElement()?.replaceChildren();

    GarageRaceView.allCars.forEach((item: CarResponse) => {
      const carLine = new CarLineView(item);
      if (carLine.getElement()) {
        GarageRaceView.carContainer.addInnerElement(carLine.getElement());
      }
    });
  }
  public static async addCar(car: CarResponse) {
    // Add to the total count
    GarageRaceView.totalCarsCount++;

    // Check if we should add to current page
    const maxPage = Math.ceil(GarageRaceView.totalCarsCount / GarageRaceView.carsPerPage);
    if (
      GarageRaceView.currentPage === maxPage &&
      GarageRaceView.allCars.length < GarageRaceView.carsPerPage
    ) {
      GarageRaceView.allCars.push(car);
    }

    // Update the display
    GarageRaceView.carListCount.setTextContent(`Garage (${GarageRaceView.totalCarsCount})`);

    // Re-render if on the last page
    if (GarageRaceView.currentPage === maxPage) {
      GarageRaceView.carContainer.getElement()?.replaceChildren();
      GarageRaceView.allCars.forEach((item: CarResponse) => {
        const carLine = new CarLineView(item);
        if (carLine.getElement()) {
          GarageRaceView.carContainer.addInnerElement(carLine.getElement());
        }
      });
    }
  }

  public static async updateCarList() {
    const response = await getAllCars(GarageRaceView.currentPage, GarageRaceView.carsPerPage);
    GarageRaceView.allCars = response.cars;
    GarageRaceView.totalCarsCount = response.totalCount;

    // Update the display
    GarageRaceView.carListCount.setTextContent(`Garage (${GarageRaceView.totalCarsCount})`);
    GarageRaceView.pageNumberElement.setTextContent(`Page #${GarageRaceView.currentPage}`);

    // Re-render cars
    GarageRaceView.carContainer.getElement()?.replaceChildren();
    GarageRaceView.allCars.forEach((item: CarResponse) => {
      const carLine = new CarLineView(item);
      if (carLine.getElement()) {
        GarageRaceView.carContainer.addInnerElement(carLine.getElement());
      }
    });

    // Update pagination buttons state
    const prevButton = document.querySelector('.prev-button') as HTMLButtonElement;
    const nextButton = document.querySelector('.next-button') as HTMLButtonElement;

    if (prevButton) {
      prevButton.disabled = GarageRaceView.currentPage === 1;
    }

    if (nextButton) {
      const maxPage = Math.ceil(GarageRaceView.totalCarsCount / GarageRaceView.carsPerPage);
      nextButton.disabled = GarageRaceView.currentPage >= maxPage;
    }
  }
}
