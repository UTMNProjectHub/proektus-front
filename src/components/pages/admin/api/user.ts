import axios from "axios";

export function getAllUsers() {
  return find();
}

export function getUserById(id: string) {
  return find(id);
}

async function find(id?: string) {
  return await axios.get(`/api/admin/users/${id ? id : ''}`).then(r => r.data.users);
}