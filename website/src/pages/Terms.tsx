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
              Terms of Service
            </h1>
          </div>
          <p className="pt-1 text-[11px] uppercase tracking-[0.06em] text-white/55 sm:text-[12px] lg:text-[13px]">
            Latest update&nbsp; • &nbsp;October, 2026
          </p>
        </header>

        <div className="mt-5 w-full max-w-[1160px] space-y-10 sm:space-y-12">
          <p className={bodyText}>
            These Terms of Service (&quot;Terms&quot;) govern your use of Yatzar
            Asset, a platform operated by Yatzar Creations Private Limited
            (&quot;Yatzar Creations,&quot; &quot;we,&quot; or &quot;us&quot;),
            where users can upload, license, and purchase assets. By accessing
            or using the Yatzar Asset platform (the &quot;Platform&quot;), you
            agree to comply with and be bound by these Terms.
          </p>

          <section>
            <h2 className={sectionHeading}>01. Introduction</h2>
            <p className={bodyText}>
              Yatzar Asset is a platform that enables individuals and
              manufacturers (&quot;Actors&quot;) to upload and license assets,
              and enables users (&quot;End-Users&quot;) to purchase and download
              those assets. Yatzar Creations provides this platform for the
              benefit of Actors and End-Users, facilitating transactions
              involving digital assets.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>02. How We Use Your Information</h2>
            <ul className={listText}>
              <li>Yatzar Asset: The platform operated by Yatzar Creations that facilitates the upload, sale, purchase, and licensing of digital assets.</li>
              <li>End-User: An individual or organization that accesses and uses Yatzar Asset, including customers who purchase and download assets.</li>
              <li>Actor: An individual or entity that uploads assets to Yatzar Asset for distribution either free of charge or for payment.</li>
              <li>Manufacturer: A brand or entity that uploads digital assets and models to Yatzar Asset, either directly or through third-party services.</li>
              <li>Brands: Entities or organizations that are involved in the development and marketing of assets, often in collaboration with manufacturers and actors.</li>
              <li>Assets: Digital files, models, and other types of intellectual property uploaded by Actors, Manufacturers, or Yatzar Asset itself to be distributed through the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionHeading}>03. Eligibility and Account Registration</h2>
            <p className={bodyText}>
              To access and use the Platform, you must register an account. By
              registering, you confirm that you are at least 18 years old or
              have the consent of a guardian if you are under 18. You agree to
              provide accurate and complete information during the registration
              process and to update your information as necessary.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>04. Use of the Platform</h2>
            <ul className={listText}>
              <li>Access and Usage: You may only use the Platform in compliance with these Terms, applicable laws, and any additional terms and conditions specific to certain features or services of the Platform.</li>
              <li>Prohibited Uses: You may not use the Platform for any illegal, harmful, or fraudulent activity. You are prohibited from infringing upon the intellectual property rights of others or uploading content that violates any laws or regulations.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionHeading}>05. Uploading and Licensing of Assets</h2>
            <ul className={listText}>
              <li>Uploading Assets: Actors may upload assets to the Platform. By uploading an asset, the Actor grants Yatzar Creations the right to display and distribute the asset to End-Users and other actors on the Platform.</li>
              <li>Licensing: All assets are licensed on a non-exclusive basis to End-Users. The license allows End-Users to use the asset in accordance with the description provided on the Platform. The license is non-transferable and cannot be sublicensed to others.</li>
              <li>Modification of Assets: Yatzar Creations reserves the right to modify assets to ensure compatibility with its platform.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionHeading}>06. Payment Terms</h2>
            <ul className={listText}>
              <li>Pricing: The price of assets will be set by the Actor and is displayed at the time of purchase. Yatzar Creations may charge a service fee for transactions conducted on the Platform.</li>
              <li>Payment Method: Payment for assets must be made through accepted payment methods, such as credit card or other payment gateways supported by the Platform.</li>
              <li>Sales Tax: Sales tax may be added to the price of assets where applicable based on the End-User&apos;s location.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionHeading}>07. Intellectual Property Rights</h2>
            <ul className={listText}>
              <li>Ownership: Actors retain ownership of their assets. Yatzar Creations does not claim ownership over the assets but is granted a license to use, display, and distribute them in connection with the Platform.</li>
              <li>Infringement: If you believe your intellectual property rights have been violated, please contact us at reachus@yatzarasset.com to submit a claim.</li>
              <li>Withdrawal: Once an order is accepted, the End-User waives the right of withdrawal.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionHeading}>08. Refund and Cancellation Policy</h2>
            <ul className={listText}>
              <li>Refunds: All sales are final, and there are no refunds, except as specified in this section. For more details on refund eligibility and conditions, please refer to the Refund Policy.</li>
              <li>Withdrawal: Once an order is accepted, the End-User waives the right of withdrawal.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionHeading}>09. Platform Rules and Restrictions</h2>
            <p className={bodyText}>General Restrictions:</p>
            <p className={`mt-3 ${bodyText}`}>You agree not to:</p>
            <ul className={listText}>
              <li>Engage in activities that disrupt or interfere with the functioning of the Platform.</li>
              <li>Engage in activities that disrupt or interfere with the functioning of the Platform.</li>
            </ul>
            <p className={`mt-3 ${bodyText}`}>
              Termination: Yatzar Creations may suspend or terminate access to
              the Platform for any user who violates these Terms or engages in
              prohibited conduct.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>10. Termination</h2>
            <p className={bodyText}>
              We reserve the right to suspend or terminate your access to the
              Platform at any time for any reason, including violations of
              these Terms. Upon termination, you will no longer be permitted to
              use the Platform, and any licenses granted to you for assets will
              be revoked.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>11. Disclaimers and Limitation of Liability</h2>
            <ul className={listText}>
              <li>Disclaimer: The Platform is provided &quot;as is,&quot; without any warranties of any kind, either express or implied. Yatzar Creations does not guarantee the availability or accuracy of the Platform or any assets.</li>
              <li>Disclaimer: The Platform is provided &quot;as is,&quot; without any warranties of any kind, either express or implied. Yatzar Creations does not guarantee the availability or accuracy of the Platform or any assets.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionHeading}>12. Indemnification</h2>
            <p className={bodyText}>
              You agree to indemnify and hold Yatzar Creations harmless from
              any claims, damages, or liabilities arising from your use of the
              Platform, including any violations of these Terms or infringement
              of third-party rights.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>13. Governing Law and Dispute Resolution</h2>
            <p className={bodyText}>
              These Terms shall be governed by and construed in accordance with
              the laws of India, with exclusive jurisdiction in the courts of
              Coimbatore, Tamil Nadu. Any disputes arising out of or in
              connection with these Terms shall be resolved through binding
              arbitration in the courts of Coimbatore, Tamil Nadu, India.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>14. Modifications to the Terms</h2>
            <p className={bodyText}>
              Yatzar Creations reserves the right to modify these Terms at any
              time. Any changes will be posted on the Platform, and your
              continued use of the Platform after the posting of changes
              constitutes your acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>15. Contact Information</h2>
            <p className={bodyText}>
              If you have any questions about this Privacy Policy or our data
              practices, please contact:
            </p>
            <address className="mt-3 not-italic text-[13px] leading-6 text-white/65 sm:text-[14px] sm:leading-7 lg:text-[15px]">
              <strong className="font-medium text-white">Yatzar Creations Private Limited</strong>
              <br />
              PSG-STEP: Innsphere, PSG College of Technology,
              <br />
              Peelamedu, Coimbatore - 641 004,
              <br />
              Tamil Nadu, India
              <br />
              <br />
              Email: reachus@yatzarmanage.com
            </address>
          </section>
        </div>
      </div>
    </article>
  );
}
