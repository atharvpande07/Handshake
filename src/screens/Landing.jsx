import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Shield, Zap, Smartphone, Lock, Check, ChevronDown, Heart, MessageCircle, Users } from 'lucide-react';

export default function Landing({ onStart, t, language, toggleLanguage, onDashboard }) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="min-h-screen bg-bg text-white selection:bg-primary/30 font-sans overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 px-6 max-w-7xl mx-auto">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        
        <div className="relative flex items-center justify-center">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="max-w-3xl text-center"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/80 mb-8 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-gold" />
              <span>For freelancers & small businesses</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Before starting work,  <span className="text-gradient">Get it</span> Signed
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
              Create a professional agreement in 60 seconds. Share on WhatsApp. Get it signed on mobile. Your agreement is Secured after signing — everyone keeps a clear record.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onStart}
                className="group relative inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] hover:-translate-y-0.5"
              >
                {t("Get Handshake")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div variants={fadeIn} className="mt-8 text-sm text-white/40">
              One-time purchase • No app needed for clients
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Emotional Pain Section */}
      <section className="py-24 px-6 relative border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeIn}
              className="text-3xl lg:text-4xl font-bold mb-4"
            >
              Sound familiar?
            </motion.h2>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeIn}
              className="text-white/60 text-lg max-w-2xl mx-auto"
            >
              Every freelancer has heard these. Each one has cost you money.
            </motion.p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {[
              { quote: "We need this by next week, but it's super simple.", tag: "The Undervaluer" },
              { quote: "This should be easy for someone with your experience.", tag: "The Guilt Tripper" },
              { quote: "I could do this myself, but I don't have time.", tag: "The Minimiser" },
              { quote: "Can we just make a few small changes?", tag: "The Scope Creeper" },
              { quote: "As soon as my client pays me, I'll pay you.", tag: "The Chain Delayer" },
              { quote: "I thought we agreed on a lower price?", tag: "The Renegotiator" },
            ].map((pain, i) => (
              <motion.div 
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } } }}
                className="glass-panel p-6 group hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="text-2xl mb-3 opacity-40">💬</div>
                <p className="text-white/90 text-lg font-medium italic leading-snug mb-3">
                  "{pain.quote}"
                </p>
                <div className="text-sm text-white/30 font-medium tracking-wide uppercase">{pain.tag}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mt-14"
          >
            <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
              Informal WhatsApp chats lead to scope creep, payment confusion, and lost details.<br />
              <span className="text-white/80 font-semibold">Handshake fixes that in 60 seconds.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. How it Works Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-white/60 text-lg">Four simple steps to peace of mind.</p>
          </div>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {[
              { step: "01", title: "Create Deal", desc: "Define the scope, price, and timeline in seconds.", align: "left" },
              { step: "02", title: "Send Link", desc: "Share the unique deal link directly via WhatsApp or email.", align: "right" },
              { step: "03", title: "Client Signs", desc: "They review and sign on their phone. No app needed.", align: "left" },
              { step: "04", title: "Agreement Locks", desc: "Both sides get the same final copy. Any changes after signing are visible.", align: "right" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}
              >
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-bg bg-primary text-white shadow shadow-primary/40 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 font-bold text-sm">
                  {item.step}
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-6 group-hover:-translate-y-1 transition-transform">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Trust/Value Section */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">Built for speed.<br/>Designed for trust.</h2>
            <p className="text-lg text-white/60 mb-8">We removed all the friction so you can focus on the work, not the paperwork.</p>
            
            <div className="space-y-4">
              {[
                { icon: CheckCircle2, text: "Know exactly what was agreed" },
                { icon: Shield, text: "Avoid revision fights" },
                { icon: Lock, text: "Prevent payment confusion" },
                { icon: Smartphone, text: "Mobile-first — no app needed for clients" },
                { icon: Zap, text: "Your agreement is locked after signing" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 mt-8">
              <div className="glass-panel p-6 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="font-medium text-white/90">Built for freelancers and small businesses</div>
              </div>
              <div className="glass-panel p-6 text-center bg-primary/5 border-primary/20">
                <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="font-medium">Both sides get the same final copy</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="glass-panel p-6 text-center">
                <MessageCircle className="w-8 h-8 text-secondary mx-auto mb-3" />
                <div className="font-medium text-white/90">Made for quick WhatsApp-based agreements</div>
              </div>
              <div className="glass-panel p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-secondary mx-auto mb-3" />
                <div className="font-medium">Everyone keeps a clear record</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing — One-time purchase */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-white/60 mb-12">Onetime Purchase & Yours forever</p>
          
          <div className="glass-panel p-8 relative overflow-hidden text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-sm font-medium mb-4">
                One-Time Purchase
              </div>
              <h3 className="text-2xl font-bold mb-2">Handshake</h3>
              <p className="text-white/60">Protect your Work, Time & Energy</p>
              
              <ul className="mt-6 space-y-2">
                {["Unlimited deals", "Digital signatures", "WhatsApp sharing", "PDF downloads", "Locked agreement records"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-secondary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="text-center md:text-right shrink-0">
              <div className="text-4xl font-bold text-white mb-1">₹4,499</div>
              <div className="text-sm text-white/60 mb-2">One-time payment • No recurring fees</div>
              <div className="text-xs text-gold/80 italic mb-6">One unpaid project can cost more than Handshake.</div>
              <button onClick={onStart} className="bg-white text-bg px-6 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors w-full md:w-auto">
                Get Handshake
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeIn}
              className="text-3xl lg:text-4xl font-bold mb-4"
            >
              Frequently asked questions
            </motion.h2>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeIn}
              className="text-white/60 text-lg"
            >
              Quick answers to what people ask most.
            </motion.p>
          </div>
          
          <div className="space-y-3">
            {[
              {
                q: "Is this legally valid?",
                a: "Handshake is designed to create a clear, signed record proof of your agreement. This is a legal validity use case. For high-stakes contracts, we recommend checking with a legal professional — but for everyday freelance work, This signed record will go all the way."
              },
              {
                q: "Does the client need to install an app?",
                a: "No. Your client simply opens a link in their browser, reviews the agreement, and signs. No downloads, no accounts, no friction."
              },
              {
                q: "Can I use this internationally?",
                a: "Yes. Handshake works anywhere you have an internet connection. You can create and share agreements with clients in any country."
              },
              {
                q: "Is WhatsApp integrated?",
                a: "You can share your deal link directly via WhatsApp with one tap. The client opens it in their phone browser to review and sign."
              },
              {
                q: "Can agreements be downloaded as PDF?",
                a: "Yes. Both you and your client can download a PDF copy of the signed agreement for your records."
              },
              {
                q: "Can clients edit after signing?",
                a: "No. Once both parties sign, the agreement is secured in algorithms. Any changes after signing are visible, so neither side can quietly alter the terms."
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } } }}
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full glass-panel px-6 py-5 text-left flex items-center justify-between gap-4 group hover:-translate-y-0.5 transition-transform duration-200"
                >
                  <span className="text-white/90 font-semibold text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: openFaq === i ? '200px' : '0px',
                    opacity: openFaq === i ? 1 : 0,
                  }}
                >
                  <div className="px-6 py-4 text-white/55 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Founder Authenticity Block */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeIn}
            className="glass-panel p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/60 via-gold/40 to-transparent" />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-1">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white/90 mb-3">Why Handshake exists</h3>
                <p className="text-white/55 leading-relaxed text-[15px] mb-3">
                  Handshake was built after seeing too many freelancers lose money from unclear WhatsApp agreements.
                </p>
                <p className="text-white/55 leading-relaxed text-[15px] mb-3">
                  Most projects don't start with contracts. They start with chats, voice notes, and "bro trust me."
                </p>
                <p className="text-white/55 leading-relaxed text-[15px]">
                  Handshake exists to make those deals clear before work begins.
                </p>
                <div className="mt-5 text-sm text-white/30 font-medium">
                  — Atharv, Founder
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] opacity-40 pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to close deals professionally?</h2>
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Stop relying on casual messages. Get a clear, signed record for every job.
          </p>
          <button 
            onClick={onStart}
            className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] hover:-translate-y-1"
          >
            Get Handshake — ₹4,499
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="mt-8 text-sm text-white/40">
            One-time purchase • No subscription
          </div>
        </div>
      </section>
      
      {/* Footer / Meta */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-white/30 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>🤝</span> Handshake
          </div>
          <div>© {new Date().getFullYear()} Handshake. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
