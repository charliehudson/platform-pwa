import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Last updated: January 2024
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Insurance Copilot Terms of Service</CardTitle>
            <CardDescription>
              Please read these terms carefully before using our service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">1. Service Description</h3>
              <p>
                Insurance Copilot is an AI-powered platform that helps users understand and analyze insurance policies. 
                Our service provides intelligent insights, policy comparisons, and recommendations based on document analysis.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">2. User Responsibilities</h3>
              <p>
                Users are responsible for providing accurate information, maintaining the security of their accounts, 
                and ensuring they have the right to upload any documents they submit for analysis.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">3. AI Analysis Disclaimer</h3>
              <p>
                While our AI provides intelligent analysis, it should not be considered as professional legal or 
                financial advice. Users should consult with qualified professionals for critical decisions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">4. Data Privacy</h3>
              <p>
                We take data privacy seriously. All uploaded documents are processed securely and in accordance 
                with our Privacy Policy. We do not share personal information with third parties without consent.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">5. Service Availability</h3>
              <p>
                We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                We reserve the right to modify or discontinue services with reasonable notice.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500">
                By using Insurance Copilot, you agree to these terms. If you have any questions, 
                please contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link href="/auth/sign-up">
            <Button variant="outline">Back to Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
