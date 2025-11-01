import { DOM } from '../utils/dom.js';

export const PostItem = (post, onCommentsClick) => {
    const item = DOM.create('div', { className: 'list-item' });
    
    const title = DOM.create('div', { 
        className: 'list-title',
        textContent: post.title
    });
    
    const body = DOM.create('div', { 
        className: 'list-body',
        textContent: post.body
    });
    
    const actions = DOM.create('div', { className: 'user-actions' });
    const commentsBtn = DOM.create('button', { 
        className: 'btn btn-primary',
        textContent: 'Комментарии'
    });
    
    DOM.on(commentsBtn, 'click', () => onCommentsClick(post.id));
    
    actions.appendChild(commentsBtn);
    
    item.appendChild(title);
    item.appendChild(body);
    item.appendChild(actions);
    
    return item;
};