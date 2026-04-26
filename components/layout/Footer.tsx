export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-slate-50">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Fulidhoo Tours</h3>
          <p className="mt-2 text-sm text-slate-600">
            Local island excursions crafted for unforgettable Maldives memories.
          </p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Contact</h3>
          <p className="mt-2 text-sm text-slate-600">+960 999 1234</p>
          <p className="text-sm text-slate-600">hello@fulidhootours.com</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Location</h3>
          <p className="mt-2 text-sm text-slate-600">Fulidhoo Main Jetty, Vaavu Atoll</p>
          <p className="text-sm text-slate-600">Republic of Maldives</p>
        </div>
      </div>
    </footer>
  );
}
