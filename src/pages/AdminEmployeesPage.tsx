import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAdminData } from '@/hooks/useAdminData';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, AlertCircle } from 'lucide-react';

const AdminEmployeesPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuthContext();
  const { employees, isLoading } = useAdminData();

  if (!authLoading && !isAdmin) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
          <Button className="mt-4" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (isLoading || authLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground">View employee learning progress</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Employees</CardTitle>
            <CardDescription>Track employee progress and performance</CardDescription>
          </CardHeader>
          <CardContent>
            {employees.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No employees yet</h3>
                <p className="text-sm text-muted-foreground">Employees will appear here once they sign up</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>In Progress</TableHead>
                    <TableHead>Avg. Score</TableHead>
                    <TableHead>Certificates</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow key={emp.profile.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{emp.profile.full_name}</p>
                          <p className="text-xs text-muted-foreground">{emp.profile.employee_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{emp.profile.department || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className="bg-success/10 text-success">{emp.coursesCompleted}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-warning/10 text-warning">{emp.coursesInProgress}</Badge>
                      </TableCell>
                      <TableCell>{emp.averageScore}%</TableCell>
                      <TableCell>
                        <Badge variant="outline">{emp.certificates}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminEmployeesPage;
