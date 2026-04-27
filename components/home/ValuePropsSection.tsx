const valueProps = [
  {
    title: "Trusted Local Guides",
    text: "Experienced island hosts who know every reef, route, and hidden gem around Fulidhoo.",
  },
  {
    title: "Simple Reservation Flow",
    text: "Choose your excursion, reserve online, and arrive prepared for your island adventure.",
  },
  {
    title: "Small Group Experiences",
    text: "More comfort, better safety, and a personal atmosphere for every trip.",
  },
];

export function ValuePropsSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3">
        {valueProps.map((item) => (
          <div key={item.title} className="surface-card p-6">
            <h3 className="font-display text-xl font-bold text-slate-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
