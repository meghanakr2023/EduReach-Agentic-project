import { achievementsContent } from "../data/content";

export default function AchievementsSection() {
  return (
    <section className="bg-maroon py-16 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{backgroundImage: "radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)", backgroundSize: "32px 32px"}} />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {achievementsContent.stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <p className="text-3xl md:text-4xl font-bold text-amber-400 font-heading group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </p>
              <div className="w-8 h-0.5 bg-amber-400/50 mx-auto my-2" />
              <p className="text-white/80 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}