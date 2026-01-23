import { Pie } from 'react-chartjs-2';
import { useMeetingCostData } from '@/hooks/useMeetings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { chartColorsArray, defaultChartOptions } from './ChartSetup';
import '@/components/charts/ChartSetup';

export function MeetingCostChart() {
  const { data: meetingData, isLoading } = useMeetingCostData();

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
    labels: meetingData?.map(d => d.title) || [],
    datasets: [
      {
        data: meetingData?.map(d => d.cost) || [],
        backgroundColor: chartColorsArray,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const meeting = meetingData?.[context.dataIndex];
            if (meeting) {
              return `Cost: ${meeting.cost} (${meeting.duration}min × ${meeting.participants} people)`;
            }
            return `Cost: ${context.parsed}`;
          },
        },
      },
    },
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Meeting Time Cost</CardTitle>
        <CardDescription>
          Cost = Duration × Participants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {meetingData && meetingData.length > 0 ? (
            <Pie data={data} options={options} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No meeting data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
