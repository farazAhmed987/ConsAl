import { useState } from 'react'
import api from '../../api/client'
import { useAuth } from '../../hooks/useAuth'

export default function DonationForm({ onSuccess }) {
  const { user } = useAuth()
  const [form, setForm] = useState({ donor_name: user?.name || '', donor_email: user?.email || '', amount: '', payment_method: 'credit_card', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [step, setStep] = useState('form')

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const setAmount = val => setForm(prev => ({ ...prev, amount: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.donor_name || !form.amount || parseFloat(form.amount) <= 0) {
      setError('Name and a valid amount are required')
      return
    }
    setStep('processing')
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 2000))
    try {
      const res = await api.post('/donations', form)
      setReceipt(res.data)
      setStep('receipt')
      onSuccess?.(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Donation failed')
      setStep('form')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'processing') {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-12 text-center backdrop-blur">
        <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-zinc-800 border-t-emerald-500"></div>
        <p className="text-xl font-semibold text-zinc-50">Processing your donation...</p>
        <p className="mt-2 text-sm text-zinc-400">Please do not close this page</p>
        <div className="mt-6 inline-block rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-left text-sm text-zinc-300">
          <p>Amount: <strong className="text-emerald-300">${parseFloat(form.amount).toFixed(2)}</strong></p>
          <p>Method: <strong className="capitalize text-zinc-100">{form.payment_method.replace('_', ' ')}</strong></p>
        </div>
      </div>
    )
  }

  if (step === 'receipt' && receipt) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center backdrop-blur">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-500/30">
          <span className="text-3xl text-emerald-300">✓</span>
        </div>
        <h3 className="mb-2 text-2xl font-bold tracking-tight text-zinc-50">Thank You, {receipt.donor_name}!</h3>
        <p className="mb-6 text-zinc-400">Your generous donation of <strong className="text-emerald-300">${parseFloat(receipt.amount).toFixed(2)}</strong> will help animals in need.</p>
        <div className="mx-auto inline-block max-w-sm rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 text-left">
          <p className="text-sm"><span className="text-zinc-500">Transaction ID:</span><br/><span className="font-mono font-bold text-zinc-100">{receipt.transaction_id}</span></p>
          <p className="mt-2 text-sm"><span className="text-zinc-500">Date:</span><br/><span className="text-zinc-300">{new Date(receipt.created_at).toLocaleString()}</span></p>
          <p className="mt-2 text-sm"><span className="text-zinc-500">Method:</span><br/><span className="capitalize text-zinc-300">{receipt.payment_method.replace('_', ' ')}</span></p>
        </div>
        <div>
          <button onClick={() => { setStep('form'); setReceipt(null); setForm(prev => ({ ...prev, amount: '', notes: '' })) }}
            className="mt-8 rounded-full bg-emerald-400 px-8 py-2.5 font-semibold text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300">
            Make Another Donation
          </button>
        </div>
      </div>
    )
  }

  const presetAmounts = [10, 25, 50, 100]

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur md:p-8">
      <h3 className="mb-6 text-xl font-bold tracking-tight text-zinc-50">Donation Details</h3>
      {error && <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Donor Name <span className="text-emerald-300">*</span></label>
          <input name="donor_name" value={form.donor_name} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Email</label>
          <input name="donor_email" type="email" value={form.donor_email} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">Amount <span className="text-emerald-300">*</span></label>
        <div className="mb-3 flex flex-wrap gap-3">
          {presetAmounts.map(a => (
            <button key={a} type="button" onClick={() => setAmount(a)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                parseFloat(form.amount) === a ? 'border-emerald-500 bg-emerald-400 text-zinc-950' : 'border-zinc-700 bg-zinc-950/40 text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-300'
              }`}>
              ${a}
            </button>
          ))}
        </div>
        <input name="amount" type="number" step="0.01" min="1" value={form.amount} onChange={handleChange}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 md:w-64"
          placeholder="Or enter custom amount" required />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Payment Method</label>
          <select name="payment_method" value={form.payment_method} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30">
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Notes (optional)</label>
          <input name="notes" value={form.notes} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            placeholder="Any special message?" />
        </div>
      </div>
      <div className="mt-8">
        <button type="submit" disabled={submitting}
          className="rounded-full bg-emerald-400 px-10 py-2.5 text-lg font-semibold text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:opacity-50">
          {submitting ? 'Processing...' : `Donate ${form.amount ? `$${form.amount}` : ''}`}
        </button>
      </div>
    </form>
  )
}
