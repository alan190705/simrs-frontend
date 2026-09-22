import { api, getRaw } from '@/lib/api';
import { config } from '@/lib/config';
import type { Readiness } from './dashboard.types';

export function fetchReadiness() {
  return getRaw<Readiness>('/health/ready');
}

// Placeholder — nanti ganti dengan endpoint real
export function fetchDashboardSummary() {
  return Promise.resolve({
    stats: {
      totalPatients: 1247,
      visitsToday: 23,
      bedsAvailable: 8,
      activeDoctors: 12,
    },
  });
}