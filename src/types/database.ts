export type AppRole = 'admin' | 'member';
export type TaskUrgency = 'Low' | 'Medium' | 'High';

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface Member {
  id: string;
  name: string;
  user_id: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  member_id: string;
  title: string;
  urgency: TaskUrgency;
  created_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  duration: number;
  participants: number;
  meeting_date: string;
  created_at: string;
}

export interface Communication {
  id: string;
  member_id: string;
  messages_per_day: number;
  after_hours: boolean;
  recorded_date: string;
  created_at: string;
}

// Extended types with relations
export interface TaskWithMember extends Task {
  members?: Member;
}

export interface CommunicationWithMember extends Communication {
  members?: Member;
}

// Aggregated data types
export interface WorkloadData {
  memberName: string;
  totalWorkload: number;
  taskCount: number;
}

export interface MeetingCostData {
  title: string;
  cost: number;
  duration: number;
  participants: number;
}

export interface CommunicationData {
  memberName: string;
  messagesPerDay: number;
  afterHours: boolean;
}
