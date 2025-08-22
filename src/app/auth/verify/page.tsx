import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Account Created Successfully!
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your account has been created and you can now sign in.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Insurance Copilot</CardTitle>
            <CardDescription>
              Your account is ready to use. You can now sign in to access all features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Note: Email verification has been skipped for demo purposes.
              </p>
              <Link href="/auth/sign-in">
                <Button className="w-full">
                  Continue to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
