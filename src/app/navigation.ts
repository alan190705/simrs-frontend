import {
  ClipboardPlus,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Pill,
  Receipt,
  ScanLine,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  ready: boolean;
  phase?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, ready: true },
  { path: '/users', label: 'Manajemen User', icon: Shield, ready: true },
  { path: '/patients', label: 'Pasien', icon: Users, ready: false, phase: 'Tahap 4' },
  { path: '/registration', label: 'Pendaftaran', icon: ClipboardPlus, ready: false, phase: 'Tahap 5' },
  { path: '/medical-record', label: 'Rekam Medis', icon: FileText, ready: false, phase: 'Tahap 6' },
  { path: '/pharmacy', label: 'Farmasi', icon: Pill, ready: false, phase: 'Tahap 7' },
  { path: '/laboratory', label: 'Laboratorium', icon: FlaskConical, ready: false, phase: 'Tahap 7' },
  { path: '/radiology', label: 'Radiologi', icon: ScanLine, ready: false, phase: 'Tahap 7' },
  { path: '/billing', label: 'Billing', icon: Receipt, ready: false, phase: 'Tahap 7' },
  { path: '/settings', label: 'Pengaturan', icon: Settings, ready: false, phase: 'Tahap 3' },
];