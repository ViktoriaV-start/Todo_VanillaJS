import {FORM_CLASS_NAME, FORM_SELECTOR} from "@/config/constants";


export class Form {
  formContainer = document.querySelector(FORM_SELECTOR);
  content = null;

  constructor(content) {
    this.content = content;
    this._render();
    this._init();
  }

  _render() {
    this.formContainer.insertAdjacentHTML('afterbegin', this._markUp());
  }

  _markUp() {
    return `
      <form class="form">
        <input class="form__input"
               type="search"
               placeholder="Новая задача"
               autofocus
        >
        </input>
        <button class="form__btn" type="submit">Сохранить</button>   
      </form>
    `;
  }

  /* Получить данные формы после submit и вызвать метод addTodo экземпляра класса Content*/
  _handleSubmit(ev) {
    let textTodo = ev.target.elements[0].value;
    this.content.addTodo(textTodo);
    ev.target.elements[0].value ='';
  }

  /* Добавить addEventListener */
  _init() {
    this.formContainer.addEventListener( 'submit', ev => {
      ev.preventDefault();
      if (ev.target.classList.contains(FORM_CLASS_NAME)) {
        this._handleSubmit(ev);
      }
    });
  }
}
