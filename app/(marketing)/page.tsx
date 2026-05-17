'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  ArrowRight, Check, Zap, Shield, Users, BarChart3, Globe, 
  Sparkles, Lock, Cpu, Star, ChevronRight, Layout, Terminal, 
  Layers, Code2, Database, Activity, Command, CheckCircle2,
  Server, Clock, ShieldCheck, Fingerprint, LockKeyhole, Search,
  ArrowUpRight, FileText, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const bentoFeatures = [
  {
    title: "Multi-Tenant isolation",
    desc: "Enforce strict data boundaries at the database level with automated RLS.",
    icon: Shield,
    className: "md:col-span-2",
    ui: (
      <div className="mt-6 p-4 rounded-xl bg-surface-900 border border-white/10 flex flex-col gap-3 overflow-hidden">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> <span className="text-[10px] font-mono text-white tracking-tighter uppercase">Tenant: Acme_Corp</span></div>
           <Lock className="w-3 h-3 text-white" />
        </div>
        <div className="space-y-2">
           <div className="h-2 w-full bg-white/10 rounded-full" />
           <div className="h-2 w-2/3 bg-white/10 rounded-full" />
           <div className="h-2 w-1/2 bg-brand-600 rounded-full" />
        </div>
      </div>
    )
  },
  {
    title: "Global Edge",
    desc: "Deployed to 300+ regions instantly.",
    icon: Globe,
    className: "md:col-span-1",
    ui: (
      <div className="mt-6 h-24 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-brand-600/20" />
        <Globe className="w-12 h-12 text-white" />
      </div>
    )
  },
  {
    title: "Custom Domains",
    desc: "White-labeled SSL for every workspace.",
    icon: Layout,
    className: "md:col-span-1",
    ui: (
      <div className="mt-6 p-3 rounded-lg bg-surface-900 border border-white/10 text-[10px] font-mono text-white font-bold">
        https://<span className="text-brand-500 font-black underline">acme</span>.Odyssey.com
      </div>
    )
  },
  {
    title: "Usage Analytics",
    desc: "Real-time tenant metrics out of the box.",
    icon: BarChart3,
    className: "md:col-span-2",
    ui: (
      <div className="mt-6 grid grid-cols-4 gap-2">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-12 bg-white/10 rounded-md flex items-end p-1">
            <div className="w-full bg-brand-600 rounded-sm" style={{ height: `${20 * i}%` }} />
          </div>
        ))}
      </div>
    )
  }
]

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <div className="min-h-screen bg-surface-950 text-white font-sans selection:bg-brand-600 selection:text-white overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-violet-600/20 rounded-full blur-[150px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 border-b border-white/10 bg-surface-950/80 backdrop-blur-xl px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-surface-950 fill-surface-950" />
            </div>
            <span className="text-xl font-black tracking-tighter">Odyssey</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-white">
            <Link href="#features" className="hover:text-brand-500 transition-colors">Platform</Link>
            <Link href="#how-it-works" className="hover:text-brand-500 transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-brand-500 transition-colors">Pricing</Link>
            <Link href="#security" className="hover:text-brand-500 transition-colors">Security</Link>
            <Link href="/docs" className="hover:text-brand-500 transition-colors">Docs</Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden md:block text-xs font-black uppercase tracking-wider text-white hover:text-brand-500 transition-colors">Sign in</Link>
            <Link href="/register" className="bg-white text-surface-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-brand-600 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 hover:shadow-brand-600/30">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-48 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-600/10 border border-brand-600/20 text-[10px] font-black uppercase tracking-[0.2em] text-brand-500 mb-10"
          >
            <Sparkles className="w-3 h-3" />
            Enterprise Infrastructure for All
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8 text-white"
          >
            Multi-tenant infra <br />
            <span className="text-brand-500">done right.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white font-medium max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Odyssey is the high-visibility engine for your SaaS. Secure isolation, 
            global performance, and zero-config billing. Scale without the stress.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Link href="/register" className="group w-full sm:w-auto bg-white text-surface-950 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-brand-600 hover:text-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)]">
              Start 14-Day Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/docs" className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-white/20 text-white font-black text-sm uppercase tracking-wider hover:bg-white/10 hover:border-white/40 hover:scale-105 active:scale-95 transition-all">
              Read the Docs
            </Link>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-16"
          >
            No credit card required. Cancel anytime.
          </motion.p>

          {/* Hero Interactive Browser Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="rounded-t-3xl bg-surface-900 border border-white/10 flex items-center px-4 py-3 gap-3">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/80" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                 <div className="w-3 h-3 rounded-full bg-green-500/80" />
               </div>
               <div className="mx-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-950 border border-white/5 text-[10px] font-mono text-white/40 min-w-[200px] justify-center">
                  <Lock className="w-3 h-3" />
                  dashboard.odyssey.com
               </div>
            </div>
            <div className="rounded-b-3xl overflow-hidden bg-surface-900 aspect-[16/10] relative shadow-[0_0_100px_-20px_rgba(139,92,246,0.3)] border-x border-b border-white/10">
               <Image 
                 src="/nexus_linear_dashboard.png" 
                 alt="Odyssey Dashboard Preview" 
                 fill 
                 priority
                 sizes="(max-width: 1200px) 100vw, 1200px"
                 className="object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof with Metrics */}
      <section className="py-16 px-6 bg-white/5 border-y border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="flex items-center gap-8">
             <div>
                <h3 className="text-3xl font-black text-white">10,000+</h3>
                <p className="text-xs font-black uppercase tracking-widest text-brand-500">Active Tenants</p>
             </div>
             <div className="h-10 w-px bg-white/10" />
             <div>
                <h3 className="text-3xl font-black text-white">99.99%</h3>
                <p className="text-xs font-black uppercase tracking-widest text-brand-500">Uptime SLA</p>
             </div>
           </div>
           
           <div className="flex-1 flex items-center justify-center gap-8 flex-wrap">
              {['VERTIEX', 'SECUREX', 'DATAFLOW', 'FASTLY', 'CORE.AI'].map(brand => (
                <div key={brand} className="text-xl font-black tracking-tighter text-white/40 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center"><Server className="w-3 h-3" /></div> {brand}
                </div>
              ))}
           </div>
           
           {/* Trust Badges placeholder */}
           <div className="flex gap-4">
             <div className="px-4 py-2 bg-brand-600/10 border border-brand-600/20 rounded-lg flex items-center gap-2">
               <Star className="w-4 h-4 text-brand-500 fill-brand-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-white">Top Rated</span>
             </div>
           </div>
        </div>
      </section>

      {/* How it Works (NEW) */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">From zero to global <br/> in <span className="text-brand-500">3 simple steps.</span></h2>
            <p className="text-xl text-white/70 font-bold max-w-2xl mx-auto">Skip the infrastructure boilerplate. Odyssey gives you a production-ready SaaS backend instantly.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { s: "01", t: "Create Workspace", d: "Provision your isolated database cluster and global edge endpoints in seconds.", i: Layers },
               { s: "02", t: "Add Tenants", d: "Invite users, set RBAC roles, and map custom domains automatically.", i: Users },
               { s: "03", t: "Deploy Globally", d: "Your app is instantly available across 300+ edge locations with 0 configuration.", i: Globe }
             ].map((step, i) => (
               <div key={i} className="relative p-10 rounded-[2.5rem] bg-surface-900 border border-white/10 group hover:border-brand-600 transition-all">
                  <div className="absolute top-6 right-6 text-6xl font-black text-white/[0.03] group-hover:text-brand-600/10 transition-colors pointer-events-none">
                     {step.s}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-brand-600/10 flex items-center justify-center mb-8 border border-brand-600/20">
                     <step.i className="w-8 h-8 text-brand-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">{step.t}</h3>
                  <p className="text-lg text-white/60 font-medium leading-relaxed">{step.d}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section id="features" className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-white">Full visibility. <br /> <span className="text-brand-500">Zero isolation leaks.</span></h2>
            <p className="text-xl text-white font-bold leading-relaxed">Stop guessing if your tenants are secure. We provide the hardened infrastructure so you can focus on building features.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bentoFeatures.map((f, i) => (
              <div 
                key={i}
                className={cn(
                  "p-10 rounded-[2.5rem] bg-surface-900 border border-white/10 hover:border-brand-600 transition-all flex flex-col group",
                  f.className
                )}
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center mb-8">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white">{f.title}</h3>
                <p className="text-lg text-white/60 font-medium leading-relaxed mb-8">{f.desc}</p>
                <div className="mt-auto">{f.ui}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
             <Link href="/register" className="group inline-flex items-center gap-3 text-brand-500 font-black uppercase tracking-widest hover:text-brand-400 transition-colors">
               Explore all platform features <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </div>
      </section>

      {/* Security & Compliance (NEW) */}
      <section id="security" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
           <div className="order-2 lg:order-1">
             <div className="grid grid-cols-2 gap-6">
                {[
                  { l: "SOC2 Type II", i: ShieldCheck },
                  { l: "GDPR Ready", i: Globe },
                  { l: "ISO 27001", i: FileText },
                  { l: "End-to-End Encryption", i: LockKeyhole }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-surface-900 border border-white/10 flex flex-col items-center justify-center text-center gap-4">
                     <item.i className="w-8 h-8 text-white/40" />
                     <span className="font-black text-white text-sm uppercase tracking-widest">{item.l}</span>
                  </div>
                ))}
             </div>
           </div>
           <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-white">Enterprise security, <br/> built-in by default.</h2>
              <p className="text-xl text-white/70 font-medium leading-relaxed mb-10">We handle the compliance so you can sell to the enterprise. Odyssey provides strict Row-Level Security, audit logs, and automated daily backups.</p>
              <ul className="space-y-4">
                {['Automated Threat Detection', 'Role-Based Access Control (RBAC)', 'L7 DDoS Protection', 'Continuous Vulnerability Scanning'].map((f, i) => (
                   <li key={i} className="flex items-center gap-4 text-lg font-bold text-white">
                     <CheckCircle2 className="w-5 h-5 text-brand-500" /> {f}
                   </li>
                ))}
              </ul>
              <Link href="/security" className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest mt-12 hover:bg-white/10 hover:border-white/30 hover:scale-105 active:scale-95 transition-all">
                Download Security Whitepaper <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
        </div>
      </section>

      {/* Comparison Section (NEW) */}
      <section className="py-32 px-6 bg-brand-600/5 border-y border-brand-600/10">
        <div className="max-w-5xl mx-auto">
           <div className="text-center mb-20">
             <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">Why choose Odyssey?</h2>
             <p className="text-xl text-white/70 font-bold">See how we stack up against traditional infrastructure builds.</p>
           </div>
           
           <div className="bg-surface-900 rounded-[3rem] border border-white/10 overflow-hidden">
              <div className="grid grid-cols-3 p-8 border-b border-white/10 bg-white/[0.02]">
                 <div className="font-black text-white/40 uppercase tracking-widest text-xs">Feature</div>
                 <div className="font-black text-brand-500 uppercase tracking-widest text-xs flex items-center gap-2"><Zap className="w-4 h-4" /> Odyssey</div>
                 <div className="font-black text-white/40 uppercase tracking-widest text-xs">Traditional Setup</div>
              </div>
              
              {[
                { f: "Deployment Time", o: "Under 2 minutes", t: "Weeks or months" },
                { f: "Tenant Isolation", o: "Strict RLS boundaries", t: "Shared risk / Leaks" },
                { f: "Global Edge", o: "300+ regions default", t: "Manual replication" },
                { f: "Maintenance", o: "Zero ops required", t: "Requires DevOps team" },
                { f: "Pricing Model", o: "Predictable scaling", t: "Hidden AWS overages" }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 p-8 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                   <div className="font-bold text-white/80">{row.f}</div>
                   <div className="font-black text-white flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> {row.o}</div>
                   <div className="font-medium text-white/40 flex items-center gap-2"><X className="w-4 h-4 text-red-500/50" /> {row.t}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Pricing with Toggle */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-black mb-8 text-white">Scale as you grow.</h2>
          <p className="text-xl text-white font-bold mb-10">Transparent pricing. No hidden fees. Cancel anytime.</p>
          
          <div className="inline-flex items-center p-1 rounded-2xl bg-surface-900 border border-white/10">
             <button 
               onClick={() => setIsAnnual(false)}
               className={cn("px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all", !isAnnual ? "bg-white text-surface-950" : "text-white/40 hover:text-white")}
             >
               Monthly
             </button>
             <button 
               onClick={() => setIsAnnual(true)}
               className={cn("px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2", isAnnual ? "bg-brand-600 text-white" : "text-white/40 hover:text-white")}
             >
               Annually <span className="px-2 py-0.5 rounded text-[9px] bg-white text-brand-600">Save 20%</span>
             </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
           {[
             { n: 'Starter', pM: 29, pA: 24, f: ['10k requests/mo', '1 Organization', 'Community Support', 'Shared DB'] },
             { n: 'Pro', pM: 79, pA: 64, f: ['Unlimited requests', '25 Organizations', '99.9% SLA', 'Priority Support'], popular: true },
             { n: 'Enterprise', pM: 'Custom', pA: 'Custom', f: ['Dedicated Cluster', 'SAML SSO', 'White-labeled dashboard', '24/7 Phone Support'] }
           ].map((plan, i) => (
             <div 
              key={i}
              className={cn(
                "p-12 rounded-[3rem] bg-surface-900 border-2 flex flex-col relative transition-all",
                plan.popular ? "border-brand-600 shadow-[0_0_50px_-10px_rgba(139,92,246,0.2)]" : "border-white/10"
              )}
             >
               {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Most Popular</div>}
               <h3 className="text-2xl font-black mb-4 text-white">{plan.n}</h3>
               <div className="flex items-baseline gap-1 mb-10 text-white">
                 <span className="text-6xl font-black">{plan.pM === 'Custom' ? 'Contact' : `$${isAnnual ? plan.pA : plan.pM}`}</span>
                 {plan.pM !== 'Custom' && <span className="font-bold text-lg text-white/40">/mo</span>}
               </div>
               <p className="text-xs font-bold text-white/40 mb-8 h-4 uppercase tracking-widest">
                  {plan.pM !== 'Custom' && isAnnual && `Billed $${(plan.pA as number) * 12} yearly`}
               </p>
               <ul className="space-y-5 mb-14 flex-1">
                  {plan.f.map((f, j) => (
                    <li key={j} className="flex items-center gap-4 text-lg font-bold text-white">
                      <Check className="w-5 h-5 text-brand-500" /> {f}
                    </li>
                  ))}
               </ul>
               <Link href="/register" className={cn(
                  "w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-center transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                  plan.popular ? "bg-white text-surface-950 hover:bg-brand-600 hover:text-white hover:shadow-brand-600/30" : "bg-white/10 text-white hover:bg-white/20"
               )}>
                 {plan.pM === 'Custom' ? 'Contact Sales' : 'Start 14-day free trial'}
               </Link>
             </div>
           ))}
        </div>

        {/* Onboarding Assurance */}
        <div className="max-w-4xl mx-auto mt-16 p-6 rounded-2xl bg-brand-600/5 border border-brand-600/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-600/20 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <h4 className="font-black text-white text-lg">Need help migrating?</h4>
                <p className="text-white/60 font-medium">White-glove migration in under 1 day with our onboarding team.</p>
              </div>
           </div>
           <button className="px-6 py-3 rounded-xl border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:scale-105 active:scale-95 transition-all shrink-0">
             Talk to an expert
           </button>
        </div>
      </section>

      {/* Integrations (Expanded) */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8">Works with your <span className="text-brand-500">entire stack.</span></h2>
          <p className="text-xl text-white font-bold mb-16 max-w-2xl">Connect Odyssey to the tools you already use. Full API access, webhooks, and SDKs available for major languages.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full mb-16">
            {[
              { n: 'GitHub', i: <Code2 className="w-6 h-6" /> },
              { n: 'Slack', i: <Activity className="w-6 h-6" /> },
              { n: 'Stripe', i: <Database className="w-6 h-6" /> },
              { n: 'Discord', i: <Users className="w-6 h-6" /> },
              { n: 'Vercel', i: <Zap className="w-6 h-6" /> },
              { n: 'AWS', i: <Globe className="w-6 h-6" /> },
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center gap-4 hover:border-brand-600 transition-all group cursor-pointer">
                <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-brand-600/20 transition-colors">{item.i}</div>
                <span className="text-xs font-black uppercase tracking-widest">{item.n}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
             <Link href="/docs/api" className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
                <Terminal className="w-4 h-4" /> Read API Docs
             </Link>
             <Link href="/docs/webhooks" className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 text-white/60 font-black text-xs uppercase tracking-widest hover:text-white transition-all">
                <Search className="w-4 h-4" /> Explore Webhooks
             </Link>
          </div>
        </div>
      </section>

      {/* Sales-focused FAQ */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center text-white">Frequently asked questions.</h2>
          <div className="space-y-6">
            {[
              { q: "Is vendor lock-in an issue?", a: "No. Odyssey uses standard Postgres under the hood. You have full root access to your database and can export your entire dataset anytime." },
              { q: "Can I self-host Odyssey?", a: "Yes, our Enterprise plan offers VPC peering and self-hosted dedicated clusters for teams with strict compliance requirements." },
              { q: "How secure is tenant isolation?", a: "Extremely secure. We use hardware-level isolation for different clusters, and strict database-level Row-Level Security (RLS) for shared clusters." },
              { q: "What happens if traffic spikes?", a: "Our serverless edge network automatically scales to handle millions of requests per minute. You will never experience downtime due to a traffic surge." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all bg-surface-900 group">
                <h3 className="text-xl font-black mb-4 text-white group-hover:text-brand-500 transition-colors">{item.q}</h3>
                <p className="text-white/70 font-medium leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-600/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 p-16 md:p-24 rounded-[4rem] border-2 border-brand-600 bg-surface-950 shadow-[0_0_100px_-20px_rgba(139,92,246,0.3)]">
          <h2 className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tight">Ready to ship <br /> <span className="text-brand-500">at scale?</span></h2>
          <p className="text-xl md:text-2xl text-white/80 font-bold mb-12 max-w-2xl mx-auto leading-relaxed">Join 10,000+ teams building the future of SaaS on Odyssey.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
             <Link href="/register" className="group w-full sm:w-auto bg-white text-surface-950 px-12 py-6 rounded-2xl font-black text-lg uppercase tracking-wider hover:bg-brand-600 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] flex items-center justify-center gap-3">
               Start 14-Day Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
          <p className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center justify-center gap-4">
             <Check className="w-4 h-4 text-green-500" /> No credit card required
             <Check className="w-4 h-4 text-green-500 hidden sm:block" /> <span className="hidden sm:inline">Cancel anytime</span>
          </p>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="py-24 px-6 border-t border-white/10 bg-surface-950">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-24">
           <div className="col-span-2 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-8 font-black text-2xl tracking-tighter text-white">
                <Zap className="w-6 h-6 fill-white" /> Odyssey
              </Link>
              <p className="text-lg text-white/60 font-medium max-w-xs mb-8">
                The world's most visible multi-tenant infrastructure platform for modern SaaS teams.
              </p>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg w-max">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">All systems operational</span>
              </div>
           </div>
           
           <div>
              <h5 className="text-xs font-black uppercase tracking-widest text-white mb-8">Product</h5>
              <ul className="space-y-4 text-base font-bold text-white/50">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#security" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
           </div>
           
           <div>
              <h5 className="text-xs font-black uppercase tracking-widest text-white mb-8">Resources</h5>
              <ul className="space-y-4 text-base font-bold text-white/50">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/case-studies" className="hover:text-white transition-colors">Case Studies</Link></li>
              </ul>
           </div>

           <div>
              <h5 className="text-xs font-black uppercase tracking-widest text-white mb-8">Company</h5>
              <ul className="space-y-4 text-base font-bold text-white/50">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Sales</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy & Terms</Link></li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/40">
           <p>© {new Date().getFullYear()} Odyssey Infrastructure Inc. San Francisco, CA.</p>
           <div className="flex gap-8">
             <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
             <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
             <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
