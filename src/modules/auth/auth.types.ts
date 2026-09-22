export interface UserRole {
  code: string;
  branchId: string | null;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string | null;
  fullName: string;
  roles: UserRole[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  refresh_token_expires_at: string;
  user: AuthUser;
}