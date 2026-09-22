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
// MASTER DATA
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
// MODULE ACCESS
// ============================================================

/** State permission per modul — hasil /users/:id/effective-access */
export interface PermissionState {
  permissionId: string;
  code: string;
  name: string;
  fromRole: boolean;
  override: 'grant' | 'deny' | null;
  effective: boolean;
}

/** State modul lengkap */
export interface ModuleState {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  moduleGroup: string | null;
  moduleIcon: string | null;
  moduleOrder: number;
  permissions: PermissionState[];
  hasAccess: boolean;
  overridden: boolean;
}

/** Response /users/:id/effective-access */
export interface EffectiveAccess {
  userId: string;
  roles: string[];
  isSuperAdmin: boolean;
  modules: ModuleState[];
}

/** Input untuk set module access */
export interface ModuleInput {
  moduleCode: string;
  permissions: string[];
}

// ============================================================
// TIPE INPUT USER
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
  modules?: ModuleInput[];
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  fullName?: string;
  isActive?: boolean;
  roles?: UserRoleInput[];
  branches?: UserBranchInput[];
  modules?: ModuleInput[];
}

export interface ChangePasswordInput {
  newPassword: string;
}

// ============================================================
// TIPE QUERY
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