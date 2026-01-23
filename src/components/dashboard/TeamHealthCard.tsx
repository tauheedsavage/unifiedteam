import { useTeamHealth } from '@/hooks/useTeamHealth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { getHealthColor, getHealthStatus } from '@/lib/calculations';
import { Heart, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TeamHealthCard() {
  const { data: healthData, isLoading } = useTeamHealth();

  if (isLoading) {
    return (
      <Card className="glass-card col-span-full">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!healthData) {
    return null;
  }

  const health = healthData.health;
  const status = getHealthStatus(health);
  const color = getHealthColor(health);

  const StatusIcon = health >= 70 ? CheckCircle : health >= 40 ? AlertTriangle : XCircle;

  return (
    <Card className="glass-card col-span-full overflow-hidden">
      <div 
        className="h-1 w-full" 
        style={{ backgroundColor: color }}
      />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" style={{ color }} />
          Overall Team Health
        </CardTitle>
        <CardDescription>
          Calculated from workload, meetings, and communication metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main health score */}
        <div className="flex items-center gap-6">
          <div 
            className="relative h-32 w-32 rounded-full flex items-center justify-center"
            style={{ 
              background: `conic-gradient(${color} ${health * 3.6}deg, hsl(var(--secondary)) 0deg)` 
            }}
          >
            <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl font-bold" style={{ color }}>
                  {Math.round(health)}
                </span>
                <span className="text-sm text-muted-foreground block">/ 100</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <StatusIcon className="h-5 w-5" style={{ color }} />
              <span className="text-xl font-semibold" style={{ color }}>
                {status}
              </span>
            </div>
            <p className="text-muted-foreground">
              {health >= 70 
                ? "Your team is performing well with balanced workload and healthy communication."
                : health >= 40
                ? "Some areas need attention. Consider reviewing workload distribution."
                : "Critical issues detected. Immediate action recommended to prevent burnout."}
            </p>
          </div>
        </div>
        
        {/* Risk breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RiskIndicator 
            label="Workload Risk" 
            value={healthData.workloadRisk} 
            maxValue={33}
          />
          <RiskIndicator 
            label="Meeting Risk" 
            value={healthData.meetingRisk} 
            maxValue={33}
          />
          <RiskIndicator 
            label="Communication Risk" 
            value={healthData.communicationRisk} 
            maxValue={33}
          />
        </div>
        
        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <StatItem label="Team Members" value={healthData.memberCount} />
          <StatItem label="Total Workload" value={healthData.totalWorkload} />
          <StatItem label="Meeting Cost" value={healthData.totalMeetingCost} />
          <StatItem label="Avg Messages/Day" value={healthData.avgMessages} />
        </div>
      </CardContent>
    </Card>
  );
}

function RiskIndicator({ label, value, maxValue }: { label: string; value: number; maxValue: number }) {
  const percentage = (value / maxValue) * 100;
  const isHigh = percentage > 66;
  const isMedium = percentage > 33;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn(
          "font-medium",
          isHigh ? "text-destructive" : isMedium ? "text-warning" : "text-success"
        )}>
          {value}%
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={cn(
          "h-2",
          isHigh ? "[&>div]:bg-destructive" : isMedium ? "[&>div]:bg-warning" : "[&>div]:bg-success"
        )}
      />
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
