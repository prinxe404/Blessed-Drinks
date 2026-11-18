import Link from 'next/link'
import { CheckCircle2, MessageCircle, ArrowLeft, Home } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const { ref } = await searchParams
  const orderRef = ref || '#BD-PENDING'

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f0]">
      <Header />

      <main className="w-full pt-28 pb-20 px-5 md:px-12 flex-1 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white p-8 sm:p-12 border border-[#003422]/20 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#f1eee5] text-[#003422] flex items-center justify-center mx-auto border border-[#003422]/20">
            <CheckCircle2 className="w-10 h-10 text-[#003422]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#7c5800] font-bold">
              Order Logged in Pending Status
            </span>
            <h1 className="font-headline text-3xl text-[#003422] font-semibold">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-[#404943]">
              Your order reference is{' '}
              <span className="font-mono font-bold text-[#003422]">{orderRef}</span>
            </p>
          </div>

          <div className="bg-[#f6f3ea] p-5 text-left border border-[#003422]/10 space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#003422]">
              Next Steps for Final Confirmation:
            </h3>
            <ol className="text-xs text-[#404943] space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                Send the prepared order summary in the WhatsApp chat that just opened.
              </li>
              <li>
                Our Accra dispatch team will verify fresh batch availability and calculate courier ETA.
              </li>
              <li>
                Confirm and complete payment via Mobile Money (MTN MoMo or Telecel Cash) upon rider dispatch.
              </li>
            </ol>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/233593457520"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#003422] hover:bg-[#174c36] text-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-[#ffcd70]" />
              <span>Open WhatsApp Chat</span>
            </a>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ebe8df] text-[#1c1c17] hover:bg-[#e5e2da] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
