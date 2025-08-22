'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Archive, Eye, Edit } from 'lucide-react'

interface InsuranceRequest {
  id: string
  type: 'HOME' | 'CAR' | 'LIFE' | 'TRAVEL' | 'GADGET'
  status: 'DRAFT' | 'SUBMITTED' | 'NEEDS_INFO' | 'IN_REVIEW' | 'READY' | 'ARCHIVED'
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  documentsCount: number
  estimatedPremium?: number
}

const requestTypes = {
  HOME: { label: 'Home Insurance', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  CAR: { label: 'Auto Insurance', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  LIFE: { label: 'Life Insurance', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  TRAVEL: { label: 'Travel Insurance', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  GADGET: { label: 'Gadget Insurance', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
}

const statusConfig = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', icon: FileText },
  SUBMITTED: { label: 'Submitted', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Clock },
  NEEDS_INFO: { label: 'Needs Info', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: AlertCircle },
  IN_REVIEW: { label: 'In Review', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: Clock },
  READY: { label: 'Ready', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
  ARCHIVED: { label: 'Archived', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: Archive },
}

export default function RequestsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<InsuranceRequest[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      loadRequests()
    }
  }, [session])

  const loadRequests = async () => {
    try {
      // Mock data - replace with actual API call
      const mockRequests: InsuranceRequest[] = [
        {
          id: '1',
          type: 'HOME',
          status: 'READY',
          title: 'Home Insurance Renewal',
          description: 'Annual renewal for 3-bedroom house in New York',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          documentsCount: 5,
          estimatedPremium: 1200,
        },
        {
          id: '2',
          type: 'CAR',
          status: 'IN_REVIEW',
          title: 'New Auto Policy',
          description: 'Insurance for 2023 Tesla Model 3',
          createdAt: new Date('2024-01-18'),
          updatedAt: new Date('2024-01-19'),
          documentsCount: 3,
          estimatedPremium: 1800,
        },
        {
          id: '3',
          type: 'LIFE',
          status: 'NEEDS_INFO',
          title: 'Term Life Insurance',
          description: '20-year term policy for $500,000 coverage',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-17'),
          documentsCount: 2,
        },
        {
          id: '4',
          type: 'TRAVEL',
          status: 'DRAFT',
          title: 'International Travel Coverage',
          description: 'Annual travel insurance for business trips',
          createdAt: new Date('2024-01-22'),
          updatedAt: new Date('2024-01-22'),
          documentsCount: 0,
        },
        {
          id: '5',
          type: 'GADGET',
          status: 'SUBMITTED',
          title: 'Electronics Protection',
          description: 'Coverage for laptop, phone, and camera',
          createdAt: new Date('2024-01-16'),
          updatedAt: new Date('2024-01-18'),
          documentsCount: 4,
          estimatedPremium: 150,
        },
      ]

      setRequests(mockRequests)
    } catch (error) {
      toast.error('Failed to load requests')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(req => req.status === filter)

  const getStatusIcon = (status: keyof typeof statusConfig) => {
    const IconComponent = statusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  const handleCreateRequest = () => {
    router.push('/dashboard/requests/new')
  }

  const handleViewRequest = (requestId: string) => {
    router.push(`/dashboard/requests/${requestId}`)
  }

  const handleEditRequest = (requestId: string) => {
    toast.success(`Editing request ${requestId}`)
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to access requests</h2>
          <Button asChild>
            <a href="/auth/sign-in">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Insurance Requests</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your insurance requests and track their progress
            </p>
          </div>
          <Button onClick={handleCreateRequest} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All ({requests.length})
          </Button>
          {Object.entries(statusConfig).map(([status, config]) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              onClick={() => setFilter(status)}
              size="sm"
              className="flex items-center gap-2"
            >
              {getStatusIcon(status as keyof typeof statusConfig)}
              {config.label} ({requests.filter(r => r.status === status).length})
            </Button>
          ))}
        </div>

        {/* Requests Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No requests found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {filter === 'all' 
                  ? 'Get started by creating your first insurance request.'
                  : `No requests with status "${statusConfig[filter as keyof typeof statusConfig]?.label}".`
                }
              </p>
              {filter !== 'all' && (
                <Button variant="outline" onClick={() => setFilter('all')}>
                  View All Requests
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {request.description}
                      </CardDescription>
                    </div>
                    <Badge className={requestTypes[request.type].color}>
                      {requestTypes[request.type].label}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <Badge variant="outline" className={statusConfig[request.status].color}>
                      {statusConfig[request.status].label}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Documents:</span>
                      <span className="font-medium">{request.documentsCount}</span>
                    </div>
                    {request.estimatedPremium && (
                      <div className="flex justify-between">
                        <span>Est. Premium:</span>
                        <span className="font-medium">${request.estimatedPremium.toLocaleString()}/year</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="font-medium">
                        {request.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span className="font-medium">
                        {request.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRequest(request.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {request.status === 'DRAFT' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRequest(request.id)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    {request.status === 'READY' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Ready
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
