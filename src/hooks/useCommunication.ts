import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Communication, CommunicationWithMember } from '@/types/database';
import { toast } from 'sonner';

export function useCommunication() {
  return useQuery({
    queryKey: ['communication'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communication')
        .select('*, members(name)')
        .order('recorded_date', { ascending: false });
      
      if (error) throw error;
      return data as CommunicationWithMember[];
    }
  });
}

export function useCreateCommunication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      memberId, 
      messagesPerDay, 
      afterHours,
      recordedDate
    }: { 
      memberId: string;
      messagesPerDay: number;
      afterHours: boolean;
      recordedDate?: string;
    }) => {
      const { data, error } = await supabase
        .from('communication')
        .insert({ 
          member_id: memberId, 
          messages_per_day: messagesPerDay, 
          after_hours: afterHours,
          recorded_date: recordedDate || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communication'] });
      toast.success('Communication stats added');
    },
    onError: (error) => {
      toast.error('Failed to add stats: ' + error.message);
    }
  });
}

export function useDeleteCommunication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commId: string) => {
      const { error } = await supabase
        .from('communication')
        .delete()
        .eq('id', commId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communication'] });
      toast.success('Stats removed');
    },
    onError: (error) => {
      toast.error('Failed to remove stats: ' + error.message);
    }
  });
}

export function useCommunicationData() {
  return useQuery({
    queryKey: ['communicationData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communication')
        .select('*, members(name)');
      
      if (error) throw error;
      
      // Aggregate by member
      const commMap = new Map<string, { 
        memberName: string; 
        avgMessages: number; 
        afterHoursCount: number;
        recordCount: number;
      }>();
      
      (data as CommunicationWithMember[]).forEach(record => {
        if (!record.members) return;
        
        const memberId = record.member_id;
        const memberName = record.members.name;
        
        if (commMap.has(memberId)) {
          const existing = commMap.get(memberId)!;
          existing.avgMessages += record.messages_per_day;
          existing.afterHoursCount += record.after_hours ? 1 : 0;
          existing.recordCount += 1;
        } else {
          commMap.set(memberId, {
            memberName,
            avgMessages: record.messages_per_day,
            afterHoursCount: record.after_hours ? 1 : 0,
            recordCount: 1
          });
        }
      });
      
      return Array.from(commMap.values()).map(item => ({
        memberName: item.memberName,
        messagesPerDay: Math.round(item.avgMessages / item.recordCount),
        afterHoursPercentage: Math.round((item.afterHoursCount / item.recordCount) * 100)
      }));
    }
  });
}
