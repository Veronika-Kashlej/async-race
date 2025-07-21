import { CarResponse, postCar } from '../../db/garage/postCar';
import { updateCar } from '../../db/garage/updateCar';
import ElementCreator, { ElementParams } from '../../util/element-creator';
import InputCreator from '../../util/input-creator';
import View from '../../util/view-creator';
import CarLineView from './race/car-line-view';
import GarageRaceView from './race/race-view';
import './styles/form.css';
export default class GarageFormView extends View {
  static inputNameUpdate: InputCreator;
  static inputColorUpdate: InputCreator;
  static winnerCar: CarResponse | null = null;
  static isRace: boolean = false;
  constructor() {
    const params: ElementParams = {
      tag: 'form',
      classNames: ['form'],
    };
    super(params);
  }
  configureView(): void {
    this.configureCreateForm();
    this.configureUpdateForm();
    this.configureBtnsForm();
  }
  private configureCreateForm() {
    const container = new ElementCreator({ tag: 'div', classNames: ['div'] });
    this.elementCreator.addInnerElement(container);
    const inputText = new InputCreator({
      tag: 'input',
      classNames: ['input'],
      type: 'text',
      placeholder: 'Enter car name',
    });
    container.addInnerElement(inputText);

    const inputColor = new InputCreator({
      tag: 'input',
      classNames: ['input'],
      type: 'color',
      value: '000000',
    });
    container.addInnerElement(inputColor);

    const createCarBtn = new ElementCreator({
      tag: 'button',
      classNames: ['button'],
      textContent: 'Create new car',
      callback: async (event) => {
        event.preventDefault();
        const carData = {
          name: inputText.getValue(),
          color: inputColor.getValue(),
        };
        const car = await postCar(carData);
        GarageRaceView.addCar(car);
        inputColor.setValue('');
        inputText.setValue('');
      },
    });
    container.addInnerElement(createCarBtn);
  }
  private configureUpdateForm() {
    const container = new ElementCreator({ tag: 'div', classNames: ['div'] });
    this.elementCreator.addInnerElement(container);
    GarageFormView.inputNameUpdate = new InputCreator({
      tag: 'input',
      classNames: ['input'],
      type: 'text',
      placeholder: 'Enter new car name',
    });
    container.addInnerElement(GarageFormView.inputNameUpdate);

    GarageFormView.inputColorUpdate = new InputCreator({
      tag: 'input',
      classNames: ['input'],
      type: 'color',
      value: '000000',
    });
    container.addInnerElement(GarageFormView.inputColorUpdate);

    const updateCarBtn = new ElementCreator({
      tag: 'button',
      classNames: ['button'],
      textContent: 'Update car',
      callback: (event) => {
        event.preventDefault();
        const updatedCar = {
          name: GarageFormView.inputNameUpdate.getValue(),
          color: GarageFormView.inputColorUpdate.getValue(),
          id: CarLineView.selectedCarId,
        };
        updateCar(updatedCar);
        const carName = CarLineView.selectedCarElement
          .getElement()
          ?.querySelector('span') as HTMLSpanElement;
        if (carName) {
          carName.textContent = updatedCar.name;
        }
        const svgElement = CarLineView.selectedCarElement.getElement()?.querySelector('svg');
        if (svgElement) {
          const paths = svgElement.querySelectorAll('path');
          paths.forEach((path) => {
            path.style.fill = updatedCar.color;
          });
        }
        this.clearInputs();
      },
    });
    container.addInnerElement(updateCarBtn);
  }
  private configureBtnsForm() {
    const container = new ElementCreator({ tag: 'div', classNames: ['div'] });
    this.elementCreator.addInnerElement(container);
    const raceBtn = new ElementCreator({
      tag: 'button',
      classNames: ['button'],
      textContent: 'Race',
      callback: (event) => {
        event.preventDefault();
        GarageFormView.isRace = true;
        this.startAllCars();
      },
    });
    container.addInnerElement(raceBtn);
    const resetBtn = new ElementCreator({
      tag: 'button',
      classNames: ['button'],
      textContent: 'Reset',
      callback: (event) => {
        event.preventDefault();
        GarageFormView.isRace = false;
        this.stopAllCars();
      },
    });
    container.addInnerElement(resetBtn);
    const generateCarsBtn = new ElementCreator({
      tag: 'button',
      classNames: ['button', 'generate'],
      textContent: 'Generate cars',
      callback: (event) => {
        event.preventDefault();
        this.generateCars();
      },
    });
    container.addInnerElement(generateCarsBtn);
  }
  startAllCars() {
    GarageFormView.winnerCar = null;
    const carsStartBtns = document.querySelectorAll('.button.start');
    carsStartBtns.forEach((btn) => {
      if (btn instanceof HTMLButtonElement) btn.click();
    });
  }
  stopAllCars() {
    const carsStopBtns = document.querySelectorAll('.button.stop');
    carsStopBtns.forEach((btn) => {
      if (btn instanceof HTMLButtonElement) btn.click();
    });
  }
  clearInputs() {
    GarageFormView.inputNameUpdate.setValue('');
    GarageFormView.inputColorUpdate.setValue('');
  }
  async generateCars() {
    for (let i = 0; i < 100; i++) {
      const carData = {
        name: this.getRandomName(),
        color: this.getRandomColor(),
      };
      postCar(carData);
    }
    GarageRaceView.updateCarList();
  }
  getRandomName() {
    enum CarBrand {
      TESLA = 'Tesla',
      FORD = 'Ford',
      BMW = 'BMW',
      AUDI = 'Audi',
      TOYOTA = 'Toyota',
      HONDA = 'Honda',
      MERCEDES = 'Mercedes',
      CHEVROLET = 'Chevrolet',
      NISSAN = 'Nissan',
      VOLKSWAGEN = 'Volkswagen',
    }

    enum CarModel {
      MODEL_S = 'Model S',
      MUSTANG = 'Mustang',
      X5 = 'X5',
      A4 = 'A4',
      CAMRY = 'Camry',
      CIVIC = 'Civic',
      C_CLASS = 'C-Class',
      CAMARO = 'Camaro',
      ALTIMA = 'Altima',
      GOLF = 'Golf',
    }
    const carBrands = Object.values(CarBrand);
    const carModels = Object.values(CarModel);

    const randomBrand = carBrands[Math.floor(Math.random() * carBrands.length)];
    const randomModel = carModels[Math.floor(Math.random() * carModels.length)];

    return `${randomBrand} ${randomModel}`;
  }
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
