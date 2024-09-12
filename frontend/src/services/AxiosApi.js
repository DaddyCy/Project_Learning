import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({baseURL: API_URL});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Logout user if refresh token is invalid
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Authentication
export const registerUser = (userData) => api.post("/auth/register", userData);
export const loginUser = (credentials) => api.post("/auth/login", credentials);
export const refreshToken = (refreshToken) => api.post("/auth/refresh-token", { refreshToken });
export const logoutUser = () => api.post("/auth/logout");

// Courses
export const getAllCourses = async () => {
  try {
    const response = await api.get('/courses');
    console.log('Risposta API corsi:', response.data);
    return response; // Restituisci l'intera risposta
  } catch (error) {
    console.error('Errore nel recupero dei corsi:', error);
    throw error;
  }
};

export const getCourse = async (id) => {
  try {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await api.post('/courses/admin', courseData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (id, courseData) => {
  try {
    const response = await api.put(`/courses/admin/${id}`, courseData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (id) => {
  try {
    const response = await api.delete(`/courses/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};


// Lessons

export const addLesson = (courseId, lessonData) => api.post(`/courses/admin/${courseId}/lessons`, lessonData, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const updateLesson = (courseId, lessonId, lessonData) => api.put(`/courses/admin/${courseId}/lessons/${lessonId}`, lessonData, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const deleteLesson = (courseId, lessonId) => api.delete(`/courses/admin/${courseId}/lessons/${lessonId}`);
export const getLessonDetail = (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}`);

// Student

export const enrollCourse = async (courseId, userData) => {
  try {
    const response = await api.post(`/courses/student/${courseId}/enroll`, userData);
    return response.data;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

export const unenrollCourse = async (courseId, userData) => {
  try {
    const response = await api.post(`/courses/student/${courseId}/unenroll`, userData);
    return response.data;
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    throw error;
  }
};
export const getEnrolledCourses = () => api.get('/courses/student/my-courses');

export const getStudentDetails = () => api.get('/users/student/details');

export const updateStudent = (userData) => api.put('/users/student/update', userData);

export const uploadAvatar = async (formData) => {
  try {
    const response = await api.post('/users/student/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

export const updateAvatar = async (formData) => {
  try {
    const response = await api.put('/users/student/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating avatar:', error);
    throw error;
  }
};

export const deleteAvatar = async () => {
  try {
    const response = await api.delete('/users/student/avatar');
    return response.data;
  } catch (error) {
    console.error('Error deleting avatar:', error);
    throw error;
  }
};


// Admin
export const getAdminDetails = () => api.get('/users/admin/details');
export const updateAdmin = (userData) => api.put('/users/admin/update', userData);
export const deleteAdmin = () => api.delete('/users/admin');
export const getAllStudents = (page, limit) => api.get(`/users/admin/students?page=${page}&limit=${limit}`);
export const deleteStudent = (id) => api.delete(`/users/admin/student/${id}`);

export default api;