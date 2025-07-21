import { getCar } from '../../db/garage/getCar';
import { removeWinner } from '../../db/winner/deleteWinner';
import { getWinners } from '../../db/winner/getWinners';
import ElementCreator, { ElementParams } from '../../util/element-creator';
import View from '../../util/view-creator';
import './winner.css';
interface Car {
  id: number;
  name: string;
  color: string;
}

interface Winner {
  id: number;
  wins: number;
  time: number;
  car?: Car;
}
export default class WinnersView {
  elementCreator: ElementCreator;
  paginationElement: ElementCreator | null;
  private static winnerListCount: ElementCreator;
  private currentPage: number;
  private winnersPerPage: number = 10;
  private sortField: 'id' | 'wins' | 'time' = 'wins';
  private sortOrder: 'ASC' | 'DESC' = 'DESC';
  private winners: Winner[] = [];
  private totalWinners: number = 0;
  static totalWinnersCount = 0;
  constructor() {
    const params: ElementParams = {
      tag: 'main',
      classNames: ['main', 'winners'],
    };
    const savedPage = localStorage.getItem('currentPage');
    this.currentPage = savedPage ? parseInt(savedPage, 10) : 1;
    this.elementCreator = new ElementCreator(params);
    this.paginationElement = null;
    this.initialize();
  }
  public async initialize() {
    await this.loadWinners();
    this.configureView();
  }
  getElement(): HTMLElement {
    return this.elementCreator.getElement()!;
  }

  addInnerView(view: View): this {
    this.elementCreator.addInnerElement(view.getElement());
    return this;
  }
  configureView(): void {
    this.elementCreator.getElement()?.replaceChildren();
    WinnersView.winnerListCount = new ElementCreator({
      tag: 'h2',
      classNames: ['title'],
      textContent: `Winners (${WinnersView.totalWinnersCount})`,
    });
    this.elementCreator.addInnerElement(WinnersView.winnerListCount);
    const table = new ElementCreator({
      tag: 'table',
      classNames: ['winners-table'],
    });

    // Create table header
    const header = new ElementCreator({ tag: 'thead', classNames: ['header'] });
    const headerRow = new ElementCreator({ tag: 'tr', classNames: ['header-row'] });

    const columns = [
      { title: '№', sortable: false },
      { title: 'Car', sortable: false },
      { title: 'Name', sortable: false },
      { title: 'Wins', sortable: true, field: 'wins' },
      { title: 'Best Time (s)', sortable: true, field: 'time' },
    ];

    columns.forEach((col) => {
      const th = new ElementCreator({ tag: 'th', classNames: ['th'], textContent: col.title });
      if (col.sortable && col.field) {
        th.setCssClasses(['sortable']);
        const sortIcon = new ElementCreator({
          tag: 'span',
          classNames: ['sort-icon'],
          textContent: this.sortField === col.field ? (this.sortOrder === 'ASC' ? ' ↑' : ' ↓') : '',
        });
        th.addInnerElement(sortIcon);
        th.getElement()?.addEventListener('click', () => {
          if (this.sortField === col.field) {
            this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
          } else {
            this.sortField = col.field as 'wins' | 'time';
            this.sortOrder = 'ASC';
          }
          this.loadWinners().then(() => this.configureView());
        });
      }
      headerRow.addInnerElement(th);
    });

    header.addInnerElement(headerRow);
    table.addInnerElement(header);

    // Create table body
    const body = new ElementCreator({ tag: 'tbody', classNames: ['tbody'] });

    this.winners.forEach((winner, index) => {
      const row = new ElementCreator({ tag: 'tr', classNames: ['winner-row'] });
      const number = (this.currentPage - 1) * this.winnersPerPage + index + 1;

      const carColor = winner.car?.color || '#000000';
      const carName = winner.car?.name || 'Unknown';

      const cells = [
        { content: number.toString() },
        { content: this.renderCarImage(carColor) },
        { content: carName },
        { content: winner.wins.toString() },
        { content: winner.time.toFixed(2) },
      ];

      cells.forEach((cell) => {
        const td = new ElementCreator({
          tag: 'td',
          classNames: ['td'],
          textContent: cell.content,
        });
        if (typeof cell.content === 'string' && cell.content.startsWith('<svg')) {
          td.getElement()!.innerHTML = cell.content;
        }
        row.addInnerElement(td);
      });

      body.addInnerElement(row);
    });

    table.addInnerElement(body);
    this.elementCreator.addInnerElement(table);
    this.createPagination();
  }
  async loadWinners() {
    try {
      const { winners, totalCount } = await getWinners(
        this.currentPage,
        this.winnersPerPage,
        this.sortField,
        this.sortOrder,
      );
      WinnersView.totalWinnersCount = totalCount;
      // Fetch car details for each winner
      const winnersWithCars = await Promise.all(
        winners.map(async (winner: Winner) => {
          try {
            const car = await getCar(winner.id);
            return { ...winner, car };
          } catch (error) {
            console.error(`Error fetching car ${winner.id}:`, error);
            return { ...winner, car: null };
          }
        }),
      );

      this.winners = winnersWithCars;
      this.totalWinners = totalCount;
    } catch (error) {
      console.error('Error loading winners:', error);
      this.winners = [];
      this.totalWinners = 0;
    }
  }
  private renderCarImage(color: string): string {
    return `<svg width="40" height="20" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="80" height="20" rx="5" fill="${color}"/>
      <circle cx="25" cy="40" r="8" fill="#333"/>
      <circle cx="75" cy="40" r="8" fill="#333"/>
    </svg>`;
  }
  private createPagination(): void {
    if (this.paginationElement) {
      this.paginationElement.getElement()?.remove();
    }
    const totalPages = Math.ceil(this.totalWinners / this.winnersPerPage);
    if (totalPages <= 1) return;

    const pagination = new ElementCreator({
      tag: 'div',
      classNames: ['pagination'],
    });

    // Prev button
    const prevBtn = new ElementCreator({
      tag: 'button',
      classNames: ['pagination-btn'],
      textContent: '← Prev',
      callback: () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.loadWinners().then(() => this.configureView());
          localStorage.setItem('currentPage', this.currentPage.toString());
        }
      },
    });
    if (this.currentPage === 1) {
      prevBtn.getElement()?.setAttribute('disabled', 'true');
    }
    pagination.addInnerElement(prevBtn);

    // Page info
    const pageInfo = new ElementCreator({
      tag: 'span',
      classNames: ['page-info'],
      textContent: `Page ${this.currentPage} of ${totalPages}`,
    });
    pagination.addInnerElement(pageInfo);

    // Next button
    const nextBtn = new ElementCreator({
      tag: 'button',
      classNames: ['pagination-btn'],
      textContent: 'Next →',
      callback: () => {
        if (this.currentPage <= totalPages) {
          this.currentPage++;
          this.loadWinners().then(() => this.configureView());
          localStorage.setItem('currentPage', this.currentPage.toString());
        }
      },
    });
    if (this.currentPage === totalPages) {
      nextBtn.getElement()?.setAttribute('disabled', 'true');
    }
    pagination.addInnerElement(nextBtn);

    this.elementCreator.addInnerElement(pagination);
  }
}
