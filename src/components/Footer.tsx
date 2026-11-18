import Link from 'next/link'
import { MessageCircle, Globe, Camera, Share2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-[#f6f3ea] border-t border-[#003422]/10 mt-20">
      <div className="w-full px-5 md:px-12 py-16 max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand */}
          <div className="md:col-span-1 space-y-3">
            <span className="font-headline text-2xl uppercase tracking-wider text-[#003422] font-semibold block">
              BLESSED DRINKS
            </span>
            <p className="text-xs text-[#404943] leading-relaxed">
              Curated Ghanaian botanical infusions, crafted in small batches honoring local harvest
              rhythms and ancestral refreshment.
            </p>
            <span className="text-[10px] uppercase tracking-wider text-[#ffcd70] bg-[#003422] px-3 py-1 inline-block font-semibold">
              Accra & Tema Delivery
            </span>
          </div>

          {/* Column 2: WhatsApp Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#1c1c17]">
              Direct Allocation
            </h4>
            <p className="text-xs text-[#404943]">WhatsApp Order Desk:</p>
            <a
              href="https://wa.me/233240001234"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold text-[#003422] hover:text-[#7c5800] transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-[#7c5800]" />
              +233 24 000 1234
            </a>
            <p className="text-[11px] text-[#404943]">
              Same-day chilled courier dispatched daily.
            </p>
          </div>

          {/* Column 3: Social & Story */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#1c1c17]">
              Archive & Story
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="text-xs text-[#404943] hover:text-[#003422] transition-colors flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Instagram
              </a>
              <a
                href="#"
                className="text-xs text-[#404943] hover:text-[#003422] transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Social Channels
              </a>
              <a
                href="#"
                className="text-xs text-[#404943] hover:text-[#003422] transition-colors flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Online Journal
              </a>
            </div>
          </div>

          {/* Column 4: Pledge */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#1c1c17]">
              Our Pledge
            </h4>
            <p className="text-xs text-[#404943] leading-relaxed">
              100% natural, unpasteurized cold extracts. Sustainably sourced across Greater Accra,
              Volta, and Eastern agrarian networks.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#003422]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[11px] text-[#404943]">
            © {new Date().getFullYear()} Blessed Drinks Ghana. Handcrafted in Accra. All rights
            reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-[11px] text-[#404943] hover:text-[#003422] transition-colors"
            >
              Operations Portal
            </Link>
            <span className="text-[11px] text-[#404943]">Wholesale Logistics</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
