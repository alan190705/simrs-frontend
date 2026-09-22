import { api, get } from '@/lib/api';
import type {
  Branch,
  ChangePasswordInput,
  CreateUserInput,
  QueryUserParams,
  Role,
  UpdateUserInput,
  User,
} from './users.types';

// ============================================================
// USERS
// ============================================================

export function fetchUsers(params: QueryUserParams = {}) {
  return get<User[]>('/users', params);
}

export function fetchUserById(id: string) {
  return get<User>(`/users/${id}`);
}

export function createUser(input: CreateUserInput) {
  return api.post('/users', input).then((res) => res.data);
}

export function updateUser(id: string, input: UpdateUserInput) {
  return api.patch(`/users/${id}`, input).then((res) => res.data);
}

export function deleteUser(id: string) {
  return api.delete(`/users/${id}`).then((res) => res.data);
}

export function changeUserPassword(id: string, input: ChangePasswordInput) {
  return api.patch(`/users/${id}/password`, input).then((res) => res.data);
}

// ============================================================
// MASTER DATA (untuk dropdown)
// ============================================================

export function fetchRoles() {
  return get<Role[]>('/roles');
}

export function fetchBranches() {
  return get<Branch[]>('/branches');
}