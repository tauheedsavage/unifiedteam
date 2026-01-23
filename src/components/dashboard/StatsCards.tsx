import { useMembers } from '@/hooks/useMembers';
import { useTasks } from '@/hooks/useTasks';
import { useMeetings } from '@/hooks/useMeetings';
import { useCommunication } from '@/hooks/useCommunication';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, ListTodo, Calendar, MessageSquare } from 'lucide-react';

export function StatsCards() {
  const { data: members, isLoading: loadingMembers } = useMembers();
  const { data: tasks, isLoading: loadingTasks } = useTasks();
  const { data: meetings, isLoading: loadingMeetings } = useMeetings();
  const { data: communication, isLoading: loadingComm } = useCommunication();

  const stats = [
    {
      label: 'Team Members',
      value: members?.length || 0,
      icon: Users,
      color: 'bg-primary/10 text-primary',
      loading: loadingMembers,
    },
    {
      label: 'Active Tasks',
      value: tasks?.length || 0,
      icon: ListTodo,
      color: 'bg-accent/10 text-accent',
      loading: loadingTasks,
    },
    {
      label: 'Meetings',
      value: meetings?.length || 0,
      icon: Calendar,
      color: 'bg-success/10 text-success',
      loading: loadingMeetings,
    },
    {
      label: 'Comm Records',
      value: communication?.length || 0,
      icon: MessageSquare,
      color: 'bg-warning/10 text-warning',
      loading: loadingComm,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="glass-card">
          <CardContent className="p-6">
            {stat.loading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
