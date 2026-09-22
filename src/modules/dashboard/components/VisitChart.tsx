import { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { cn } from '@/lib/cn';
import type { VisitPoint } from '../dashboard.types';

interface VisitChartProps {
  data: VisitPoint[];
  data30?: VisitPoint[];
  data90?: VisitPoint[];
}

const RANGES = [
  { key: '7d', label: '7 hari' },
  { key: '30d', label: '30 hari' },
  { key: '90d', label: '90 hari' },
] as const;

type RangeKey = (typeof RANGES)[number]['key'];

export function VisitChart({ data, data30, data90 }: VisitChartProps) {
  const [range, setRange] = useState<RangeKey>('7d');

  const chartData =
    range === '90d' && data90 ? data90 : range === '30d' && data30 ? data30 : data;

  return (
    <div>
      {/* Filter periode */}
      <div className="mb-4 flex items-center gap-1">
        {RANGES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRange(r.key)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition',
              range === r.key
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
              formatter={(value: number) => [`${value} kunjungan`, '']}
            />
            <Area
              type="monotone"
              dataKey="visits"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#colorVisits)"
              dot={{ fill: '#10b981', r: 3 }}
              activeDot={{ r: 5, fill: '#059669' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}