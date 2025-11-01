import { DOM } from '../utils/dom.js';

export const UserCard = (user, onTodosClick, onPostsClick, onDeleteClick) => {
    const card = DOM.create('div', { className: 'user-card' });
    
    const name = DOM.create('div', { className: 'user-name', textContent: user.name });
    const email = DOM.create('div', { className: 'user-email', textContent: user.email });
    const actions = DOM.create('div', { className: 'user-actions' });
    
    // Кнопки действий
    const todosBtn = DOM.create('button', { 
        className: 'btn btn-primary',
        textContent: 'Задачи'
    });
    
    const postsBtn = DOM.create('button', { 
        className: 'btn btn-primary',
        textContent: 'Посты'
    });
    
    // Обработчики для кнопок
    DOM.on(todosBtn, 'click', () => onTodosClick(user.id));
    DOM.on(postsBtn, 'click', () => onPostsClick(user.id));
    
    actions.appendChild(todosBtn);
    actions.appendChild(postsBtn);
    
    // Показываем кнопку удаления только для локальных пользователей
    if (user.isLocal) {
        const deleteBtn = DOM.create('button', { 
            className: 'btn btn-danger',
            textContent: 'Удалить'
        });
        DOM.on(deleteBtn, 'click', () => onDeleteClick(user.id));
        actions.appendChild(deleteBtn);
    }
    
    card.appendChild(name);
    card.appendChild(email);
    card.appendChild(actions);
    
    return card;
};