// Workload calculation: Low = 1, Medium = 2, High = 3
export function calculateWorkloadScore(urgency: 'Low' | 'Medium' | 'High'): number {
  const weights = { Low: 1, Medium: 2, High: 3 };
  return weights[urgency];
}

export function calculateTotalWorkload(tasks: Array<{ urgency: 'Low' | 'Medium' | 'High' }>): number {
  return tasks.reduce((sum, task) => sum + calculateWorkloadScore(task.urgency), 0);
}

// Meeting cost formula: cost = duration * participants
export function calculateMeetingCost(duration: number, participants: number): number {
  return duration * participants;
}

// Team health calculation
export interface HealthMetrics {
  workloadRisk: number;
  meetingRisk: number;
  communicationRisk: number;
}

export function calculateTeamHealth(metrics: HealthMetrics): number {
  const { workloadRisk, meetingRisk, communicationRisk } = metrics;
  const health = 100 - (workloadRisk + meetingRisk + communicationRisk);
  return Math.max(0, Math.min(100, health));
}

export function getHealthColor(health: number): string {
  if (health >= 70) return 'hsl(142, 76%, 36%)'; // Green
  if (health >= 40) return 'hsl(45, 93%, 47%)'; // Yellow
  return 'hsl(0, 84%, 60%)'; // Red
}

export function getHealthStatus(health: number): string {
  if (health >= 70) return 'Healthy';
  if (health >= 40) return 'At Risk';
  return 'Critical';
}

// Risk calculations (0-33 scale for each)
export function calculateWorkloadRisk(totalWorkload: number, memberCount: number): number {
  if (memberCount === 0) return 0;
  const avgWorkload = totalWorkload / memberCount;
  // High workload (>10 per person) = max risk
  return Math.min(33, (avgWorkload / 10) * 33);
}

export function calculateMeetingRisk(totalMeetingCost: number, memberCount: number): number {
  if (memberCount === 0) return 0;
  const avgCost = totalMeetingCost / memberCount;
  // High meeting cost (>100 per person) = max risk
  return Math.min(33, (avgCost / 100) * 33);
}

export function calculateCommunicationRisk(
  avgMessagesPerDay: number,
  afterHoursPercentage: number
): number {
  // High message volume (>50/day) + after hours work = max risk
  const messageRisk = Math.min(16.5, (avgMessagesPerDay / 50) * 16.5);
  const afterHoursRisk = (afterHoursPercentage / 100) * 16.5;
  return messageRisk + afterHoursRisk;
}
