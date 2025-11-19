import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const heroRef = useRef(null);
  const workRef = useRef(null);
  const cursorRef = useRef(null);
  const lenisRef = useRef(null);

  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Custom Cursor
    const cursor = cursorRef.current;
    const onMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Hero Animation
    const heroCtx = gsap.context(() => {
      gsap.from('.hero-text-line', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.5,
      });

      gsap.from('.hero-sub', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1.5,
      });
    }, heroRef);

    // Work Animation
    const workCtx = gsap.context(() => {
      const projects = gsap.utils.toArray('.project-item');
      projects.forEach((project) => {
        gsap.from(project, {
          scrollTrigger: {
            trigger: project,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });
    }, workRef);

    return () => {
      lenis.destroy();
      heroCtx.revert();
      workCtx.revert();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const handleMouseEnter = () => {
    gsap.to(cursorRef.current, {
      scale: 4,
      duration: 0.3,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cursorRef.current, {
      scale: 1,
      duration: 0.3,
    });
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    if (lenisRef.current) {
      lenisRef.current.scrollTo(id);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-white selection:text-black cursor-none">
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 transition-colors duration-300 ${isLight ? 'bg-black mix-blend-normal' : 'bg-white mix-blend-difference'}`}
      ></div>

      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <div className="text-2xl font-bold tracking-tighter" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>./DEV</div>
        <nav className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest">
          <a href="#work" onClick={(e) => scrollToSection(e, '#work')} className="hover:opacity-50 transition-opacity" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Work</a>
          <a href="#experience" onClick={(e) => scrollToSection(e, '#experience')} className="hover:opacity-50 transition-opacity" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Experience</a>
          <a href="#about" onClick={(e) => scrollToSection(e, '#about')} className="hover:opacity-50 transition-opacity" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>About</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="hover:opacity-50 transition-opacity" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Contact</a>
        </nav>
      </header>

      <main>
        <section ref={heroRef} className="h-screen flex flex-col justify-center px-6 md:px-20 pt-20">
          <h1 className="text-[12vw] leading-[0.8] font-bold tracking-tighter uppercase overflow-hidden">
            <div className="hero-text-line">Backend</div>
            <div className="hero-text-line text-neutral-500">Architect</div>
          </h1>
          <p className="hero-sub mt-8 text-xl md:text-2xl max-w-2xl text-neutral-400">
            Building robust, scalable systems with Java & Kotlin.
            Specializing in Spring Boot, Microservices, and Cloud Infrastructure.
          </p>
        </section>

        <section id="work" ref={workRef} className="min-h-screen px-6 md:px-20 py-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-20 tracking-tighter">Selected Projects</h2>
          <div className="grid gap-20">
            {[
              { id: 1, title: "Microservices Orchestrator", desc: "Spring Boot / Kafka / Docker" },
              { id: 2, title: "AI Inference Engine", desc: "Spring AI / Python Bridge / Redis" },
              { id: 3, title: "High-Scale Payment Gateway", desc: "Java / Hibernate / PostgreSQL" }
            ].map((item) => (
              <div
                key={item.id}
                className="project-item group cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="aspect-video bg-neutral-900 rounded-lg mb-6 overflow-hidden relative border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 group-hover:scale-105 transition-transform duration-700 ease-out"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="font-mono text-green-500 text-sm opacity-50 group-hover:opacity-100 transition-opacity">
                      &lt;SystemStatus: ONLINE /&gt;
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                    ↗
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="min-h-[50vh] px-6 md:px-20 py-20 bg-neutral-900/50">
          <h2 className="text-4xl md:text-6xl font-bold mb-20 tracking-tighter">Experience</h2>
          <div className="space-y-12">
            {[
              { role: "Senior Backend Engineer", company: "Tech Corp", period: "2023 - Present", desc: "Leading the migration to microservices architecture using Spring Boot and Kubernetes." },
              { role: "Backend Developer", company: "Startup Inc", period: "2021 - 2023", desc: "Developed high-performance APIs and integrated AI models using Spring AI." },
              { role: "Java Developer", company: "Legacy Systems", period: "2019 - 2021", desc: "Maintained and optimized legacy Java applications and Hibernate mappings." }
            ].map((exp, i) => (
              <div key={i} className="border-t border-white/10 pt-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-20" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="md:w-1/4 text-neutral-500 font-mono text-sm">{exp.period}</div>
                <div className="md:w-3/4">
                  <h3 className="text-2xl font-bold mb-2">{exp.role}</h3>
                  <div className="text-lg text-neutral-300 mb-4">{exp.company}</div>
                  <p className="text-neutral-400 max-w-xl">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="min-h-screen px-6 md:px-20 py-20 flex flex-col justify-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-10 tracking-tighter">About Me</h2>
          <div className="grid md:grid-cols-2 gap-20">
            <div className="text-2xl md:text-4xl leading-tight font-medium">
              <p className="mb-10">
                I'm a backend specialist focused on building resilient, high-throughput systems.
              </p>
              <p className="text-neutral-500">
                From optimizing database queries with Hibernate to deploying containerized microservices with Docker, I ensure the engine runs smoothly.
              </p>
            </div>
            <div className="space-y-8">
              <div>
                <h4 className="text-sm uppercase tracking-widest text-neutral-500 mb-4">Tech Stack</h4>
                <div className="flex flex-wrap gap-3">
                  {['Java', 'Kotlin', 'Spring Boot', 'Spring AI', 'Hibernate', 'Microservices', 'Docker', 'Kubernetes', 'CI/CD', 'PostgreSQL', 'Redis', 'Kafka'].map((tech) => (
                    <span key={tech} className="px-4 py-2 border border-white/20 rounded-full text-sm hover:bg-white hover:text-black transition-colors cursor-none" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest text-neutral-500 mb-4">Expertise</h4>
                <ul className="space-y-2 text-lg">
                  <li>System Architecture</li>
                  <li>API Design & Development</li>
                  <li>Database Optimization</li>
                  <li>Cloud Infrastructure (AWS/GCP)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="min-h-[50vh] px-6 md:px-20 py-20 bg-white text-black flex flex-col justify-between"
          onMouseEnter={() => setIsLight(true)}
          onMouseLeave={() => setIsLight(false)}
        >
          <div>
            <h2 className="text-[10vw] leading-[0.8] font-bold tracking-tighter uppercase mb-10">
              Let's Connect
            </h2>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <a href="mailto:udaykhare77@gmail.com" className="text-2xl md:text-4xl underline decoration-2 underline-offset-4 hover:opacity-70 transition-opacity" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              udaykhare77@gmail.com
            </a>
            <div className="flex gap-6 text-sm font-medium uppercase tracking-widest">
              <a href="https://www.linkedin.com/in/uday-khare-a09208289" className="hover:opacity-50" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>LinkedIn</a>
              <a href="https://github.com/udaykhare09" className="hover:opacity-50" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>GitHub</a>
              <a href="https://x.com/uday_khare09" className="hover:opacity-50" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>X/Twitter</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
