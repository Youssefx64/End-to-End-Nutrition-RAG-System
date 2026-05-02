import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 60000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  register: (data)         => api.post('/auth/register', data),
  login:    (data)         => api.post('/auth/login', data),
  me:       ()             => api.get('/auth/me'),
  update:   (data)         => api.put('/auth/me', data),
}

export const dataApi = {
  uploadFile: (projectId, formData, onProgress) =>
    api.post(`/data/upload/${projectId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
    }),

  processFile: (projectId, fileId, { chunkSize = 512, overlapSize = 50, doReset = 0 } = {}) =>
    api.post(`/data/process/${projectId}`, {
      file_id:      fileId,
      chunk_size:   chunkSize,
      overlap_size: overlapSize,
      do_reset:     doReset,
    }),
}

export const nlpApi = {
  pushIndex:    (projectId, doReset = 0)   => api.post(`/nlp/index/push/${projectId}`, { do_reset: doReset }),
  getIndexInfo: (projectId)                => api.get(`/nlp/index/info/${projectId}`),
  search:       (projectId, body)          => api.post(`/nlp/index/search/${projectId}`, body),
  answer:       (projectId, body)          => api.post(`/nlp/index/answer/${projectId}`, body),
}

export const baseApi = {
  health: () => api.get('/'),
}

export default api
