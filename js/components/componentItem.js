import { DOM } from '../utils/dom.js';

export const CommentItem = (comment) => {
    const item = DOM.create('div', { className: 'list-item' });
    
    const name = DOM.create('div', { 
        className: 'list-title',
        textContent: comment.name
    });
    
    const email = DOM.create('div', { 
        className: 'user-email',
        textContent: comment.email
    });
    
    const body = DOM.create('div', { 
        className: 'list-body',
        textContent: comment.body
    });
    
    item.appendChild(name);
    item.appendChild(email);
    item.appendChild(body);
    
    return item;
};