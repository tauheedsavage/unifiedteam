import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Meeting } from '@/types/database';
import { toast } from 'sonner';

export function useMeetings() {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('meeting_date', { ascending: false });
      
      if (error) throw error;
      return data as Meeting[];
    }
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      title, 
      duration, 
      participants,
      meetingDate
    }: { 
      title: string;
      duration: number;
      participants: number;
      meetingDate?: string;
    }) => {
      const { data, error } = await supabase
        .from('meetings')
        .insert({ 
          title, 
          duration, 
          participants,
          meeting_date: meetingDate || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast.success('Meeting added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add meeting: ' + error.message);
    }
  });
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (meetingId: string) => {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast.success('Meeting removed');
    },
    onError: (error) => {
      toast.error('Failed to remove meeting: ' + error.message);
    }
  });
}

export function useMeetingCostData() {
  return useQuery({
    queryKey: ['meetingCosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select('*');
      
      if (error) throw error;
      
      return (data as Meeting[]).map(meeting => ({
        title: meeting.title,
        cost: meeting.duration * meeting.participants,
        duration: meeting.duration,
        participants: meeting.participants
      }));
    }
  });
}
