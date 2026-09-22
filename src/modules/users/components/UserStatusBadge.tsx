import { Badge } from '@/shared/components/ui';

interface UserStatusBadgeProps {
  isActive: boolean;
}

export function UserStatusBadge({ isActive }: UserStatusBadgeProps) {
  return (
    <Badge tone={isActive ? 'success' : 'danger'}>
      {isActive ? 'Aktif' : 'Nonaktif'}
    </Badge>
  );
}