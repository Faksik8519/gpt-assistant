// Сервис для работы с API
class ApiService {
    constructor() {
        this.baseUrl = 'https://jsonplaceholder.typicode.com';
        this.requestDelay = 200; // Задержка между запросами для избежания лимитов
    }

    async request(endpoint) {
        // Имитация задержки для избежания лимитов API
        await new Promise(resolve => setTimeout(resolve, this.requestDelay));
        
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Ошибка при запросе к ${endpoint}:`, error);
            throw error;
        }
    }

    async getUsers() {
        return await this.request('/users');
    }

    async getTodos() {
        return await this.request('/todos');
    }

    async getPosts() {
        return await this.request('/posts');
    }

    async getComments() {
        return await this.request('/comments');
    }

    async getUserTodos(userId) {
        const todos = await this.getTodos();
        return todos.filter(todo => todo.userId == userId);
    }

    async getUserPosts(userId) {
        const posts = await this.getPosts();
        return posts.filter(post => post.userId == userId);
    }

    async getPostComments(postId) {
        const comments = await this.getComments();
        return comments.filter(comment => comment.postId == postId);
    }
}

export const apiService = new ApiService();