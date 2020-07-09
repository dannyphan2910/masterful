import axios from 'axios';

export default {
    /*
        {
            "email": String,
            "password": String
        }
    */
    login: function(data) {
        return axios.post('/api/sessions', data)  
    },

    /*
        {
            "firstName": String
            "lastName": String
            "email": String
            "password": String
        }
    */
    registerUser: function(data) {
        return axios.post('/api/users', data);
    },

    getCourse: function(id) {
        return axios.get(`/api/courses/${id}`);
    }, 

    register: function(courseId, userId) {
        return axios.post(`/api/courses/${courseId}/enrollments`, { userId: userId });
    }, 

    unregister: function(courseId, userId) {
        return axios.delete(`/api/courses/${courseId}/enrollments`, { data: { userId: userId }});
    }, 

    archive: function(courseId, userId) {
        return axios.put(`/api/users/${userId}/courses/${courseId}`, { isArchived: true });
    },

    getLecture: function(id) {
        return axios.get(`/api/lectures/${id}`)
    },

    setLive: function(id) {
        return axios.put(`/api/courses/${id}`, { isLive: true });
    },

    setNotLive: function(id) {
        return axios.put(`/api/courses/${id}`, { isLive: false });
    },

    getCoursesMeta: function(userId, numCourses = 6) {
        return axios.post(`/api/users/${userId}/courses/meta`, numCourses);
    },

    getCoursesProgress: function(userId) {
        return axios.post(`/api/users/${userId}/courses/progress`);
    },

    searchCourses: function(keyword) {
        return axios.post('/api/courses/search', { "keyword": keyword });
    },

    getMasterCourses: function(userId) {
        return axios.get(`/api/users/${userId}/courses`);
    },

    getUser: function(id) {
        return axios.get(`/api/users/${id}`);
    },

    /*
        {
            "title": String,
            "description": String, [optional]
            "date": Date,
            "length": integer
        }
    */
    createLecture: function(courseId, data) {
        return axios.post(`/api/courses/${courseId}/lectures`, data);
    },

    editLecture: function(lectureId, data) {
        return axios.put(`/api/lectures/${lectureId}`, data);
    },

    deleteLecture: function(lectureId) {
        return axios.delete(`/api/lectures/${lectureId}`);
    },

    /*
        {
            "title": String,
            "description": String, [optional]
            "courseLength": integer, 
            "isLive": boolean, [optional]
            "isArchived": boolean [optional]
            "paymentType": integer,
            "cost": integer [optional]
        }
    */
    createCourse: function(userId, data) {
        return axios.post(`/api/users/${userId}/courses`, data);
    },

    editCourse: function(courseId, data) {
        return axios.put(`/api/courses/${courseId}`, data);
    },

    deleteCourse: function(courseId) {
        return axios.delete(`/api/courses/${courseId}`);
    }
}