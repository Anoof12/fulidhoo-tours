export const metadata = {
  title: "Contact | Fulidhoo Tours",
  description: "Contact Fulidhoo Tours for excursion questions and support.",
};

export default function ContactPage() {
  return (
    <div className="pb-14">
      <section className="relative -mt-20 overflow-hidden py-28 sm:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/85 via-emerald-900/70 to-black/50" />
        <div className="relative mx-auto w-full max-w-5xl px-4 text-center sm:px-6">
          <h1 className="font-display text-4xl font-bold text-white md:text-6xl">Get in touch</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/85">
            Have questions about dates, availability, or group arrangements? We are here to help.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h3 className="font-display text-xl font-semibold text-slate-900">Phone</h3>
            <p className="mt-2 text-slate-600">+960 999 1234</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h3 className="font-display text-xl font-semibold text-slate-900">Email</h3>
            <p className="mt-2 text-slate-600">hello@fulidhootours.com</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h3 className="font-display text-xl font-semibold text-slate-900">Location</h3>
            <p className="mt-2 text-slate-600">Fulidhoo Main Jetty, Vaavu Atoll, Maldives</p>
          </div>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-display text-2xl font-bold text-slate-900">Send us a message</h2>
          <form className="mt-5 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="input-base" placeholder="First name" />
              <input className="input-base" placeholder="Last name" />
            </div>
            <input type="email" className="input-base" placeholder="Email address" />
            <input className="input-base" placeholder="Subject" />
            <textarea className="input-base min-h-32" placeholder="Message" />
            <button type="button" className="btn-primary">
              Send message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
