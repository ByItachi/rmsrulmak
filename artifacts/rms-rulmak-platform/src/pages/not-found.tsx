import { PageIntro } from '@/components/page-intro';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <PageIntro eyebrow="404" title="Sayfa bulunamadı" description="Aradığınız sayfa taşınmış veya kaldırılmış olabilir." />
      <main className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <Link href="/" data-testid="link-404-home" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Ana sayfaya dön <ArrowRight size={16} /></Link>
      </main>
    </div>
  );
}
