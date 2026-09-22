import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { ModuleAccess } from '@/modules/auth/auth.types';

// ============================================================
// TIPE
// ============================================================

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  moduleCode: string;
  permissions: string[];
  ready: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// ============================================================
// MAPPING ICON LUCIDE BY NAME
// ============================================================

export function getIconByName(name: string | null | undefined): LucideIcon {
  if (!name) return Icons.Circle;
  const icon = (Icons as any)[name] as LucideIcon | undefined;
  return icon ?? Icons.Circle;
}

// ============================================================
// MAPPING MODULE CODE → PATH (React Router)
// ============================================================
// Modul yang SUDAH punya halaman → arahkan ke path-nya.
// Modul yang BELUM ada → arahkan ke /coming-soon/:code.
//
// Kalau nanti bikin halaman baru, tinggal tambahkan ke PATH_MAP.
// Contoh: 'rawat-jalan': '/rawat-jalan',
// ============================================================

const PATH_MAP: Record<string, string> = {
  dashboard: '/dashboard',
  'user-management': '/users',
  // Tambahkan modul lain di sini saat halamannya sudah dibuat:
  // 'role-management': '/roles',
  // 'branch-management': '/branches',
  // 'audit-log': '/audit-logs',
  // 'pasien': '/patients',
  // 'rawat-jalan': '/rawat-jalan',
  // 'farmasi': '/farmasi',
};

export function getModulePath(moduleCode: string): string {
  if (PATH_MAP[moduleCode]) return PATH_MAP[moduleCode];
  // Belum ada halaman → placeholder
  return `/coming-soon/${moduleCode}`;
}

// ============================================================
// KONVERSI: ModuleAccess[] → NavGroup[]
// ============================================================

export function buildNavGroups(modules: ModuleAccess[]): NavGroup[] {
  const groups = new Map<string, NavItem[]>();

  for (const mod of modules) {
    const groupLabel = mod.moduleGroup ?? 'Lainnya';

    if (!groups.has(groupLabel)) {
      groups.set(groupLabel, []);
    }

    groups.get(groupLabel)!.push({
      path: getModulePath(mod.moduleCode),
      label: mod.moduleName,
      icon: getIconByName(mod.moduleIcon),
      moduleCode: mod.moduleCode,
      permissions: mod.permissions,
      ready: true,
    });
  }

  // Urutkan group sesuai module order terkecil
  return Array.from(groups.entries())
    .map(([label, items]) => ({ label, items }))
    .sort((a, b) => {
      const orderA =
        modules.find((m) => m.moduleGroup === a.label)?.moduleOrder ?? 999;
      const orderB =
        modules.find((m) => m.moduleGroup === b.label)?.moduleOrder ?? 999;
      return orderA - orderB;
    });
}