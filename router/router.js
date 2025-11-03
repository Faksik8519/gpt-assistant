import { DOM } from '../utils/dom.js';

// Роутер приложения
class Router {
    constructor() {
        this.routes = {
            'users': this.renderUsersPage,
            'todos': this.renderTodosPage,
            'posts': this.renderPostsPage,
            'comments': this.renderCommentsPage
        };
        
        this.currentPage = 'users';
        this.params = {};
    }

    init(renderFunctions) {
        this.renderFunctions = renderFunctions;
        this.setupEventListeners();
        this.handleRouteChange();
    }

    setupEventListeners() {
        DOM.on(window, 'hashchange', () => this.handleRouteChange());
    }

    handleRouteChange() {
        const hash = window.location.hash.substring(1);
        this.parseHash(hash);
        this.updateNavigation();
        this.renderBreadcrumbs();
        
        if (this.renderFunctions[this.currentPage]) {
            this.renderFunctions[this.currentPage](this.params);
        }
    }

    parseHash(hash) {
        if (!hash || hash === 'users') {
            this.currentPage = 'users';
            this.params = {};
            return;
        }

        const parts = hash.split('#');
        this.currentPage = parts[parts.length - 1].split('?')[0];
        
        // Парсинг параметров из URL
        const urlParams = new URLSearchParams(hash.split('?')[1]);
        this.params = Object.fromEntries(urlParams.entries());
    }

    updateNavigation() {
        const navLinks = DOM.findAll('.nav-link');
        const currentHash = window.location.hash;
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    renderBreadcrumbs() {
        const breadcrumbs = DOM.find('#breadcrumbs');
        if (!breadcrumbs) return;
        
        breadcrumbs.innerHTML = '';
        
        const pages = {
            'users': 'Пользователи',
            'todos': 'Задачи',
            'posts': 'Посты',
            'comments': 'Комментарии'
        };
        
        const hash = window.location.hash.substring(1);
        
        // Добавляем главную страницу
        const homeItem = DOM.create('li');
        const homeLink = DOM.create('a', { 
            href: '#users',
            textContent: 'Главная'
        });
        homeItem.appendChild(homeLink);
        breadcrumbs.appendChild(homeItem);
        
        // Обрабатываем текущую страницу
        if (this.currentPage !== 'users') {
            const pageParts = hash.split('#');
            
            for (let i = 1; i < pageParts.length; i++) {
                const pageKey = pageParts[i].split('?')[0];
                const pageName = pages[pageKey];
                
                if (pageName) {
                    const pageItem = DOM.create('li');
                    
                    // Для последнего элемента не делаем ссылку
                    if (i === pageParts.length - 1) {
                        pageItem.textContent = pageName;
                    } else {
                        const pageLink = DOM.create('a', { 
                            href: #${pageParts.slice(0, i + 1).join('#')},
                            textContent: pageName
                        });
                        pageItem.appendChild(pageLink);
                    }
                    
                    breadcrumbs.appendChild(pageItem);
                }
            }
        }
    }

    navigateTo(path) {
        window.location.hash = path;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getParams() {
        return this.params;
    }
}

export const router = new Router();
