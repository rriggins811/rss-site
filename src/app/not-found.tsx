import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/site/GoldRule";

export default function NotFound() {
  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-24 lg:py-32 text-center">
        <div className="inline-block"><GoldRule /></div>
        <p className="mt-4 font-serif text-6xl lg:text-7xl font-extrabold text-burgundy-600">
          404
        </p>
        <h1 className="mt-4">That page isn&rsquo;t here.</h1>
        <p className="mt-6 text-lg text-ink/80 max-w-prose mx-auto">
          Either the page moved, or the link you followed is older than the rebuild.
          Head back home or book a call — both work.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/work-with-ryan">Book free 20-min call</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
