'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import { Upload, FileText, Database, Settings, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface IngestionJob {
  id: string
  filename: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  progress: number
  createdAt: Date
  completedAt?: Date
  error?: string
}

export default function AdminPage() {
  const { data: session } = useSession()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [jobs, setJobs] = useState<IngestionJob[]>([
    {
      id: '1',
      filename: 'home_insurance_policy.pdf',
      status: 'COMPLETED',
      progress: 100,
      createdAt: new Date('2024-01-20'),
      completedAt: new Date('2024-01-20'),
    },
    {
      id: '2',
      filename: 'auto_insurance_terms.pdf',
      status: 'PROCESSING',
      progress: 65,
      createdAt: new Date('2024-01-22'),
    },
    {
      id: '3',
      filename: 'life_insurance_guide.pdf',
      status: 'PENDING',
      progress: 0,
      createdAt: new Date('2024-01-22'),
    },
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate file upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Create new ingestion job
      const newJob: IngestionJob = {
        id: Date.now().toString(),
        filename: files[0].name,
        status: 'PENDING',
        progress: 0,
        createdAt: new Date(),
      }

      setJobs(prev => [newJob, ...prev])
      toast.success(`File ${files[0].name} uploaded successfully!`)
      
      // Simulate job processing
      setTimeout(() => {
        setJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { ...job, status: 'PROCESSING' as const, progress: 50 }
            : job
        ))
      }, 2000)

      setTimeout(() => {
        setJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { ...job, status: 'COMPLETED' as const, progress: 100, completedAt: new Date() }
            : job
        ))
        toast.success(`Document ${files[0].name} processed and indexed!`)
      }, 5000)

    } catch (error) {
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const getStatusIcon = (status: IngestionJob['status']) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'PROCESSING':
        return <Database className="h-4 w-4 text-blue-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'FAILED':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: IngestionJob['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to access admin</h2>
          <Button asChild>
            <a href="/auth/sign-in">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }

  // Check if user is admin (mock check)
  if (session.user?.email !== 'admin@example.com') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have permission to access the admin panel.
          </p>
          <Button asChild>
            <a href="/dashboard">Return to Dashboard</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage document ingestion and RAG pipeline
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Upload */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Documents
                </CardTitle>
                <CardDescription>
                  Upload insurance policy documents for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Select Document</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    disabled={isUploading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, TXT
                  </p>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploading}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Vector Database</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Online
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">AI Service</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Online
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Storage</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Online
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ingestion Jobs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Ingestion Jobs
                </CardTitle>
                <CardDescription>
                  Monitor document processing and indexing status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No ingestion jobs found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(job.status)}
                            <div>
                              <h4 className="font-medium">{job.filename}</h4>
                              <p className="text-sm text-gray-500">
                                {job.createdAt.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Processing</span>
                            <span>{job.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                job.status === 'FAILED' 
                                  ? 'bg-red-600' 
                                  : job.status === 'COMPLETED'
                                  ? 'bg-green-600'
                                  : 'bg-blue-600'
                              }`}
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {job.error && (
                          <p className="text-sm text-red-600 mt-2">{job.error}</p>
                        )}

                        {job.completedAt && (
                          <p className="text-sm text-gray-500 mt-2">
                            Completed: {job.completedAt.toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
