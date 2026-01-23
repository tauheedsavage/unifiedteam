import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskWithMember, TaskUrgency } from '@/types/database';
import { toast } from 'sonner';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, members(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TaskWithMember[];
    }
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      memberId, 
      title, 
      urgency 
    }: { 
      memberId: string; 
      title: string; 
      urgency: TaskUrgency;
    }) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ member_id: memberId, title, urgency })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['workload'] });
      toast.success('Task added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add task: ' + error.message);
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['workload'] });
      toast.success('Task removed');
    },
    onError: (error) => {
      toast.error('Failed to remove task: ' + error.message);
    }
  });
}

export function useWorkloadData() {
  return useQuery({
    queryKey: ['workload'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('urgency, members(id, name)');
      
      if (error) throw error;
      
      // Aggregate workload by member
      const workloadMap = new Map<string, { name: string; totalWorkload: number; taskCount: number }>();
      
      data.forEach((task: any) => {
        if (!task.members) return;
        
        const memberId = task.members.id;
        const memberName = task.members.name;
        const weight = task.urgency === 'High' ? 3 : task.urgency === 'Medium' ? 2 : 1;
        
        if (workloadMap.has(memberId)) {
          const existing = workloadMap.get(memberId)!;
          existing.totalWorkload += weight;
          existing.taskCount += 1;
        } else {
          workloadMap.set(memberId, { 
            name: memberName, 
            totalWorkload: weight, 
            taskCount: 1 
          });
        }
      });
      
      return Array.from(workloadMap.values());
    }
  });
}
