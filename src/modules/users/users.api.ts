import { api, get } from '@/lib/api';
import type {
  Branch,
  ChangePasswordInput,
  CreateUserInput,
  EffectiveAccess,
  ModuleInput,
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
// MODULE ACCESS
// ============================================================

/**
 * Ambil akses efektif user (role default + override).
 * Dipakai untuk render checkbox di tab Module Access.
 */
export function fetchEffectiveAccess(id: string) {
  return get<EffectiveAccess>(`/users/${id}/effective-access`);
}

/**
 * Set module access user (override).
 * Body: { modules: [{ moduleCode: 'farmasi', permissions: ['view', 'create'] }] }
 */
export function setUserModules(id: string, modules: ModuleInput[]) {
  return api.patch(`/users/${id}/modules`, { modules }).then((res) => res.data);
}

// ============================================================
// MASTER DATA
// ============================================================

export function fetchRoles() {
  return get<Role[]>('/roles');
}

export function fetchBranches() {
  return get<Branch[]>('/branches');
}