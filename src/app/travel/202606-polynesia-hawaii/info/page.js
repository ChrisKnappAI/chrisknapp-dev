'use client'

function Card({ title, icon, children }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid rgba(8,145,178,0.12)',
      borderRadius: 14, padding: '15px 16px', marginBottom: 14,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        paddingBottom: 10, marginBottom: 12,
        borderBottom: '1px solid rgba(8,145,178,0.08)',
      }}>
        <span style={{ fontSize: '1.15rem' }}>{icon}</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0C4A6E' }}>{title}</span>
      </div>
      <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'flex-start' }}>
      <span style={{ color: '#94A3B8', fontWeight: 500, minWidth: 115, flexShrink: 0, fontSize: '0.78rem' }}>{label}</span>
      <span style={{ color: highlight ? '#0891B2' : '#0F172A', fontWeight: highlight ? 600 : 400, flex: 1 }}>{value || '—'}</span>
    </div>
  )
}

export default function InfoPage() {
  return (
    <div style={{ padding: '16px 16px 24px' }}>
      <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: 16 }}>
        Add confirmation numbers and details as you book them.
      </div>

      <Card title="Flights" icon="✈️">
        <Row label="Outbound" value="Southwest — Jun 26, 9:00am → LAX 10:30am" />
        <Row label="LAX → Tahiti" value="Jun 26, 11:00pm → Jun 27, ~4:00am (budget $800+ for bags)" />
        <Row label="Return" value="Southwest — Jul 15, 9:00pm from Honolulu" />
        <Row label="SW Confirmation" value="[Add confirmation #]" />
        <Row label="Tahiti Airline" value="[Add carrier + confirmation #]" />
      </Card>

      <Card title="NCL Cruise" icon="🚢">
        <Row label="Cruise Line" value="Norwegian Cruise Line (NCL)" />
        <Row label="Booking #" value="[Add booking #]" />
        <Row label="Departs" value="Jul 3 — Papeete, Tahiti, 10:00pm" />
        <Row label="Returns" value="Jul 15 — Honolulu, Hawaii" />
        <Row label="Ports" value="Tahiti · Moorea · Raiatea · Bora Bora · 5 days at sea · Hilo · Kauai · Maui · Honolulu" />
        <Row label="Cabin" value="[Add cabin #]" />
        <Row label="Final Payment" value="[Add date]" />
      </Card>

      <Card title="Moorea — Lodging" icon="🏠">
        <Row label="Nights" value="Jun 27 (Sat) – Jul 3 (Fri) · 6 nights" />
        <Row label="Property" value="[Add name]" />
        <Row label="Address" value="[Add address]" />
        <Row label="Confirmation" value="[Add confirmation #]" />
        <Row label="Check-in" value="[Add check-in instructions]" />
        <Row label="Host Contact" value="[Add host info]" />
      </Card>

      <Card title="Car Rental — Tahiti" icon="🚗">
        <Row label="Dates" value="Jun 27 — pickup at airport, return before ferry" />
        <Row label="Company" value="[Add rental company]" />
        <Row label="Confirmation" value="[Add confirmation #]" />
        <Row label="Notes" value="International Driver's License required" highlight />
      </Card>

      <Card title="Ferries — Tahiti ↔ Moorea" icon="⛴️">
        <Row label="Companies" value="Aremiti Ferry or Terevau — reserve round trip in advance" highlight />
        <Row label="Outbound" value="Jun 27 — Papeete to Moorea, [time TBD]" />
        <Row label="Return" value="Jul 3 — Moorea to Papeete, morning departure" />
        <Row label="Confirmation" value="[Add confirmation #]" />
        <Row label="Duration" value="~30–45 min each way" />
      </Card>

      <Card title="Cruise Excursions" icon="🤿">
        <Row label="Raiatea (Jul 5)" value="[Need to book excursion]" />
        <Row label="Bora Bora (Jul 6)" value="[Need to book excursion]" highlight />
        <Row label="Hilo (Jul 12)" value="[Need to book excursion]" />
        <Row label="Kauai (Jul 13)" value="[Need to book excursion]" />
        <Row label="Maui (Jul 14)" value="[Need to book excursion]" />
        <Row label="Honolulu (Jul 15)" value="NCL Oahu Excursion w/ airport drop — book through NCL" highlight />
      </Card>

      <Card title="Important Details" icon="📋">
        <Row label="Currency" value="CFP Franc (XPF) in French Polynesia · USD in Hawaii" />
        <Row label="Cash" value="Get cash before trip — how to spend in Tahiti TBD" />
        <Row label="Intl License" value="Obtain before Jun 26" highlight />
        <Row label="Pet Sitter" value="[Add Cusco pet sitter name + contact]" />
        <Row label="Sleeping Pills" value="Slow release — fill prescription before trip" />
        <Row label="Travel Insurance" value="[Add policy info]" />
        <Row label="Emergency #" value="[Add emergency contacts]" />
      </Card>
    </div>
  )
}
