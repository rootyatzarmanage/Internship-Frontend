import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, MapPin } from "lucide-react";
import buildingImg from "../assets/structure.png";

gsap.registerPlugin(ScrollTrigger);

const INPUT =
  "w-full rounded-lg border border-white/40 bg-transparent px-3 py-2.5 text-[13px] text-white outline-none transition placeholder:text-white/35 focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/60";
const LABEL = "mb-2 block text-[12px] text-white/90";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // TODO: replace with your real endpoint (API route, Formspree, EmailJS...)
      // await fetch("/api/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      await new Promise((r) => setTimeout(r, 700));
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const isStacked = window.matchMedia("(max-width: 1279px)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".c-left > *",
        { x: isStacked ? -30 : -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".c-image",
        { y: 40, scale: 0.94, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          delay: 0.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".c-image",
            start: "top 90%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".c-map",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".c-map",
            start: "top 90%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#171717] px-5 py-10 text-white sm:px-8 sm:py-14 lg:px-12 xl:px-20">
      <div className="mx-auto w-full max-w-[2420px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16 xl:gap-[7vw]">
          <div className="c-left w-full max-w-[720px]">
            <p className="text-[12px] uppercase tracking-[0.18em] text-white/80">
              Get in touch
            </p>

            <h1 className="mt-3 text-[clamp(40px,9vw,60px)] font-semibold leading-[0.92] tracking-[-0.045em] xl:text-[clamp(52px,4.6vw,84px)]">
              Let&rsquo;s Build
              <br />
              Something <span className="text-[#0EA5E9]">Great</span>
              <br />
              Together
            </h1>

            <p className="mt-5 max-w-[26rem] text-[13px] leading-5 text-white/85 sm:text-[14px] sm:leading-6">
              Have a project in mind or want to learn more about our BIM
              Services? We&rsquo;d love to hear from you. Reach out and our team
              will get back to you soon.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 xl:mt-[2.2vw]">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className={LABEL}>
                    Name
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Eg. John Williams"
                    className={INPUT}
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className={LABEL}>
                    Email
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    placeholder="Eg. johnwilliams@company.com"
                    className={INPUT}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="c-subject" className={LABEL}>
                    Subject
                  </label>
                  <input
                    id="c-subject"
                    type="text"
                    value={form.subject}
                    onChange={update("subject")}
                    placeholder="How can we help"
                    className={INPUT}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="c-message" className={LABEL}>
                    Message
                  </label>
                  <textarea
                    id="c-message"
                    required
                    value={form.message}
                    onChange={update("message")}
                    placeholder="How can we help"
                    className={`${INPUT} h-[130px] resize-y sm:h-[140px]`}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="cursor-pointer rounded-md bg-[#0284C7] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#0369A1] disabled:cursor-wait disabled:opacity-60"
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
                <p
                  role="status"
                  aria-live="polite"
                  className={`text-[12px] ${
                    status === "error" ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {status === "sent" && "Thanks! We'll get back to you soon."}
                  {status === "error" && "Something went wrong. Please try again."}
                </p>
              </div>
            </form>

            {/* contact details */}
            <ul className="mt-8 grid gap-3 text-[12px] text-white/90 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4 xl:mt-[2.4vw]">
              <li>
                <a
                  href="mailto:reachus@yatzarmanage.com"
                  className="flex items-center gap-3 transition hover:text-[#0EA5E9]"
                >
                  <Mail className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  reachus@yatzarmanage.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918870676664"
                  className="flex items-center gap-3 transition hover:text-[#0EA5E9]"
                >
                  <Phone className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  +91 88706 76664
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                Tamil Nadu, Coimbatore
              </li>
            </ul>
          </div>

          <div className="c-image mx-auto w-full max-w-[520px] overflow-hidden rounded-xl bg-[#111] lg:mx-0 lg:max-w-none">
            <img
              src={buildingImg}
              alt="BIM building model with callouts for 3D BIM modeling, design coordination, construction documentation and project support"
              className="block h-auto w-full object-contain"
            />
          </div>
        </div>

        <div className="c-map mt-10 h-[260px] w-full overflow-hidden rounded-2xl bg-[#e5e3df] sm:h-[320px] xl:mt-[4vw] xl:aspect-[1068/260] xl:h-auto">
          <iframe
            title="Map showing PSG STEP, Coimbatore"
            src="https://www.google.com/maps?q=PSG+STEP+Coimbatore&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}