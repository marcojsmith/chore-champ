import { Link } from 'react-router-dom';
import { CheckCircle2, Shield, Coins, BarChart3, Star, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: <CheckCircle2 size={22} />, title: 'Smart Chore Tracking', description: 'Daily, weekly, or monthly chores with flexible scheduling and automatic recurrence.' },
  { icon: <Coins size={22} />, title: 'Token Rewards', description: 'Kids earn tokens for completed chores with streak and early-completion bonuses.' },
  { icon: <Shield size={22} />, title: 'Approval Workflow', description: 'Auto-approve or review completions with optional photo proof for accountability.' },
  { icon: <BarChart3 size={22} />, title: 'Progress Reports', description: 'Track completion rates, streaks, and earning trends over time with rich charts.' },
  { icon: <Star size={22} />, title: 'Reward Store', description: 'Create custom rewards kids can redeem with their hard-earned tokens.' },
  { icon: <Zap size={22} />, title: 'Bonus System', description: 'Motivate with early completion bonuses and streak rewards to build good habits.' },
];

const stats = [
  { label: 'Chores completed', value: '50K+' },
  { label: 'Happy families', value: '2,000+' },
  { label: 'Tokens earned', value: '1M+' },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="container relative py-20 md:py-28 lg:py-36 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6 shadow-sm">
              <Sparkles size={13} /> Family chore management, reimagined
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display-hero leading-[1.1] tracking-tight">
              Turn chores into{' '}
              <span className="relative">
                <span className="text-primary">adventures</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C50 4 100 2 150 4C200 6 250 8 298 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-accent"/>
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-8 max-w-xl mx-auto leading-relaxed">
              Assign chores, track progress, reward effort. ChoreChamp makes household responsibilities engaging for kids and effortless for parents.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <Link to="/sign-up">
                <Button size="lg" className="h-13 px-8 text-base font-semibold shadow-md gap-2 group">
                  Get Started Free
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link to="/sign-in">
                <Button size="lg" variant="outline" className="h-13 px-8 text-base border-2">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">No credit card required · Free forever for small families</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-card/50">
        <div className="container py-10">
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-bold font-display text-foreground">{s.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight">Everything your family needs</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">A complete toolkit for building responsibility and rewarding effort.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {features.map((feature, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-display font-bold text-base mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 md:py-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-10 md:p-16 text-center text-primary-foreground shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to get started?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto text-lg">
              Join thousands of families making chores a positive experience for everyone.
            </p>
            <Link to="/sign-up">
              <Button size="lg" variant="secondary" className="h-13 px-10 text-base font-semibold shadow-lg gap-2 group">
                Create Your Household
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}