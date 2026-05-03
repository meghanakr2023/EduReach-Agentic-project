import { Download, FileText } from "lucide-react";

export default function BrochureSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-maroon rounded-2xl overflow-hidden relative">
          {/* Gold top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />

          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-12">
            {/* Left */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-amber-400/20 border-2 border-amber-400/40 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-white mb-1">
                  College Brochure 2024–25
                </h3>
                <p className="text-white/70 text-sm">
                  Download our complete guide — courses, fees, placements,
                  scholarships & campus life.
                </p>
                <div className="flex gap-3 mt-3">
                  <span className="px-2 py-1 bg-amber-400/20 border border-amber-400/30 rounded text-amber-300 text-xs">
                    PDF Format
                  </span>
                  <span className="px-2 py-1 bg-amber-400/20 border border-amber-400/30 rounded text-amber-300 text-xs">
                    Free Download
                  </span>
                  <span className="px-2 py-1 bg-amber-400/20 border border-amber-400/30 rounded text-amber-300 text-xs">
                    Updated 2024
                  </span>
                </div>
              </div>
            </div>

            {/* Right - Download button */}
            <a
              href="/mysore_college_brochure.pdf"
              download="Mysore_College_Brochure_2024.pdf"
              className="flex items-center gap-3 bg-amber-400 text-maroon-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-300 transition-colors duration-300 shadow-lg flex-shrink-0 group"
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              Download Brochure
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}