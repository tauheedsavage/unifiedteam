import { Bar } from 'react-chartjs-2';
import { useWorkloadData } from '@/hooks/useTasks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { chartColorsArray, defaultChartOptions } from './ChartSetup';
import '@/components/charts/ChartSetup';

export function WorkloadChart() {
  const { data: workloadData, isLoading } = useWorkloadData();

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
    labels: workloadData?.map(d => d.name) || [],
    datasets: [
      {
        label: 'Workload Score',
        data: workloadData?.map(d => d.totalWorkload) || [],
        backgroundColor: chartColorsArray,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      title: {
        display: false,
      },
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
        <CardTitle className="flex items-center gap-2">
          Workload Distribution
        </CardTitle>
        <CardDescription>
          Task weight per team member (Low=1, Medium=2, High=3)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {workloadData && workloadData.length > 0 ? (
            <Bar data={data} options={options} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No workload data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
