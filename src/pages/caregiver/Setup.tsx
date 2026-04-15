import { useState } from 'react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from 'convex/_generated/api';

export default function Setup() {
  const createHousehold = useMutation(api.households.create);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createHousehold({ name: name.trim() });
    } catch {
      toast.error('Failed to create household');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-xl p-8 card-base">
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-xl shadow-sm mx-auto mb-4">
              ✨
            </div>
            <h1 className="font-display-hero font-bold text-2xl text-foreground">Welcome to ChoreChamp</h1>
            <p className="text-muted-foreground mt-2">Let&apos;s set up your family household</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="householdName" className="text-sm font-medium text-foreground block mb-2">
                Household Name
              </label>
              <input
                id="householdName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="The Smith Family"
                className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Create Household</span>
                  <span className="text-lg">→</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}