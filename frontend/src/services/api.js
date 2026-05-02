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
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
  update:   (data) => api.put('/auth/me', data),
}

export const dataApi = {
  upload:  (projectId, file, onProgress) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/data/upload/${projectId}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
    })
  },
  process: (projectId, body) => api.post(`/data/process/${projectId}`, body),
}

export const nlpApi = {
  pushIndex:    (projectId, body) => api.post(`/nlp/index/push/${projectId}`, body),
  getIndexInfo: (projectId)       => api.get(`/nlp/index/info/${projectId}`),
  search:       (projectId, body) => api.post(`/nlp/index/search/${projectId}`, body),
  answer:       (projectId, body) => api.post(`/nlp/index/answer/${projectId}`, body),
}

export const baseApi = {
  health: () => api.get('/'),
}

export default api
