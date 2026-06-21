import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CollectionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Collection</h1>
          <p className="text-muted-foreground">Track the plants you own</p>
        </div>
        <Button>Add Plant</Button>
      </div>
      <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
        <p>Your collection is empty.</p>
        <p className="text-sm mt-2">We'll add the add-plant UI in the next step.</p>
      </div>
    </div>
  );
}