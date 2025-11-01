import { DOM } from '../utils/dom.js';

export const TodoItem = (todo) => {
    const item = DOM.create('div', { className: 'list-item' });
    
    const title = DOM.create('div', { 
        className: `list-title ${todo.completed ? 'completed' : ''}`,
        textContent: todo.title
    });
    
    const status = DOM.create('div', { 
        className: 'list-body',
        textContent: `Статус: ${todo.completed ? 'Выполнено' : 'Не выполнено'}`
    });
    
    item.appendChild(title);
    item.appendChild(status);
    
    return item;
};