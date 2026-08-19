import { Shield } from 'lucide-react';
import Section from './Section';

export default function Disclaimer() {
  return (
    <Section>
      <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
        <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white leading-relaxed">
          Digital assets are volatile and involve market risk. XIT is a utility token and does not represent any assured income, profit or return. Nothing on this website constitutes financial, legal or tax advice. Participate responsibly.
        </p>
      </div>
    </Section>
  );
}
