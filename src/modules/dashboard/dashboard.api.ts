import { getRaw } from '@/lib/api';
import type { Readiness } from './dashboard.types';

export function fetchReadiness() {
  return getRaw<Readiness>('/health/ready');
}