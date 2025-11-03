import { router } from './router/router.js';
import { dataService } from './services/dataService.js';
import { UserCard } from './components/userCard.js';
import { TodoItem } from './components/todoItem.js';
import { PostItem } from './components/postItem.js';
import { CommentItem } from './components/commentItem.js';
import { AddUserForm, showMessage } from './components/forms.js';
import { DOM } from './utils/dom.js';

// Главное приложение
class App {
    constructor() {
        this.state = {
            searchQuery: '',
            users: [],
            todos: [],
            posts: [],
            comments: [],
            showUserForm: false
        };
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadInitialData();
        
        // Инициализация роутера с функциями рендера
        router.init({
            users: (params) => this.renderUsersPage(params),
            todos: (params) => this.renderTodosPage(params),
            posts: (params) => this.renderPostsPage(params),
            comments: (params) => this.renderCommentsPage(params)
        });
    }

    setupEventListeners() {
        const searchBtn = DOM.find('#searchBtn');
        const searchInput = DOM.find('#searchInput');
        
        DOM.on(searchBtn, 'click', () => {
            this.state.searchQuery = searchInput.value.trim();
            this.handleSearch();
        });
        
        DOM.on(searchInput, 'keyup', (e) => {
            if (e.key === 'Enter') {
                this.state.searchQuery = searchInput.value.trim();
                this.handleSearch();
            }
        });
        
        // Дебаунс для поиска
        let searchTimeout;
        DOM.on(searchInput, 'input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.state.searchQuery = searchInput.value.trim();
                this.handleSearch();
            }, 300);
        });
    }

    async loadInitialData() {
        try {
            this.state.users = await dataService.getUsers();
            this.state.todos = await dataService.getTodos();
            this.state.posts = await dataService.getPosts();
            this.state.comments = await dataService.getComments();
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            showMessage('Ошибка загрузки данных', 'error');
        }
    }
handleSearch() {
        const currentPage = router.getCurrentPage();
        const params = router.getParams();
        
        switch (currentPage) {
            case 'users':
                this.renderUsersPage(params);
                break;
            case 'todos':
                this.renderTodosPage(params);
                break;
            case 'posts':
                this.renderPostsPage(params);
                break;
            case 'comments':
                this.renderCommentsPage(params);
                break;
        }
    }

    // Рендер страницы пользователей
    async renderUsersPage(params) {
        const content = DOM.find('#content');
        content.innerHTML = '';
        
        const title = DOM.create('h2', { 
            className: 'page-title',
            textContent: 'Пользователи'
        });
        
        const addUserBtn = DOM.create('button', { 
            className: 'btn btn-primary',
            textContent: 'Добавить пользователя',
            style: { marginBottom: '20px' }
        });
        
        DOM.on(addUserBtn, 'click', () => {
            this.state.showUserForm = true;
            this.renderUsersPage(params);
        });
        
        const usersGrid = DOM.create('div', { className: 'users-grid' });
        
        // Фильтрация пользователей
        let filteredUsers = this.state.users;
        if (this.state.searchQuery) {
            filteredUsers = dataService.searchUsers(this.state.users, this.state.searchQuery);
        }
        
        // Рендер карточек пользователей
        filteredUsers.forEach(user => {
            const userCard = UserCard(
                user,
                (userId) => router.navigateTo(users#todos?userId=${userId}),
                (userId) => router.navigateTo(users#posts?userId=${userId}),
                (userId) => this.handleDeleteUser(userId)
            );
            usersGrid.appendChild(userCard);
        });
        
        content.appendChild(title);
        content.appendChild(addUserBtn);
        
        // Показ формы добавления пользователя
        if (this.state.showUserForm) {
            const formContainer = AddUserForm(
                (name, email, todo) => this.handleAddUser(name, email, todo),
                () => {
                    this.state.showUserForm = false;
                    this.renderUsersPage(params);
                }
            );
            content.appendChild(formContainer);
        }
        
        content.appendChild(usersGrid);
    }
// Рендер страницы задач
    async renderTodosPage(params) {
        const content = DOM.find('#content');
        content.innerHTML = '';
        
        const userId = params.userId;
        let user = null;
        
        if (userId) {
            user = this.state.users.find(u => u.id == userId);
        }
        
        const titleText = user ? Задачи пользователя: ${user.name} : 'Все задачи';
        const title = DOM.create('h2', { 
            className: 'page-title',
            textContent: titleText
        });
        
        const todosList = DOM.create('div', { className: 'list' });
        
        // Получение и фильтрация задач
        let todos = await dataService.getTodos(userId);
        if (this.state.searchQuery) {
            todos = dataService.searchTodos(todos, this.state.searchQuery);
        }
        
        // Рендер задач
        todos.forEach(todo => {
            const todoItem = TodoItem(todo);
            todosList.appendChild(todoItem);
        });
        
        content.appendChild(title);
        content.appendChild(todosList);
    }

    // Рендер страницы постов
    async renderPostsPage(params) {
        const content = DOM.find('#content');
        content.innerHTML = '';
        
        const userId = params.userId;
        let user = null;
        
        if (userId) {
            user = this.state.users.find(u => u.id == userId);
        }
        
        const titleText = user ? Посты пользователя: ${user.name} : 'Все посты';
        const title = DOM.create('h2', { 
            className: 'page-title',
            textContent: titleText
        });
        
        const postsList = DOM.create('div', { className: 'list' });
        
        // Получение и фильтрация постов
        let posts = await dataService.getPosts(userId);
        if (this.state.searchQuery) {
            posts = dataService.searchPosts(posts, this.state.searchQuery);
        }
        
        // Рендер постов
        posts.forEach(post => {
            const postItem = PostItem(
                post,
                (postId) => router.navigateTo(users#posts#comments?postId=${postId})
            );
            postsList.appendChild(postItem);
        });
        
        content.appendChild(title);
        content.appendChild(postsList);
    }

    // Рендер страницы комментариев
    async renderCommentsPage(params) {
        const content = DOM.find('#content');
        content.innerHTML = '';
        
        const postId = params.postId;
        let post = null;
        
        if (postId) {
            post = this.state.posts.find(p => p.id == postId);
        }
        
        const titleText = post ? Комментарии к посту: ${post.title} : 'Все комментарии';
        const title = DOM.create('h2', { 
            className: 'page-title',
            textContent: titleText
        });
        
        const commentsList = DOM.create('div', { className: 'list' });
        
        // Получение и фильтрация комментариев
        let comments = await dataService.getComments(postId);
        if (this.state.searchQuery) {
            comments = dataService.searchComments(comments, this.state.searchQuery);
        }
        
        // Рендер комментариев
        comments.forEach(comment => {
            const commentItem = CommentItem(comment);
            commentsList.appendChild(commentItem);
        });
        
        content.appendChild(title);
        content.appendChild(commentsList);
    }

    // Обработчики действий
    async handleAddUser(name, email, todo) {
        try {
            await dataService.addUser(name, email, todo);
            this.state.users = await dataService.getUsers();
            this.state.showUserForm = false;
            showMessage(Пользователь ${name} успешно добавлен!);
            this.renderUsersPage(router.getParams());
        } catch (error) {
            console.error('Ошибка добавления пользователя:', error);
            showMessage('Ошибка добавления пользователя', 'error');
        }
    }
async handleDeleteUser(userId) {
        if (confirm('Удалить пользователя?')) {
            try {
                await dataService.deleteUser(userId);
                this.state.users = await dataService.getUsers();
                showMessage('Пользователь успешно удален!');
                this.renderUsersPage(router.getParams());
            } catch (error) {
                console.error('Ошибка удаления пользователя:', error);
                showMessage('Ошибка удаления пользователя', 'error');
            }
        }
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
