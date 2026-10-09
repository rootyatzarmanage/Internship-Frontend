const sectionHeading =
  "mb-4 text-[20px] font-medium tracking-tight text-white sm:text-[23px] lg:text-[25px]";
const bodyText =
  "text-[13px] leading-6 text-white/70 sm:text-[14px] sm:leading-7 lg:text-[15px]";
const listText =
  "ml-5 list-none space-y-2 pl-2 text-[13px] leading-6 text-white/70 sm:ml-14 sm:text-[14px] sm:leading-7 lg:ml-16 lg:text-[15px] [&>li]:relative [&>li]:pl-5 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:content-['-']";

export default function Terms() {
  return (
    <article className="min-h-screen bg-[#171717] px-5 pb-20 pt-8 text-white sm:px-10 sm:pb-28 sm:pt-12 lg:px-16 xl:px-20">
      <div className="mx-auto w-full max-w-[1240px]">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-[34px] font-medium uppercase tracking-[-0.04em] sm:text-[42px] lg:text-[48px]">
              Refund Policy
            </h1>
          </div>
          <p className="pt-1 text-[11px] uppercase tracking-[0.06em] text-white/55 sm:text-[12px] lg:text-[13px]">
            Latest update&nbsp; • &nbsp;October, 2026
          </p>
        </header>

        <div className="mt-5 w-full max-w-[1160px] space-y-10 sm:space-y-12">
          <section>
            <h2 className={sectionHeading}>01. Sales Finality</h2>
            <p className={bodyText}>
              All sales of assets on the Yatzar Asset platform are final. No refunds shall be issued except as expressly provided in this Agreement or as required by applicable law.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>02. Immediate Access and Withdrawal Waiver </h2>
            <p className={bodyText}>Assets are made immediately available for download upon the END-USER’s confirmation of purchase. Accordingly, the END-USER expressly waives any right of withdrawal or cancellation once the order has been accepted.</p>
          </section>

          <section>
            <h2 className={sectionHeading}>03. Discretionary Refund Requests </h2>
            <p className={bodyText}>Refunds may be considered at the sole discretion of Yatzar Asset in the following situations:
            </p>
            <ul className={listText}>
              <li>The asset is materially different from its description on the Yatzar Asset platform, including but not limited to missing features or files.</li>
              <li>The asset is non-functional or significantly defective, and the END-USER has made a reasonable effort to resolve the issue with the actor manufacturer.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionHeading}>04. Manual Review Requirement</h2>
            <ul className={listText}>
              <li>Access and Usage: You may only use the Platform in compliance with these Terms, applicable laws, and any additional terms and conditions specific to certain features or services of the Platform.</li>
              <li>Prohibited Uses: You may not use the Platform for any illegal, harmful, or fraudulent activity. You are prohibited from infringing upon the intellectual property rights of others or uploading content that violates any laws or regulations.</li>
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
