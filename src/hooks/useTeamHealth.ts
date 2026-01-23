import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  calculateWorkloadRisk, 
  calculateMeetingRisk, 
  calculateCommunicationRisk,
  calculateTeamHealth 
} from '@/lib/calculations';

export function useTeamHealth() {
  return useQuery({
    queryKey: ['teamHealth'],
    queryFn: async () => {
      // Fetch all required data
      const [membersRes, tasksRes, meetingsRes, commRes] = await Promise.all([
        supabase.from('members').select('id'),
        supabase.from('tasks').select('urgency'),
        supabase.from('meetings').select('duration, participants'),
        supabase.from('communication').select('messages_per_day, after_hours')
      ]);
      
      if (membersRes.error) throw membersRes.error;
      if (tasksRes.error) throw tasksRes.error;
      if (meetingsRes.error) throw meetingsRes.error;
      if (commRes.error) throw commRes.error;
      
      const memberCount = membersRes.data.length;
      
      // Calculate total workload
      const totalWorkload = tasksRes.data.reduce((sum, task) => {
        const weight = task.urgency === 'High' ? 3 : task.urgency === 'Medium' ? 2 : 1;
        return sum + weight;
      }, 0);
      
      // Calculate total meeting cost
      const totalMeetingCost = meetingsRes.data.reduce((sum, meeting) => {
        return sum + (meeting.duration * meeting.participants);
      }, 0);
      
      // Calculate communication metrics
      const commData = commRes.data;
      const avgMessages = commData.length > 0
        ? commData.reduce((sum, c) => sum + c.messages_per_day, 0) / commData.length
        : 0;
      const afterHoursPercentage = commData.length > 0
        ? (commData.filter(c => c.after_hours).length / commData.length) * 100
        : 0;
      
      // Calculate risks
      const workloadRisk = calculateWorkloadRisk(totalWorkload, memberCount);
      const meetingRisk = calculateMeetingRisk(totalMeetingCost, memberCount);
      const communicationRisk = calculateCommunicationRisk(avgMessages, afterHoursPercentage);
      
      // Calculate overall health
      const health = calculateTeamHealth({
        workloadRisk,
        meetingRisk,
        communicationRisk
      });
      
      return {
        health,
        workloadRisk: Math.round(workloadRisk),
        meetingRisk: Math.round(meetingRisk),
        communicationRisk: Math.round(communicationRisk),
        memberCount,
        totalWorkload,
        totalMeetingCost,
        avgMessages: Math.round(avgMessages),
        afterHoursPercentage: Math.round(afterHoursPercentage)
      };
    }
  });
}
