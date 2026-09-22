// ============================================================
// TIPE DATA USER
// ============================================================

export interface RoleInfo {
  code: string;
  name: string;
}

export interface BranchInfo {
  code: string;
  name: string;
}

export interface UserRole {
  id: string;
  roleId: string;
  branchId: string | null;
  role: RoleInfo;
  branch: BranchInfo | null;
}

export interface UserBranch {
  branchId: string;
  isDefault: boolean;
  branch: BranchInfo;
}

export interface User {
  id: string;
  username: string;
  email: string | null;
  fullName: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
  branches: UserBranch[];
}

// ============================================================
// MASTER DATA (untuk dropdown)
// ============================================================

export interface Role {
  id: string;
  code: string;
  name: string;
  description: string | null;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string | null;
}

// ============================================================
// TIPE INPUT
// ============================================================

export interface UserRoleInput {
  roleId: string;
  branchId?: string | null;
}

export interface UserBranchInput {
  branchId: string;
  isDefault?: boolean;
}

export interface CreateUserInput {
  username: string;
  email?: string;
  fullName: string;
  password: string;
  isActive?: boolean;
  roles?: UserRoleInput[];
  branches?: UserBranchInput[];
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  fullName?: string;
  isActive?: boolean;
  roles?: UserRoleInput[];
  branches?: UserBranchInput[];
}

export interface ChangePasswordInput {
  newPassword: string;
}

// ============================================================
// TIPE QUERY & PAGINATION
// ============================================================

export interface QueryUserParams {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: string;
  branchId?: string;
  isActive?: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}