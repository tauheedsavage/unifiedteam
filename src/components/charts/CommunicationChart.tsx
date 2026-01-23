import { Bar } from 'react-chartjs-2';
import { useCommunicationData } from '@/hooks/useCommunication';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { chartColors, defaultChartOptions } from './ChartSetup';
import '@/components/charts/ChartSetup';

export function CommunicationChart() {
  const { data: commData, isLoading } = useCommunicationData();

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = {
    labels: commData?.map(d => d.memberName) || [],
    datasets: [
      {
        label: 'Messages/Day',
        data: commData?.map(d => d.messagesPerDay) || [],
        backgroundColor: chartColors.primary,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'After Hours %',
        data: commData?.map(d => d.afterHoursPercentage) || [],
        backgroundColor: chartColors.warning,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsl(220, 13%, 91%)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Communication Load</CardTitle>
        <CardDescription>
          Daily messages and after-hours work percentage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {commData && commData.length > 0 ? (
            <Bar data={data} options={options} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No communication data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
