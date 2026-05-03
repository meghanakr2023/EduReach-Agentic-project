import { images, siteConfig } from "../data/content";

export default function HeroSection() {
  return (
    <section id="hero" className="relative h-[85vh] min-h-[500px]">
      <img src={images.hero} alt="Mysore College Campus" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-maroon/75" />

      {/* Decorative gold border at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <p className="text-amber-300 text-sm tracking-widest uppercase font-medium">
              {siteConfig.established} · Mysore, Karnataka
            </p>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6">
            Welcome to <br />
            <span className="text-amber-400">Mysore College</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-8">
            {siteConfig.tagline}. Premier engineering institution with 92% placement rate
            and partnerships with Google, Microsoft & Amazon.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#courses"
              className="inline-block bg-amber-400 text-maroon-dark px-7 py-3 rounded-lg font-bold hover:bg-amber-300 transition-colors duration-300 shadow-lg">
              Explore Programs
            </a>
            <a href="#about"
              className="inline-block bg-white/10 border border-white/30 text-white px-7 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm">
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#f8f5ee"/>
        </svg>
      </div>
    </section>
  );
}