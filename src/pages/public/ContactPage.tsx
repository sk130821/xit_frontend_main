import { useState } from 'react';
import { Mail, MessageSquare, Send, Check, MapPin, Phone, Clock } from 'lucide-react';

export default function ContactPage() {
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
    <div className="bg-[#0a0e17]">
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-grid">
        <div className="absolute top-20 right-1/3 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Contact Us</h1>
          <p className="text-lg text-gray-400 mt-6 max-w-2xl mx-auto font-light">Have questions about XIT Token? Need help with your account? We're here to help.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              {[
                { icon: Mail, title: 'Email', value: 'support@xittoken.com', desc: 'We reply within 24 hours' },
                { icon: Phone, title: 'Phone', value: '+1 (555) 000-0000', desc: 'Mon-Fri, 9am-6pm' },
                { icon: MapPin, title: 'Address', value: 'Decentralized Network', desc: 'Global Operations — Launched from Dubai' },
                { icon: Clock, title: 'Support Hours', value: '24/7 Online', desc: 'Platform always available' },
              ].map((item, i) => (
                <div key={i} className="bg-[#111827] border border-gray-800 rounded-2xl p-5 flex items-center gap-4 hover:border-emerald-500/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{item.title}</p>
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
              {success && (
                <div className="mb-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3">
                  <Check className="w-4 h-4 flex-shrink-0" />Your message has been sent! We'll get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Your Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Subject</label>
                  <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Message</label>
                  <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none" placeholder="Tell us more about your inquiry..." />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
