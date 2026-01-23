import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeamHealthCard } from '@/components/dashboard/TeamHealthCard';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { WorkloadChart } from '@/components/charts/WorkloadChart';
import { MeetingCostChart } from '@/components/charts/MeetingCostChart';
import { CommunicationChart } from '@/components/charts/CommunicationChart';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Team collaboration insights at a glance</p>
        </div>
        
        <StatsCards />
        
        <TeamHealthCard />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkloadChart />
          <MeetingCostChart />
        </div>
        
        <CommunicationChart />
      </div>
    </DashboardLayout>
  );
}
