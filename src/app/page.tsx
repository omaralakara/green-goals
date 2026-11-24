import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Sites from "@/components/sections/Sites";
import Pitch from "@/components/sections/Pitch";
import Team from "@/components/sections/Team";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a className="skip" href="#about">
        Skip to the content
      </a>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Sites />
        <Projects />
        <Pitch />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
