import { INPUT_SELECTOR, TODO_SELECTOR } from "@/config/constants";

export class Todo {
  rendered = false;

  constructor(item) {
    this.todoText = this._checkInput(item.todoText);
    this.id = item.id;
    this.completed = item.completed;
  }

  completeTodo() {
    this.completed = !this.completed;
    const todo = document.querySelector(`${TODO_SELECTOR}[data-id="${this.id}"]`);
    const input = document.querySelector(`${INPUT_SELECTOR}[data-id="${this.id}"]`);

    if(this.completed) {
      input.classList.add('bggray', 'line');
      todo.classList.add('bggray');
      this.rendered = false;
    } else {
      input.classList.remove('bggray', 'line');
      todo.classList.remove('bggray');
    }
  }

  updateText(text) {
    this.todoText = this._checkInput(text);
  }

  _checkInput(value) {
    let checkedValue = value.trim().slice(0, 255);
    if(!checkedValue) return checkedValue = '';

    checkedValue = checkedValue.replace(/[><]/g, '');
    checkedValue = checkedValue.replace(/script/g, '');
    return(checkedValue);
  }

  toggleTodoColor(value) {
    const todo = document.querySelector(`${TODO_SELECTOR}[data-id="${this.id}"]`);
    const input = document.querySelector(`${INPUT_SELECTOR}[data-id="${this.id}"]`);
    if (value === 'color') {
      input.classList.add('colored');
      todo.classList.add('colored');
    }
    if (value === 'colorless') {
      input.classList.remove('colored');
      todo.classList.remove('colored');
    }
  }

  markUp() {

    this.rendered = true;
    return `

      <div class="${this.completed ? "content__item bggray" : "content__item"}"
           data-id="${this.id}"
      >
        <label class="content__label">
          <input type="checkbox"
                 data-id="${this.id}"
                 class="content__checkbox"
                 ${this.completed ? 'checked' : '' }
                 >
          <div class="fake-chb"></div>
        </label>       
        
        <form class="content__form" type="submit" data-id="${this.id}">
        <input
               class="${this.completed ? "content__text bggray line" : "content__text"}"
               data-id="${this.id}"
               value="${this.todoText}"
        >
        </form>
        <button class="content__btn" data-id="${this.id}">-</button>
      </div>
    `;
  }
}
