import DonationForm from '../components/forms/DonationForm'
import PageLayout from '../components/layout/PageLayout'

export default function Donate() {
  return (
    <PageLayout title="Donate" subtitle="Your support helps in the rescue and treatment of animals in need.">
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          { icon: '🏥', title: 'Medical Care', desc: 'Provides treatment for injured and sick animals' },
          { icon: '🍲', title: 'Food & Shelter', desc: 'Funds food and temporary shelter for rescued animals' },
          { icon: '🚑', title: 'Emergency Rescue', desc: 'Supports urgent rescue operations across Punjab' },
        ].map(item => (
          <div key={item.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-center backdrop-blur transition hover:border-zinc-700">
            <span className="mb-3 block text-3xl">{item.icon}</span>
            <h4 className="font-bold text-zinc-100">{item.title}</h4>
            <p className="mt-1 text-xs text-zinc-400">{item.desc}</p>
          </div>
        ))}
      </div>
      <DonationForm />
      <div className="mt-6 text-center text-xs text-zinc-500">
        This is a dummy donation system. No real transactions take place.
      </div>
    </PageLayout>
  )
}
