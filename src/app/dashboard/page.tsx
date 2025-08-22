import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Upload,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  // Mock data - in a real app, this would come from the database
  const stats = [
    {
      name: 'Total Requests',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: FileText,
    },
    {
      name: 'Active Chats',
      value: '3',
      change: '+1',
      changeType: 'positive',
      icon: MessageSquare,
    },
    {
      name: 'Documents Uploaded',
      value: '28',
      change: '+5',
      changeType: 'positive',
      icon: Upload,
    },
    {
      name: 'Policy Score',
      value: '8.5/10',
      change: '+0.3',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ]

  const recentRequests = [
    {
      id: '1',
      type: 'Car Insurance',
      status: 'In Review',
      date: '2024-01-15',
      statusColor: 'text-yellow-600',
      statusIcon: Clock,
    },
    {
      id: '2',
      type: 'Home Insurance',
      status: 'Ready',
      date: '2024-01-14',
      statusColor: 'text-green-600',
      statusIcon: CheckCircle,
    },
    {
      id: '3',
      type: 'Life Insurance',
      status: 'Needs Info',
      date: '2024-01-13',
      statusColor: 'text-red-600',
      statusIcon: AlertCircle,
    },
  ]

  const recentMessages = [
    {
      id: '1',
      content: 'What does my car insurance policy cover for windshield damage?',
      date: '2024-01-15 14:30',
      requestType: 'Car Insurance',
    },
    {
      id: '2',
      content: 'Can you explain the difference between comprehensive and collision coverage?',
      date: '2024-01-15 11:15',
      requestType: 'Car Insurance',
    },
    {
      id: '3',
      content: 'What are the exclusions in my home insurance policy?',
      date: '2024-01-14 16:45',
      requestType: 'Home Insurance',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your insurance requests.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/dashboard/requests/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>
              Your latest insurance requests and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <request.statusIcon className={`h-5 w-5 ${request.statusColor}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.type}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {request.date}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${request.statusColor}`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/requests">
                <Button variant="outline" className="w-full">
                  View All Requests
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>
              Your latest conversations with the AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {message.requestType}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/chat">
                <Button variant="outline" className="w-full">
                  View All Messages
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to help you get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/requests/new">
              <Button variant="outline" className="w-full h-20 flex-col">
                <Plus className="h-6 w-6 mb-2" />
                <span>New Request</span>
              </Button>
            </Link>
            <Link href="/dashboard/chat">
              <Button variant="outline" className="w-full h-20 flex-col">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span>Start Chat</span>
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full h-20 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span>View Analytics</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
