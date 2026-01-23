import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCommunication, useCreateCommunication, useDeleteCommunication } from '@/hooks/useCommunication';
import { useMembers } from '@/hooks/useMembers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function Communication() {
  const { data: communication, isLoading } = useCommunication();
  const { data: members } = useMembers();
  const createCommunication = useCreateCommunication();
  const deleteCommunication = useDeleteCommunication();
  
  const [open, setOpen] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [messagesPerDay, setMessagesPerDay] = useState('');
  const [afterHours, setAfterHours] = useState(false);
  const [recordedDate, setRecordedDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCommunication.mutateAsync({ 
      memberId, 
      messagesPerDay: parseInt(messagesPerDay), 
      afterHours,
      recordedDate: recordedDate || undefined
    });
    setMemberId('');
    setMessagesPerDay('');
    setAfterHours(false);
    setRecordedDate('');
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Communication</h1>
            <p className="text-muted-foreground">Track communication pressure and after-hours work</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Stats
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add Communication Stats</DialogTitle>
                  <DialogDescription>
                    Record communication metrics for a team member
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="member">Team Member</Label>
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
                    <Label htmlFor="messages">Messages Per Day</Label>
                    <Input
                      id="messages"
                      type="number"
                      min="0"
                      value={messagesPerDay}
                      onChange={(e) => setMessagesPerDay(e.target.value)}
                      placeholder="50"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="afterHours">After Hours Work</Label>
                      <p className="text-sm text-muted-foreground">
                        Worked outside regular hours
                      </p>
                    </div>
                    <Switch
                      id="afterHours"
                      checked={afterHours}
                      onCheckedChange={setAfterHours}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Record Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={recordedDate}
                      onChange={(e) => setRecordedDate(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createCommunication.isPending || !memberId}>
                    {createCommunication.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Stats
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Communication Records
            </CardTitle>
            <CardDescription>
              {communication?.length || 0} records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : communication && communication.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Messages/Day</TableHead>
                    <TableHead>After Hours</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communication.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.members?.name || 'Unknown'}</TableCell>
                      <TableCell>{record.messages_per_day}</TableCell>
                      <TableCell>
                        {record.after_hours ? (
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            No
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(record.recorded_date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCommunication.mutate(record.id)}
                          disabled={deleteCommunication.isPending}
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
                No communication records yet. Add your first record!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
