import request from './axios';

export default {
  // 获取待办事项列表
  getTodos(params = {}) {
    return request.get('/todos', { params });
  },
  
  // 获取单个待办详情
  getTodo(id) {
    return request.get(`/todos/${id}`);
  },
  
  // 创建待办事项
  addTodo(todo) {
    return request.post('/todos', todo);
  },
  
  // 更新待办事项
  updateTodo(id, todo) {
    return request.put(`/todos/${id}`, todo);
  },
  
  // 删除待办事项
  deleteTodo(id) {
    return request.delete(`/todos/${id}`);
  },
  
  // 完成待办事项
  completeTodo(id) {
    return request.put(`/todos/${id}/complete`);
  }
};
