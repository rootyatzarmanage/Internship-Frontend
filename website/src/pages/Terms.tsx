const sectionHeading =
  "mb-4 text-[20px] font-medium tracking-tight text-white sm:text-[23px] lg:text-[25px]";
const bodyText =
  "text-[13px] leading-6 text-white/70 sm:text-[14px] sm:leading-7 lg:text-[15px]";
const listText =
  "ml-5 list-disc space-y-2 pl-2 text-[13px] leading-6 text-white/70 sm:ml-14 sm:text-[14px] sm:leading-7 lg:ml-16 lg:text-[15px]";

export default function Terms() {
  return (
    <article className="min-h-screen bg-[#171717] px-5 pb-20 pt-8 text-white sm:px-10 sm:pb-28 sm:pt-12 lg:px-16 xl:px-20">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-[34px] font-medium uppercase tracking-[-0.04em] sm:text-[42px] lg:text-[48px]">
              Terms of Service
            </h1>
          </div>
          <p className="pt-1 text-[11px] uppercase tracking-[0.06em] text-white/55 sm:text-[12px] lg:text-[13px]">
            Latest update&nbsp; • &nbsp;October, 2026
          </p>
        </div>

        <div className="w-full mt-5 max-w-[1160px] space-y-10 sm:space-y-12">
          <p className={bodyText}>
            These Terms of Service ("Terms") govern your use of Yatzar Asset, a platform operated by Yatzar Creations Private Limited ("Yatzar Creations," "we," or "us"), where users can upload, license, and purchase assets. By accessing or using the Yatzar Asset platform (the "Platform"), you agree to comply with and be bound by these Terms. 
          </p>

          <section>
            <h2 className={sectionHeading}>01. Introduction</h2>
            <p className={bodyText}>Yatzar Asset is a platform that enables individuals and manufacturers ("Actors") to upload and license assets, and enables users ("End-Users") to purchase and download those assets. Yatzar Creations provides this platform for the benefit of Actors and End-Users, facilitating transactions involving digital assets. </p>
          </section>

          <section>
            <h2 className={sectionHeading}>02. How We Use Your Information</h2>
            <p className={bodyText}>We may use the information we collect to:</p>
            <ul className={listText}>
              <li>To create and manage your user account.</li>
              <li>To provide access to platform features and services.</li>
              <li>To process transactions and send transactional emails.</li>
              <li>To personalize your experience and recommend relevant content.</li>
              <li>To send administrative information, such as updates, support messages, and policy changes.</li>
              <li>To respond to inquiries and customer service requests.</li>
              <li>To improve our platform functionality, security, and content.</li>
              <li>To comply with legal and regulatory requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionHeading}>03. Use of Cookies</h2>
            <p className={bodyText}>
              Yatzar Asset uses cookies and similar tracking technologies to
              enhance your browsing experience, analyse site traffic, and
              deliver tailored content and services.
            </p>
            <p className={`mt-3 ${bodyText}`}>
              Cookies are small text files stored on your device when you visit
              our platform. These files help us recognize you when you return,
              remember your preferences, and provide a more customized
              experience.
            </p>
            <p className={`mt-3 ${bodyText}`}>We use the following types of cookies:</p>
            <ul className={listText}>
              <li><strong className="font-medium text-white">Essential Cookies</strong> - These are necessary for the platform to function properly. They enable core features such as user login, secure browsing, and order processing.</li>
              <li><strong className="font-medium text-white">Performance and Analytics Cookies</strong> - These cookies allow us to understand how users interact with the platform, helping us improve functionality and content. They collect anonymous data such as page visits, session duration, and error reports.</li>
              <li><strong className="font-medium text-white">Functionality Cookies</strong> - These cookies remember your settings and preferences, such as language or location, to provide a more personalized experience.</li>
              <li><strong className="font-medium text-white">Third-Party Cookies</strong> - We may allow trusted third-party services, such as analytics providers (e.g., Google Analytics) or social media tools, to set cookies on our site for performance tracking or marketing purposes.</li>
              <li>You can manage or disable cookies through your browser settings. However, please note that blocking some types of cookies may impact your experience on the platform.</li>
            </ul>
            <p className={`mt-3 ${bodyText}`}>
              By continuing to use Yatzar Asset, you consent to our use of
              cookies as described in this section.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>04. Disclosure of Information</h2>
            <p className={bodyText}>
              We may share your information in the following circumstances:
            </p>
            <ul className={listText}>
              <li>With service providers who perform services on our behalf (e.g., hosting, analytics, payment processing).</li>
              <li>With other users, when you interact with assets or community features (e.g., asset uploaders may see purchase statistics).</li>
              <li>With Manufacturers and Brands where applicable and consented, for B2B asset collaboration or data insights.</li>
            </ul>
            <p className={`mt-3 ${bodyText}`}>
              For legal reasons, such as to comply with legal obligation, or
              government request.
            </p>
            <p className={`mt-3 ${bodyText}`}>
              In a merger or acquisition, if Yatzar Creations is involved in
              such activity.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>05. Data Retention</h2>
            <p className={bodyText}>
              We retain your personal data as long as necessary to fulfil the
              purposes for which it was collected, comply with legal
              obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>06. Your Rights</h2>
            <p className={bodyText}>
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <ul className={listText}>
              <li>Access to the personal data we hold about you.</li>
              <li>Correction of inaccurate or incomplete data.</li>
              <li>Deletion of your personal data. Objection to or restriction of processing.</li>
              <li>Withdrawal of consent where processing is based on consent.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionHeading}>07. Data Security</h2>
            <p className={bodyText}>
              We implement appropriate technical and organizational measures
              to protect your personal information from unauthorized access,
              use, or disclosure.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>08. Children&apos;s Privacy</h2>
            <p className={bodyText}>
              Yatzar Asset is not intended for use by children under the age of
              13. We do not knowingly collect data from children. If you believe
              we have collected data from a minor, please contact us for
              removal.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>09. International Data Transfers</h2>
            <p className={bodyText}>
              If you access Yatzar Asset from outside India, your information
              may be transferred to, stored, and processed in India or other
              countries where we or our service providers operate.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>10. Third-Party Links</h2>
            <p className={bodyText}>
              Our platform may contain links to third-party websites or
              services. We are not responsible for their privacy practices. We
              encourage you to read their privacy policies.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>11. Changes to This Policy</h2>
            <p className={bodyText}>
              We reserve the right to update this Privacy Policy at any time.
              Changes will be posted on this page with an updated effective
              date.
            </p>
          </section>

          <section>
            <h2 className={sectionHeading}>12. Contact Us</h2>
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
