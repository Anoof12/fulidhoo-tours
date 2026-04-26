export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl font-bold">Fulidhoo Tours</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
            Curating unforgettable island adventures in the Maldives with local guides and smooth,
            reservation-first booking.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-white">Quick Links</h3>
          <p className="text-sm text-slate-300">Home</p>
          <p className="text-sm text-slate-300">Excursions</p>
          <p className="text-sm text-slate-300">About</p>
          <p className="text-sm text-slate-300">Contact</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-white">Contact</h3>
          <p className="text-sm text-slate-300">+960 999 1234</p>
          <p className="text-sm text-slate-300">hello@fulidhootours.com</p>
          <p className="text-sm text-slate-300">Vaavu Atoll, Maldives</p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        Copyright {new Date().getFullYear()} Fulidhoo Tours. All rights reserved.
      </div>
    </footer>
  );
}
