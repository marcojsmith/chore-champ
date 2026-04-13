import { Link } from 'react-router-dom';
import { CheckCircle2, Shield, Coins, BarChart3, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  { icon: <CheckCircle2 size={24} />, title: 'Smart Chore Tracking', description: 'Daily, weekly, or monthly chores with flexible scheduling and reminders' },
  { icon: <Coins size={24} />, title: 'Token Rewards', description: 'Kids earn tokens for completed chores with streak and early-completion bonuses' },
  { icon: <Shield size={24} />, title: 'Approval Workflow', description: 'Auto-approve or review completions with optional photo proof' },
  { icon: <BarChart3 size={24} />, title: 'Progress Reports', description: 'Track completion rates, streaks, and earning trends over time' },
  { icon: <Star size={24} />, title: 'Reward Store', description: 'Create custom rewards kids can redeem with earned tokens' },
  { icon: <Zap size={24} />, title: 'Bonus System', description: 'Motivate with early completion bonuses and streak rewards' },
];

export default function LandingPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="container py-16 md:py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Zap size={14} /> Family chore management made fun
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
            Turn chores into <span className="text-primary">adventures</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-lg mx-auto">
            Assign chores, track progress, reward effort. ChoreChamp makes household responsibilities engaging for kids and easy for caregivers.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Link to="/sign-up">
              <Button size="lg" className="h-12 px-8 text-base font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-16 md:pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <Card key={i} className="card-hover border">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-16 md:pb-24">
        <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Ready to get started?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">Join families who are making chores a positive experience for everyone.</p>
          <Link to="/sign-up">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold">
              Create Your Household
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
