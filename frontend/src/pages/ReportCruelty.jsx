import { useState } from 'react'
import ReportCrueltyForm from '../components/forms/ReportCrueltyForm'
import PageLayout from '../components/layout/PageLayout'

export default function ReportCruelty() {
  const [success, setSuccess] = useState(null)

  const handleSuccess = () => {
    setSuccess('Report submitted successfully. Thank you for speaking up for animals.')
    setTimeout(() => setSuccess(null), 6000)
  }

  return (
    <PageLayout title="Report Animal Cruelty" subtitle="Your report helps us take action. All reports are confidential.">
      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border-l-4 border-emerald-500 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          <span>✓</span> {success}
        </div>
      )}
      <ReportCrueltyForm onSuccess={handleSuccess} />
    </PageLayout>
  )
}
