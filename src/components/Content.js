import {
  CONTENT_FORM_CLASS_NAME,
  CONTENT_SELECTOR,
  INITIAL_TODO_ARRAY, TEXT_SELECTOR,
  TODO_SELECTOR
} from "@/config/constants";
import { Todo } from "@models/Todo";
import { controlButtons } from "@/components/controlButtons";

const DELETE_CLASS_NAME = 'content__btn';
const CHECKBOX_CLASS_NAME = 'content__checkbox';


export class Content {

  contentContainer = document.querySelector(CONTENT_SELECTOR);
  oddColored = false;
  evenColored = false;

  todos = [];

  constructor() {
    this._getTodos();
    this._renderBtns();
    this._init();
  }

/* Получить данные из localStorage, распарсить и передать дальше. Если хранилище пустое - поместить начальный вариант */
  _getTodos() {
    let data = localStorage.getItem('todos');

    if (!data) {
      localStorage.setItem('todos', JSON.stringify(INITIAL_TODO_ARRAY));
      data = localStorage.getItem('todos');
    }

    this._handleData(JSON.parse(data));
  }

/* Получить массив заметок, создать newTodo для каждого элемента и поместить в массив this.todos, вызвать рендер */
  _handleData(data) {
    data.map(item => {
      this.todos.push(new Todo(item));
    });
    this._render();
  }

  _renderBtns() {
    this.contentContainer.insertAdjacentHTML('afterbegin', controlButtons);
  }

  _render() {
    for (let item of this.todos) {
      if(item.rendered) {
        continue;
      }
      this.contentContainer.insertAdjacentHTML('beforeend', item.markUp(this.todos.indexOf(item)));
    }
  }

/* Рендер заметки в конце списка заметок */
  _renderBottom(todo) {
    if(!todo.rendered) {
      this.contentContainer.insertAdjacentHTML('beforeend', todo.markUp(this.todos.indexOf(todo)));
    }
  }

/* Удалить разметку одной заметки по id */
  _removeMarkUp(id) {
    document.querySelector(`${TODO_SELECTOR}[data-id="${id}"]`).remove();
  }

/* Find in this.todos and return one todoItem */
  _getOneTodo(id) {
    return this.todos.find(el => el.id === id);
  }

/* Set updated todos list to localStorage */
  _setTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  _deleteTodo(ev) {
    const id = +ev.target.dataset['id'];
    this._removeMarkUp(id);
    const todo = this._getOneTodo(id);
    this.todos.splice(this.todos.indexOf(todo), 1);
    this._setTodos();
    this._checkColor();
  }

  _updateTodoComplete(ev) {
    const id = +ev.target.dataset['id'];
    const todo = this._getOneTodo(id);
    todo.completeTodo();

    if(todo.completed) {
      this.todos = this.todos.filter(elem => elem.id !== todo.id);
      this.todos.push(todo);
      this._setTodos();
      this._removeMarkUp(id);
      this._renderBottom(todo);
    }
    this._checkColor();
  }

  _updateTodoText(ev) {
    let newText = ev.target.elements[0].value;
    const id = +ev.target.dataset['id'];
    const todo = this._getOneTodo(id);
    todo.updateText(newText);
    this._setTodos();
  }

  _deleteLast() {
    this._removeMarkUp(this.todos[this.todos.length-1].id);
    this.todos.pop();
    this._setTodos();
    this._checkColor();
  }

  _deleteFirst() {
    this._removeMarkUp(this.todos[0].id);
    this.todos.shift();
    this._setTodos();
    this._checkColor();
  }

/* Переключение темы */
  _toggleColor(theme) {
    if (theme === 'even') {
      this.evenColored = !this.evenColored;
      this._checkColor();
    }

    if (theme === 'odd') {
      this.oddColored = !this.oddColored;
      this._checkColor();
    }
  }

/* Установить стили после изменения темы для четных/нечетных или изменения порядка в массиве this.todos */
  _checkColor() {
    if (this.evenColored) {
      this.todos.forEach((item, idx) => {
        if (!((idx+1)&1)) {
          item.toggleTodoColor('color');
        }
      });
    } else {
      this.todos.forEach((item, idx) => {
        if (!((idx+1)&1)) {
          item.toggleTodoColor('colorless');
        }
      });
    }

    if (this.oddColored) {
      this.todos.forEach((item, idx) => {
        if ((idx+1)&1) {
          item.toggleTodoColor('color');
        }
      });
    } else {
      this.todos.forEach((item, idx) => {

        if ((idx+1)&1) {
          item.toggleTodoColor('colorless');
        }
      });
    }
  }

  /* Добавить новую заметку */
  addTodo(text) {
    const newTodo = new Todo({
      id: this._getMaxId()+1,
      todoText: text,
      completed: false
    });
    this._handleData([newTodo]);
    this._setTodos();
  }

  _getMaxId() {
    const id = this.todos.reduce((acc, item) => acc > item.id ? acc : item.id, 0);
    return(+id);
  }

/* Добавить addEventListener */
  _init() {
    this.contentContainer.addEventListener('click', ev => {
      if (ev.target.classList.contains(DELETE_CLASS_NAME)) {
        this._deleteTodo(ev);
      }

      if (ev.target.classList.contains(CHECKBOX_CLASS_NAME)) {
        this._updateTodoComplete(ev);
      }

      if (ev.target.getAttribute('data-role') === 'delete-last') {
        this._deleteLast();
      }

      if (ev.target.getAttribute('data-role') === 'delete-first') {
        this._deleteFirst();
      }

      if (ev.target.getAttribute('data-role') === 'toggle-even') {
        this._toggleColor('even');
      }

      if (ev.target.getAttribute('data-role') === 'toggle-odd') {
        this._toggleColor('odd');
      }

    });

    this.contentContainer.addEventListener( 'submit', ev => {
      ev.preventDefault();
      if (ev.target.classList.contains(CONTENT_FORM_CLASS_NAME)) {
        this._updateTodoText(ev);
      }
    });


  }
}