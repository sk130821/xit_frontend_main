import Hero from './Home/Hero';
import About from './Home/About';
import Pillars from './Home/Pillars';
import ProblemSolution from './Home/ProblemSolution';
import Whitepaper from './Home/Whitepaper';
import Architecture from './Home/Architecture';
import Utilities from './Home/Utilities';
import HowItWorks from './Home/HowItWorks';
import Compensation from './Home/Compensation';
import GrowthEngine from './Home/GrowthEngine';
import Roadmap from './Home/Roadmap';
import Security from './Home/Security';
import FAQ from './Home/FAQ';
import CTA from './Home/CTA';
import Contact from './Home/Contact';
import Disclaimer from './Home/Disclaimer';

export default function HomePage() {
  return (
    <div className="bg-[#0a0e17]">
      <Hero />
      <About />
      <Pillars />
      <ProblemSolution />
      <Whitepaper />
      <Architecture />
      <Utilities />
      <HowItWorks />
      <Compensation />
      <GrowthEngine />
      <Roadmap />
      <Security />
      <FAQ />
      <CTA />
      <Contact />
      <Disclaimer />
    </div>
  );
}
