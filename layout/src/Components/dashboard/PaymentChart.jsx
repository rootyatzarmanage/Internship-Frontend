const payments = [5000, 15000, 10000, 15000, 20000, 5000, 15000, 10000]
const gridLines = [20000, 15000, 10000, 5000, 0]

export default function PaymentChart() {
  return (
    <section className="w-[628px] rounded-md border border-[#d9d9d9] bg-[#f8f8f8] p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.01)]" aria-labelledby="payment-title">
      <h2 id="payment-title" className="text-[18px] font-semibold text-[#2a2a2a]">Payment</h2>
      <div className="mx-auto mt-4 flex h-[290px] w-full max-w-[440px] gap-2">
        <div className="flex w-10 flex-col justify-between pb-1 text-[8px] text-[#9e9e9e]">
          {gridLines.map((line) => (
            <span key={line}>{line.toLocaleString()}</span>
          ))}
        </div>
        <div className="relative flex-1 pb-1">
          <div className="absolute inset-0 flex flex-col justify-between">
            {gridLines.map((line) => (
              <span key={line} className="border-t border-[#e4e4e4]" />
            ))}
          </div>
          <div className="relative flex h-full items-end justify-around gap-2 px-2">
            {payments.map((payment, index) => (
              <div
                key={`${payment}-${index}`}
                className="w-[12%] max-w-7 rounded-t-md bg-[#0d91d9]"
                style={{ height: `${(payment / 20000) * 100}%` }}
                title={`${payment.toLocaleString()} payment`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
