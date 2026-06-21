import Link from 'next/link';
import { Leaf, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Leaf className="h-6 w-6 text-green-600" />
          <span>Pothos DB</span>
        </Link>
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            The rarest Epipremnum & Scindapsus database
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Track, verify & share your <span className="text-green-600">rare pothos</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The first community-driven database of rare cultivars. Get verified badges, 
            build your collection, and discover the rarest plants.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg">Get started free</Button>
            </Link>
            <Link href="/cultivars">
              <Button size="lg" variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Browse cultivars
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}