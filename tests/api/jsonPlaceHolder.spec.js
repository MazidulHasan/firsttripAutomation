const { test, expect } = require('@playwright/test');
const ApiClient = require('../../utils/apiClient');
const testData = require('../../test-data/testData.json');

test.describe('JSONPlaceholder API Tests', () => {
  const API_BASE_URL = 'https://jsonplaceholder.typicode.com'; // Define API URL here

  test.describe('Users API', () => {
    test('GET /users - should get all users', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const result = await apiClient.get('/users');
      
      expect(result.status).toBe(200);
      expect(Array.isArray(result.data)).toBeTruthy();
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0]).toHaveProperty('id');
      expect(result.data[0]).toHaveProperty('name');
      expect(result.data[0]).toHaveProperty('email');
    });

    test('GET /users/{id} - should get user by id', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const userId = 1;
      const result = await apiClient.get(`/users/${userId}`);
      
      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('id', userId);
      expect(result.data).toHaveProperty('name');
      expect(result.data).toHaveProperty('email');
      expect(result.data).toHaveProperty('username');
    });

    test('POST /users - should create a new user', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const result = await apiClient.post('/users', testData.users.newUser);
      
      expect(result.status).toBe(201);
      expect(result.data).toHaveProperty('id');
      expect(result.data.name).toBe(testData.users.newUser.name);
      expect(result.data.email).toBe(testData.users.newUser.email);
    });

    test('PUT /users/{id} - should update user', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const userId = 1;
      const result = await apiClient.put(`/users/${userId}`, testData.users.updateUser);
      
      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('id', userId);
      expect(result.data.name).toBe(testData.users.updateUser.name);
    });

    test('DELETE /users/{id} - should delete user', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const userId = 1;
      const result = await apiClient.delete(`/users/${userId}`);
      
      expect(result.status).toBe(200);
    });
  });

  test.describe('Posts API', () => {
    test('GET /posts - should get all posts', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const result = await apiClient.get('/posts');
      
      expect(result.status).toBe(200);
      expect(Array.isArray(result.data)).toBeTruthy();
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0]).toHaveProperty('id');
      expect(result.data[0]).toHaveProperty('title');
      expect(result.data[0]).toHaveProperty('body');
      expect(result.data[0]).toHaveProperty('userId');
    });

    test('GET /posts/{id} - should get post by id', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const postId = 1;
      const result = await apiClient.get(`/posts/${postId}`);
      
      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('id', postId);
      expect(result.data).toHaveProperty('title');
      expect(result.data).toHaveProperty('body');
    });

    test('POST /posts - should create a new post', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const result = await apiClient.post('/posts', testData.posts.newPost);
      
      expect(result.status).toBe(201);
      expect(result.data).toHaveProperty('id');
      expect(result.data.title).toBe(testData.posts.newPost.title);
      expect(result.data.userId).toBe(testData.posts.newPost.userId);
    });

    test('GET /users/{id}/posts - should get posts by user', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const userId = 1;
      const result = await apiClient.get(`/users/${userId}/posts`);
      
      expect(result.status).toBe(200);
      expect(Array.isArray(result.data)).toBeTruthy();
      result.data.forEach(post => {
        expect(post.userId).toBe(userId);
      });
    });
  });

  test.describe('Comments API', () => {
    test('GET /comments - should get all comments', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const result = await apiClient.get('/comments');
      
      expect(result.status).toBe(200);
      expect(Array.isArray(result.data)).toBeTruthy();
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0]).toHaveProperty('id');
      expect(result.data[0]).toHaveProperty('name');
      expect(result.data[0]).toHaveProperty('email');
      expect(result.data[0]).toHaveProperty('body');
    });

    test('GET /posts/{id}/comments - should get comments by post', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const postId = 1;
      const result = await apiClient.get(`/posts/${postId}/comments`);
      
      expect(result.status).toBe(200);
      expect(Array.isArray(result.data)).toBeTruthy();
      result.data.forEach(comment => {
        expect(comment.postId).toBe(postId);
      });
    });

    test('POST /posts/{id}/comments - should create comment for post', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const postId = 1;
      const result = await apiClient.post(`/posts/${postId}/comments`, testData.comments.newComment);
      
      expect(result.status).toBe(201);
      expect(result.data).toHaveProperty('id');
      expect(result.data.name).toBe(testData.comments.newComment.name);
    });
  });

  test.describe('Albums API', () => {
    test('GET /albums - should get all albums', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const result = await apiClient.get('/albums');
      
      expect(result.status).toBe(200);
      expect(Array.isArray(result.data)).toBeTruthy();
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0]).toHaveProperty('id');
      expect(result.data[0]).toHaveProperty('title');
      expect(result.data[0]).toHaveProperty('userId');
    });

    test('GET /albums/{id}/photos - should get photos by album', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const albumId = 1;
      const result = await apiClient.get(`/albums/${albumId}/photos`);
      
      expect(result.status).toBe(200);
      expect(Array.isArray(result.data)).toBeTruthy();
      result.data.forEach(photo => {
        expect(photo.albumId).toBe(albumId);
        expect(photo).toHaveProperty('title');
        expect(photo).toHaveProperty('url');
        expect(photo).toHaveProperty('thumbnailUrl');
      });
    });
  });

  test.describe('Error Handling', () => {
    test('GET /users/999 - should handle non-existent user', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const result = await apiClient.get('/users/999');
      expect(result.status).toBe(404);
    });

    test('GET /invalid-endpoint - should handle invalid endpoint', async ({ request }) => {
      const apiClient = new ApiClient(request, API_BASE_URL);
      const result = await apiClient.get('/invalid-endpoint');
      expect(result.status).toBe(404);
    });
  });
});