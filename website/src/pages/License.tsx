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
            <h1 className="text-[34px] font-medium uppercase sm:text-[42px] lg:text-[48px]">
              License Agreement
            </h1>
          </div>
          <p className="pt-1 text-[11px] uppercase tracking-[0.06em] text-white/55 sm:text-[12px] lg:text-[13px]">
            Latest update&nbsp; • &nbsp;October, 2026
          </p>
        </header>

        <div className="mt-5 w-full max-w-[1160px] space-y-10 sm:space-y-12">
            <p className={bodyText}>This License Agreement ("Agreement") is made between the end user ("You") and Yatzar Creations Private Limited ("Yatzar"), the registered company that owns and operates the Yatzar Manage platform. By downloading, using, or accessing any digital content (“Manage”) on the Yatzar Manage platform, you agree to be bound by the terms of this Agreement.</p>
          <section>
            <h2 className={sectionHeading}>01. Definitions</h2>
            <ul className={listText}>
                <li>“Asset(s)” refer to any digital files, including, but not limited to, models, visuals, textures, media, documents, or any other file uploaded to the platform.</li>
                <li>“Actor(s)” are individuals or entities who upload Assets on the platform for free or for payment.</li>
                <li>“Manufacturer(s)” are product manufacturers who upload Assets representing their products or commission Yatzar Asset to create and upload such Assets.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionHeading}>02. Grant Of License </h2>
            <p className={bodyText}>Yatzar Asset hereby grants you a non-exclusive, non-transferable, worldwide license to download and use the Asset(s) made available through the platform, subject to the following terms and restrictions.</p>
          </section>

          <section>
            <h2 className={sectionHeading}>03. License Scope </h2>
            <p className={bodyText}>You may:</p>
            <ul className={listText}>
                <li>Use the Asset(s) for personal, educational, or commercial purposes, provided such use complies with the terms herein. </li>
                <li>Use the Asset(s) for personal, educational, or commercial purposes, provided such use complies with the terms herein. </li>
            </ul>
            <p className={bodyText}>You may not:</p>
            <ul className={listText}>
                <li>Resell, sublicense, or redistribute the Asset(s), modified or unmodified, on any platform or marketplace.</li>
                <li>Claim ownership of the Asset(s) in original or modified form.</li>
                <li>Use the Asset(s) in a way that violates any applicable laws or infringes any intellectual property rights.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionHeading}>04. Ownership & Intellectual Property</h2>
            <p className={bodyText}>Ownership of all Asset(s) remains with the original Actor, Manufacturer, or Yatzar Creations Private Limited (as applicable). This Agreement does not grant you any ownership rights, only a license to use the Asset(s) under the stated terms.</p>
          </section>

          <section>
            <h2 className={sectionHeading}>05. Attribution</h2>
            <p className={bodyText}>Attribution is not required, but it is appreciated where possible. If attribution is requested specifically by the Actor or Manufacturer, it must be reasonably provided.</p>
          </section>

          <section>
            <h2 className={sectionHeading}>06. Liability Disclaimer</h2>
            <p className={bodyText}>Asset(s) are provided “as is” without warranties of any kind. Yatzar does not guarantee the accuracy, safety, or fitness for a particular purpose of any Asset. You agree to use the Assets at your own risk.</p>
          </section>

          <section>
            <h2 className={sectionHeading}>07. Termination</h2>
            <p className={bodyText}>This Agreement is effective until terminated. Yatzar may terminate this Agreement at any time if you breach any terms. Upon termination, you must cease use of the Asset(s) and delete all copies.</p>
          </section>

          <section>
            <h2 className={sectionHeading}>08. General</h2>
            <p className={bodyText}>This Agreement shall be governed by the laws of India. Any disputes arising out of or related to this Agreement shall be subject to the jurisdiction of the courts of Coimbatore, Tamil Nadu, India.</p>
            <p className={bodyText}>If you do not agree with these terms, do not download or use any Asset(s) from the Yatzar Asset platform.</p>
          </section>
        </div>
      </div>
    </article>
  );
}
