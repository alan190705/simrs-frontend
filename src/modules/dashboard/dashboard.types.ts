export interface Readiness {
  status: string;
  database: string;
  uptime: number;
  timestamp: string;
}

export interface DashboardStat {
  label: string;
  value: string | number;
  hint?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon: 'users' | 'bed' | 'plus' | 'calendar';
  tone: 'primary' | 'sky' | 'amber' | 'emerald';
}

export interface VisitPoint {
  day: string;
  visits: number;
}

export interface TodaySchedule {
  id: string;
  time: string;
  doctorName: string;
  polyclinic: string;
  booked: number;
  capacity: number;
  status: 'ongoing' | 'done' | 'upcoming';
}

export interface QuickAction {
  label: string;
  description: string;
  icon: 'plus' | 'search' | 'pill' | 'wallet';
  href: string;
  tone: 'primary' | 'sky' | 'amber' | 'emerald';
}

export interface Activity {
  id: string;
  type: 'patient' | 'prescription' | 'payment' | 'registration';
  title: string;
  description: string;
  timestamp: string;
  tone: 'primary' | 'sky' | 'amber' | 'emerald';
}