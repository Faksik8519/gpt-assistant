import { apiService } from './api.js';
import { Storage } from '../utils/storage.js';

// Сервис для работы с данными (API + localStorage)
class DataService {
    constructor() {
        this.localUsers = Storage.get('localUsers') || [];
        this.localTodos = Storage.get('localTodos') || [];
    }

    // Пользователи
    async getUsers() {
        const apiUsers = await apiService.getUsers();
        return [...apiUsers, ...this.localUsers.map(user => ({ ...user, isLocal: true }))];
    }

    async addUser(name, email, todo = '') {
        const maxId = Math.max(
            ...this.localUsers.map(u => u.id),
            ...(await apiService.getUsers()).map(u => u.id),
            0
        );
        
        const newUser = {
            id: maxId + 1,
            name,
            email,
            isLocal: true
        };
        
        this.localUsers.push(newUser);
        Storage.set('localUsers', this.localUsers);
        
        // Добавляем задачу, если она указана
        if (todo) {
            await this.addTodo(newUser.id, todo);
        }
        
        return newUser;
    }

    async deleteUser(userId) {
        this.localUsers = this.localUsers.filter(user => user.id !== userId);
        this.localTodos = this.localTodos.filter(todo => todo.userId !== userId);
        
        Storage.set('localUsers', this.localUsers);
        Storage.set('localTodos', this.localTodos);
        
        return true;
    }

    // Задачи
    async getTodos(userId = null) {
        const apiTodos = await apiService.getTodos();
        const allTodos = [...apiTodos, ...this.localTodos];
        
        if (userId) {
            return allTodos.filter(todo => todo.userId == userId);
        }
        
        return allTodos;
    }

    async addTodo(userId, title) {
        const maxId = Math.max(
            ...this.localTodos.map(t => t.id),
            ...(await apiService.getTodos()).map(t => t.id),
            0
        );
        
        const newTodo = {
            id: maxId + 1,
            userId: parseInt(userId),
            title,
            completed: false
        };
        
        this.localTodos.push(newTodo);
        Storage.set('localTodos', this.localTodos);
        
        return newTodo;
    }

    // Посты
    async getPosts(userId = null) {
        const posts = await apiService.getPosts();
        
        if (userId) {
            return posts.filter(post => post.userId == userId);
        }
        
        return posts;
    }

    // Комментарии
    async getComments(postId = null) {
        const comments = await apiService.getComments();
        
        if (postId) {
            return comments.filter(comment => comment.postId == postId);
        }
        
        return comments;
    }

    // Поиск
    searchUsers(users, query) {
        if (!query) return users;
        
        const lowerQuery = query.toLowerCase();
        return users.filter(user => 
            user.name.toLowerCase().includes(lowerQuery) || 
            user.email.toLowerCase().includes(lowerQuery)
        );
    }

    searchTodos(todos, query) {
        if (!query) return todos;
        
        const lowerQuery = query.toLowerCase();
        return todos.filter(todo => 
            todo.title.toLowerCase().includes(lowerQuery)
        );
    }

    searchPosts(posts, query) {
        if (!query) return posts;
        
        const lowerQuery = query.toLowerCase();
        return posts.filter(post => 
            post.title.toLowerCase().includes(lowerQuery) || 
            post.body.toLowerCase().includes(lowerQuery)
        );
    }

    searchComments(comments, query) {
        if (!query) return comments;
        
        const lowerQuery = query.toLowerCase();
        return comments.filter(comment => 
            comment.name.toLowerCase().includes(lowerQuery) || 
            comment.body.toLowerCase().includes(lowerQuery)
        );
    }
}

export const dataService = new DataService();