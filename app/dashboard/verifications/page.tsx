export default function VerificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verified Badges</h1>
        <p className="text-muted-foreground">Get verified for the rarest cultivars</p>
      </div>
      <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
        <p>No verification requests yet.</p>
        <p className="text-sm mt-2">We'll build this in a later step.</p>
      </div>
    </div>
  );
}