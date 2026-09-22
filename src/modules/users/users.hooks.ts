import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api';
import {
  changeUserPassword,
  createUser,
  deleteUser,
  fetchBranches,
  fetchEffectiveAccess,
  fetchRoles,
  fetchUserById,
  fetchUsers,
  setUserModules,
  updateUser,
} from './users.api';
import type {
  ChangePasswordInput,
  CreateUserInput,
  ModuleInput,
  QueryUserParams,
  UpdateUserInput,
} from './users.types';

// ============================================================
// QUERY KEYS
// ============================================================

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: QueryUserParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  effectiveAccess: (id: string) =>
    [...userKeys.detail(id), 'effective-access'] as const,
};

export const masterKeys = {
  roles: ['roles'] as const,
  branches: ['branches'] as const,
};

// ============================================================
// QUERY HOOKS — USERS
// ============================================================

export function useUsers(params: QueryUserParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ''),
    queryFn: () => fetchUserById(id!),
    enabled: !!id,
  });
}

/**
 * Ambil akses efektif user — untuk tab Module Access.
 */
export function useEffectiveAccess(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.effectiveAccess(id ?? ''),
    queryFn: () => fetchEffectiveAccess(id!),
    enabled: !!id,
    staleTime: 30_000,
  });
}

// ============================================================
// QUERY HOOKS — MASTER DATA
// ============================================================

export function useRoles() {
  return useQuery({
    queryKey: masterKeys.roles,
    queryFn: fetchRoles,
    staleTime: 5 * 60_000,
  });
}

export function useBranches() {
  return useQuery({
    queryKey: masterKeys.branches,
    queryFn: fetchBranches,
    staleTime: 5 * 60_000,
  });
}

// ============================================================
// MUTATIONS
// ============================================================

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User berhasil dibuat');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      qc.invalidateQueries({ queryKey: userKeys.detail(id) });
      qc.invalidateQueries({ queryKey: userKeys.effectiveAccess(id) });
      toast.success('User berhasil diperbarui');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User berhasil dihapus');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useChangeUserPassword(id: string) {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => changeUserPassword(id, input),
    onSuccess: () => toast.success('Password berhasil diubah'),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

/**
 * Set module access user (override).
 */
export function useSetUserModules(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (modules: ModuleInput[]) => setUserModules(id, modules),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.effectiveAccess(id) });
      qc.invalidateQueries({ queryKey: userKeys.detail(id) });
      toast.success('Module access berhasil disimpan');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}