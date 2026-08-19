import { useState } from 'react';
import { Mail, MessageSquare, Send, Check, MapPin, Phone, Clock } from 'lucide-react';
import Section from './Section';

const info = [
  { icon: Mail, title: 'Email', value: 'support@xittoken.com', desc: 'We reply within 24 hours' },
  { icon: Phone, title: 'Phone', value: '+1 (555) 000-0000', desc: 'Mon-Fri, 9am-6pm' },
  { icon: MapPin, title: 'Address', value: 'Decentralized Network', desc: 'Global Operations — Launched from Dubai' },
  { icon: Clock, title: 'Support Hours', value: '24/7 Online', desc: 'Platform always available' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <Section id="contact" className="!py-3 sm:!py-4 md:!py-1">
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 bg-[#f3ba2f]/10 border border-[#f3ba2f]/20 rounded-full px-3 sm:px-4 py-1.5 mb-4">
          <MessageSquare className="w-4 h-4 text-[#f3ba2f] shrink-0" />
          <span className="text-xs sm:text-sm text-[#f3ba2f] font-medium">Get In Touch</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Contact Us</h2>
        <p className="text-sm sm:text-base text-white mt-4 max-w-2xl mx-auto">Have questions about XIT Token? Need help with your account? We're here to help.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-3 sm:space-y-4">
          {info.map((item) => (
            <div key={item.title} className="bg-[#111827] border border-gray-800 rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:border-[#f3ba2f]/20 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f3ba2f]/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#f3ba2f]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white">{item.title}</p>
                <p className="text-sm font-semibold text-white break-words">{item.value}</p>
                <p className="text-xs text-white mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6">Send a Message</h3>
          {success && (
            <div className="mb-4 flex items-center gap-2 bg-[#f3ba2f]/10 border border-[#f3ba2f]/30 text-[#f3ba2f] text-sm rounded-lg px-4 py-3">
              <Check className="w-4 h-4 flex-shrink-0" />Your message has been sent! We'll get back to you soon.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white mb-1.5">Your Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#f3ba2f] focus:ring-1 focus:ring-[#f3ba2f] outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm text-white mb-1.5">Email Address</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#f3ba2f] focus:ring-1 focus:ring-[#f3ba2f] outline-none transition-all" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white mb-1.5">Subject</label>
              <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#f3ba2f] focus:ring-1 focus:ring-[#f3ba2f] outline-none transition-all" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-sm text-white mb-1.5">Message</label>
              <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#f3ba2f] focus:ring-1 focus:ring-[#f3ba2f] outline-none transition-all resize-none" placeholder="Tell us more about your inquiry..." />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#f3ba2f] to-[#d4a017] hover:from-[#ffd24a] hover:to-[#f3ba2f] text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-[#f3ba2f]/20 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}
