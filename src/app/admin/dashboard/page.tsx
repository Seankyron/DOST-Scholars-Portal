import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-dost-title">Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Admin Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the main dashboard for managing scholars and services.</p>
        </CardContent>
      </Card>
    </div>
  );
}