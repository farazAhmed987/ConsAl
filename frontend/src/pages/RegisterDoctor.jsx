import RegisterDoctorForm from '../components/forms/RegisterDoctorForm'
import PageLayout from '../components/layout/PageLayout'

export default function RegisterDoctor() {
  return (
    <PageLayout title="Register a Doctor" subtitle="Know a veterinarian? Submit their details for admin approval.">
      <div className="mb-6 rounded-lg border-l-4 border-emerald-500 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
        <strong>Note:</strong> Registrations require admin approval before appearing on the map and listings.
      </div>
      <RegisterDoctorForm />
    </PageLayout>
  )
}
