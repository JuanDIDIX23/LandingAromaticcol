import { ScrollProgress } from "./shared/animations";
import { Navbar }         from "./sections/Navbar";
import { Hero }           from "./sections/Hero";
import { Benefits }       from "./sections/Benefits";
import { Products }       from "./sections/Products";
import { Nosotros }       from "./sections/Nosotros";
import { FeriasSection }  from "./sections/Ferias";
import { Cobertura }      from "./sections/Cobertura";
import { GaleriaSection } from "./sections/Galeria";
import { Contacto }       from "./sections/Contacto";
import { Footer }         from "./sections/Footer";

export function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Benefits />
      <Products />
      <Nosotros />
      <FeriasSection />
      <Cobertura />
      <GaleriaSection />
      <Contacto />
      <Footer />
    </div>
  );
}
