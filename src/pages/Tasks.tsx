import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTasks, useCreateTask, useDeleteTask } from '@/hooks/useTasks';
import { useMembers } from '@/hooks/useMembers';
import { TaskUrgency } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, ListTodo } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Tasks() {
  const { data: tasks, isLoading } = useTasks();
  const { data: members } = useMembers();
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();
  
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [memberId, setMemberId] = useState('');
  const [urgency, setUrgency] = useState<TaskUrgency>('Medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask.mutateAsync({ title, memberId, urgency });
    setTitle('');
    setMemberId('');
    setUrgency('Medium');
    setOpen(false);
  };

  const getUrgencyBadge = (urgency: TaskUrgency) => {
    const styles = {
      Low: 'bg-success/10 text-success border-success/20',
      Medium: 'bg-warning/10 text-warning border-warning/20',
      High: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return (
      <Badge variant="outline" className={cn(styles[urgency])}>
        {urgency}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Manage team tasks and workload</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add Task</DialogTitle>
                  <DialogDescription>
                    Assign a new task to a team member
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Review quarterly report"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member">Assign To</Label>
                    <Select value={memberId} onValueChange={setMemberId} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members?.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select value={urgency} onValueChange={(v) => setUrgency(v as TaskUrgency)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low (Weight: 1)</SelectItem>
                        <SelectItem value="Medium">Medium (Weight: 2)</SelectItem>
                        <SelectItem value="High">High (Weight: 3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createTask.isPending || !memberId}>
                    {createTask.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Task
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Tasks
            </CardTitle>
            <CardDescription>
              {tasks?.length || 0} active tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : tasks && tasks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.members?.name || 'Unknown'}</TableCell>
                      <TableCell>{getUrgencyBadge(task.urgency)}</TableCell>
                      <TableCell>{format(new Date(task.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask.mutate(task.id)}
                          disabled={deleteTask.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No tasks yet. Add your first task!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
