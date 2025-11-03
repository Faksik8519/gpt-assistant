import { DOM } from '../utils/dom.js';

export const AddUserForm = (onSubmit, onCancel) => {
    const formContainer = DOM.create('div', { className: 'form-container' });
    
    const title = DOM.create('h3', { 
        className: 'form-title',
        textContent: 'Добавить пользователя'
    });
    
    const nameGroup = DOM.create('div', { className: 'form-group' });
    const nameLabel = DOM.create('label', { 
        className: 'form-label',
        textContent: 'Имя',
        for: 'userName'
    });
    const nameInput = DOM.create('input', { 
        className: 'form-input',
        type: 'text',
        id: 'userName',
        placeholder: 'Введите имя пользователя'
    });
    
    const emailGroup = DOM.create('div', { className: 'form-group' });
    const emailLabel = DOM.create('label', { 
        className: 'form-label',
        textContent: 'Email',
        for: 'userEmail'
    });
    const emailInput = DOM.create('input', { 
        className: 'form-input',
        type: 'email',
        id: 'userEmail',
        placeholder: 'Введите email пользователя'
    });
    
    const todoGroup = DOM.create('div', { className: 'form-group' });
    const todoLabel = DOM.create('label', { 
        className: 'form-label',
        textContent: 'Задача',
        for: 'userTodo'
    });
    const todoInput = DOM.create('input', { 
        className: 'form-input',
        type: 'text',
        id: 'userTodo',
        placeholder: 'Введите задачу для пользователя'
    });
    
    const actions = DOM.create('div', { className: 'form-actions' });
    const submitBtn = DOM.create('button', { 
        className: 'btn btn-primary',
        textContent: 'Добавить'
    });
    const cancelBtn = DOM.create('button', { 
        className: 'btn',
        textContent: 'Отмена'
    });
    
    // Обработчики для кнопок
    DOM.on(submitBtn, 'click', () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const todo = todoInput.value.trim();
        
        if (!name || !email) {
            showMessage('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        onSubmit(name, email, todo);
        
        // Очистка формы
        nameInput.value = '';
        emailInput.value = '';
        todoInput.value = '';
    });
    
    DOM.on(cancelBtn, 'click', onCancel);
    
    // Сборка формы
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);
    
    emailGroup.appendChild(emailLabel);
    emailGroup.appendChild(emailInput);
    
    todoGroup.appendChild(todoLabel);
    todoGroup.appendChild(todoInput);
    
    actions.appendChild(submitBtn);
    actions.appendChild(cancelBtn);
    
    formContainer.appendChild(title);
    formContainer.appendChild(nameGroup);
    formContainer.appendChild(emailGroup);
    formContainer.appendChild(todoGroup);
    formContainer.appendChild(actions);
    
    return formContainer;
};

export const showMessage = (text, type = 'success') => {
    const message = DOM.create('div', {
        className: message message-${type},
        textContent: text
    });
    
    const content = DOM.find('#content');
    if (content) {
        content.prepend(message);
        
        // Автоматическое скрытие сообщения
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
};
