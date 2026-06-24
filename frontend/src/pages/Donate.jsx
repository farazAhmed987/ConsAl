import DonationForm from '../components/forms/DonationForm'
import PageLayout from '../components/layout/PageLayout'

export default function Donate() {
  return (
    <PageLayout title="Donate" subtitle="Your support helps in the rescue and treatment of animals in need.">
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          { letter: 'H', title: 'Medical Care', desc: 'Provides treatment for injured and sick animals' },
          { letter: 'F', title: 'Food & Shelter', desc: 'Funds food and temporary shelter for rescued animals' },
          { letter: 'E', title: 'Emergency Rescue', desc: 'Supports urgent rescue operations across Punjab' },
        ].map(item => (
          <div key={item.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-center backdrop-blur transition hover:border-zinc-700">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-xl font-bold text-emerald-300 ring-1 ring-emerald-500/20">{item.letter}</div>
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
