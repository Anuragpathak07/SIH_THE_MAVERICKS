import gridImg from "@/assets/mining-background.jpg";

export const ProjectsSection = () => {
  const projects = [
    { title: "Open-Pit Stability", subtitle: "Slope monitoring", img: gridImg },
    { title: "Underground Mapping", subtitle: "3D scans", img: gridImg },
    { title: "Real-time Analytics", subtitle: "Edge AI", img: gridImg },
    { title: "Digital Twin", subtitle: "Interactive", img: gridImg },
    { title: "Risk Forecasting", subtitle: "PINNs", img: gridImg },
    { title: "Maintenance Planning", subtitle: "Predictive", img: gridImg },
  ];

  return (
    <section id="projects" className="py-20 px-6 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Projects & Case Studies
            </span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
            A selection of industrial deployments showcasing reliability, innovation, and safety.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, idx) => (
            <article key={idx} className="group rounded-2xl overflow-hidden glass-card">
              <div className="relative aspect-[4/3]">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground">{p.title}</h3>
                <p className="text-foreground/60">{p.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};


