'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Upload, FileText, Home, Car, Heart, Plane, Smartphone, Save, X } from 'lucide-react'
import Link from 'next/link'

interface RequestFormData {
  type: 'HOME' | 'CAR' | 'LIFE' | 'TRAVEL' | 'GADGET'
  title: string
  description: string
  details: {
    [key: string]: any
  }
  documents: File[]
}

const requestTypes = [
  { id: 'HOME', label: 'Home Insurance', icon: Home, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { id: 'CAR', label: 'Auto Insurance', icon: Car, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { id: 'LIFE', label: 'Life Insurance', icon: Heart, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { id: 'TRAVEL', label: 'Travel Insurance', icon: Plane, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  { id: 'GADGET', label: 'Gadget Insurance', icon: Smartphone, color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
]

interface FormField {
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'textarea' | 'date'
  options?: string[]
  min?: number
  max?: number
  step?: number
}

const typeSpecificFields: Record<string, FormField[]> = {
  HOME: [
    { name: 'propertyType', label: 'Property Type', type: 'select', options: ['House', 'Apartment', 'Condo', 'Townhouse'] },
    { name: 'bedrooms', label: 'Number of Bedrooms', type: 'number', min: 1, max: 10 },
    { name: 'bathrooms', label: 'Number of Bathrooms', type: 'number', min: 1, max: 10, step: 0.5 },
    { name: 'squareFootage', label: 'Square Footage', type: 'number', min: 100 },
    { name: 'yearBuilt', label: 'Year Built', type: 'number', min: 1900, max: new Date().getFullYear() },
    { name: 'address', label: 'Property Address', type: 'text' },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'zipCode', label: 'ZIP Code', type: 'text' },
  ],
  CAR: [
    { name: 'make', label: 'Car Make', type: 'text' },
    { name: 'model', label: 'Car Model', type: 'text' },
    { name: 'year', label: 'Year', type: 'number', min: 1900, max: new Date().getFullYear() },
    { name: 'vin', label: 'VIN Number', type: 'text' },
    { name: 'mileage', label: 'Current Mileage', type: 'number', min: 0 },
    { name: 'primaryDriver', label: 'Primary Driver', type: 'text' },
    { name: 'drivingHistory', label: 'Driving History (Years)', type: 'number', min: 0, max: 50 },
  ],
  LIFE: [
    { name: 'coverageAmount', label: 'Coverage Amount ($)', type: 'number', min: 10000, step: 10000 },
    { name: 'termLength', label: 'Term Length (Years)', type: 'select', options: ['10', '15', '20', '25', '30'] },
    { name: 'age', label: 'Age', type: 'number', min: 18, max: 80 },
    { name: 'healthStatus', label: 'Health Status', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
    { name: 'occupation', label: 'Occupation', type: 'text' },
    { name: 'smoker', label: 'Smoker', type: 'select', options: ['No', 'Yes'] },
  ],
  TRAVEL: [
    { name: 'destination', label: 'Destination', type: 'text' },
    { name: 'tripDuration', label: 'Trip Duration (Days)', type: 'number', min: 1, max: 365 },
    { name: 'departureDate', label: 'Departure Date', type: 'date' },
    { name: 'returnDate', label: 'Return Date', type: 'date' },
    { name: 'travelers', label: 'Number of Travelers', type: 'number', min: 1, max: 10 },
    { name: 'tripType', label: 'Trip Type', type: 'select', options: ['Leisure', 'Business', 'Study Abroad', 'Medical'] },
    { name: 'activities', label: 'Planned Activities', type: 'textarea' },
  ],
  GADGET: [
    { name: 'deviceType', label: 'Device Type', type: 'select', options: ['Laptop', 'Smartphone', 'Tablet', 'Camera', 'Gaming Console', 'Other'] },
    { name: 'brand', label: 'Brand', type: 'text' },
    { name: 'model', label: 'Model', type: 'text' },
    { name: 'purchaseDate', label: 'Purchase Date', type: 'date' },
    { name: 'purchasePrice', label: 'Purchase Price ($)', type: 'number', min: 0, step: 0.01 },
    { name: 'condition', label: 'Device Condition', type: 'select', options: ['New', 'Like New', 'Good', 'Fair', 'Poor'] },
    { name: 'usage', label: 'Primary Usage', type: 'select', options: ['Personal', 'Business', 'Education', 'Gaming'] },
  ],
}

export default function NewRequestPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<RequestFormData>({
    type: 'HOME',
    title: '',
    description: '',
    details: {},
    documents: [],
  })

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to create a request</h2>
          <Button asChild>
            <a href="/auth/sign-in">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }

  const handleTypeSelect = (type: RequestFormData['type']) => {
    setFormData(prev => ({
      ...prev,
      type,
      details: {}, // Reset details when type changes
    }))
  }

  const handleInputChange = (field: string, value: any) => {
    if (field === 'title' || field === 'description') {
      setFormData(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({
        ...prev,
        details: { ...prev.details, [field]: value }
      }))
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }))
  }

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Insurance request created successfully!')
      router.push('/dashboard/requests')
    } catch (error) {
      toast.error('Failed to create request')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedTypeFields = typeSpecificFields[formData.type] || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/requests">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Request</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Start a new insurance request by selecting a type and filling out the details
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Request Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Insurance Type</CardTitle>
              <CardDescription>
                Choose the type of insurance you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {requestTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleTypeSelect(type.id as RequestFormData['type'])}
                      className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                        formData.type === type.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${type.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {type.label}
                          </h3>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide a title and description for your request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Request Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Home Insurance for 3-bedroom house"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide additional details about your insurance needs..."
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Type-Specific Fields */}
          {formData.type && (
            <Card>
              <CardHeader>
                <CardTitle>{requestTypes.find(t => t.id === formData.type)?.label} Details</CardTitle>
                <CardDescription>
                  Provide specific information for your {requestTypes.find(t => t.id === formData.type)?.label.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTypeFields.map((field) => (
                    <div key={field.name}>
                      <Label htmlFor={field.name}>{field.label}</Label>
                      {field.type === 'select' ? (
                        <select
                          id={field.name}
                          value={formData.details[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          id={field.name}
                          value={formData.details[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                          rows={3}
                        />
                      ) : (
                        <Input
                          id={field.name}
                          type={field.type}
                          value={formData.details[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          required
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Documents
              </CardTitle>
              <CardDescription>
                Upload relevant documents to support your request (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="documents">Select Files</Label>
                <Input
                  id="documents"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
                </p>
              </div>

              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Documents</Label>
                  <div className="space-y-2">
                    {formData.documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">{file.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard/requests">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Creating Request...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
