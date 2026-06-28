const BASE_URL = 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('token');

export const signup = (data) =>
  fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const login = (data) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const getNotices = () =>
  fetch(`${BASE_URL}/notices`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(r => r.json());

export const postNotice = (data) =>
  fetch(`${BASE_URL}/notices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const deleteNotice = (id) =>
  fetch(`${BASE_URL}/notices/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(r => r.json());