/**
 * API 响应处理工具
 * 
 * 后端 Spring Data 返回的 Page 对象结构：
 * {
 *   success: true,
 *   data: {
 *     content: [...],        // 实际数据数组
 *     totalElements: 100,    // 总记录数
 *     totalPages: 10,        // 总页数
 *     size: 10,              // 每页大小
 *     number: 0              // 当前页码
 *   }
 * }
 * 
 * 前端期望的结构：
 * {
 *   list: [...],
 *   total: 100
 * }
 */

/**
 * 解析分页响应数据
 * @param {Object} res - Axios 响应对象 (res.data)
 * @returns {Object} - { list: Array, total: Number }
 */
export function parsePageResponse(res) {
  if (!res || !res.success) {
    return { list: [], total: 0 };
  }

  const pageData = res.data;
  
  // 兼容两种格式：
  // 1. Spring Data Page 对象: { content: [...], totalElements: 100 }
  // 2. 普通数组: [...]
  if (Array.isArray(pageData)) {
    return {
      list: pageData,
      total: pageData.length
    };
  }

  // Spring Data Page 对象
  return {
    list: pageData.content || [],
    total: pageData.totalElements || 0
  };
}

/**
 * 解析普通响应数据（非分页）
 * @param {Object} res - Axios 响应对象 (res.data)
 * @returns {Object|Array} - 实际数据
 */
export function parseResponse(res) {
  if (!res || !res.success) {
    return null;
  }
  return res.data;
}

export default {
  parsePageResponse,
  parseResponse
};
