import { useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, Download, Loader2, Maximize, ZoomIn, ZoomOut } from 'lucide-react';

let workerConfigured = false;
function ensureWorker() {
  if (!workerConfigured) {
    pdfjsLib.GlobalWorkerOptions.workerPort = new Worker('/pdf/pdf.worker.v4.min.mjs', { type: 'module' });
    workerConfigured = true;
  }
}

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.25;

export function PdfFlipbook({ src, title }: { src: string; title: string }) {
  const [pages, setPages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [bookKey, setBookKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<any>(null);
  const aspectRef = useRef(1.3);

  const computeSize = () => {
    const aspect = aspectRef.current;
    if (document.fullscreenElement === boxRef.current) {
      const availW = window.innerWidth - 32;
      const availH = window.innerHeight - 100;
      let w = Math.floor(availW / 2);
      let h = Math.round(w * aspect);
      if (h > availH) {
        h = Math.floor(availH);
        w = Math.round(h / aspect);
      }
      return { w: Math.max(w, 240), h: Math.max(h, 280) };
    }
    const cw = boxRef.current?.clientWidth ?? Math.min(window.innerWidth - 48, 1200);
    const w = Math.floor(Math.max(cw / 2, 240));
    const h = Math.round(w * aspect);
    return { w, h };
  };

  useEffect(() => {
    let cancelled = false;
    setPages([]);
    setProgress(0);
    setError('');
    setNotice('');
    setSize(null);
    setZoom(1);
    setBookKey((k) => k + 1);

    (async () => {
      ensureWorker();
      try {
        const doc = await pdfjsLib.getDocument({ url: src }).promise;
        const p1 = await doc.getPage(1);
        const v1 = p1.getViewport({ scale: 1 });
        aspectRef.current = v1.height / v1.width;
        if (cancelled) return;
        setSize(computeSize());

        const MAX_PAGES = 500;
        if (doc.numPages > MAX_PAGES) {
          setNotice('Katalog çok kapsamlı (' + doc.numPages + ' sayfa) — ilk ' + MAX_PAGES + ' sayfası gösteriliyor; tamamı için "PDF indir" kullanın.');
        }
        const total = Math.min(MAX_PAGES, doc.numPages);
        const scale = doc.numPages > 300 ? Math.min(0.8, 600 / v1.width) : Math.min(1.1, 760 / v1.width);
        const rendered: string[] = [];
        for (let i = 1; i <= total; i++) {
          if (cancelled) return;
          const page = await doc.getPage(i);
          const vp = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = Math.floor(vp.width);
          canvas.height = Math.floor(vp.height);
          const ctx = canvas.getContext('2d')!;
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          rendered.push(canvas.toDataURL('image/jpeg', 0.82));
          canvas.width = 0;
          canvas.height = 0;
          if (i % 10 === 0) await new Promise((r) => setTimeout(r, 50));
          setProgress(Math.round((i / total) * 100));
          await new Promise((r) => setTimeout(r, 0));
        }
        if (cancelled) return;
        setPages(rendered);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => { cancelled = true; };
  }, [src]);

  useEffect(() => {
    if (!boxRef.current) return;
    const ro = new ResizeObserver(() => {
      setSize((prev) => (prev ? computeSize() : prev));
      setBookKey((k) => k + 1);
    });
    ro.observe(boxRef.current);
    const onFsChange = () => {
      setIsFullscreen(document.fullscreenElement === boxRef.current);
      setSize((prev) => (prev ? computeSize() : prev));
      setBookKey((k) => k + 1);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => { ro.disconnect(); document.removeEventListener('fullscreenchange', onFsChange); };
  }, []);
  void bookKey;

  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 100) / 100));
  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 100) / 100));
  const flip = (dir: 1 | -1) => {
    const pf = bookRef.current?.pageFlip?.();
    if (!pf) return;
    if (dir > 0) pf.flipNext();
    else pf.flipPrev();
  };
  const fullscreen = () => {
    const el = boxRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  };

  return (
    <div ref={boxRef} className={`flex w-full flex-col items-center ${isFullscreen ? 'justify-center bg-black py-4' : ''}`} data-testid="pdf-flipbook">
      {notice && <div className="mb-3 w-full rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-xs font-semibold text-amber-700">{notice}</div>}
      {error && <div className="w-full rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm font-semibold text-red-700">PDF yüklenemedi: {error}</div>}
      {!error && pages.length === 0 && (
        <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 px-6 py-16">
          <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
            <Loader2 size={20} className="animate-spin text-primary" />
            Katalog sayfaları hazırlanıyor... %{progress}
          </div>
          <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      {!error && size && pages.length > 0 && (
        <>
          <div className={`mb-3 flex items-center gap-1 rounded-full border p-1 shadow-sm ${isFullscreen ? 'border-white/20 bg-white/10 text-white backdrop-blur [&_svg]:stroke-white [&_span]:text-white' : 'border-border bg-card'}`}>
            <button type="button" onClick={zoomOut} disabled={zoom <= ZOOM_MIN} aria-label="Uzaklaştır" data-testid="flip-zoom-out" className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-muted disabled:opacity-40"><ZoomOut size={16} /></button>
            <span className="w-14 text-center text-xs font-bold text-foreground" data-testid="flip-zoom-label">%{Math.round(zoom * 100)}</span>
            <button type="button" onClick={zoomIn} disabled={zoom >= ZOOM_MAX} aria-label="Yakınlaştır" data-testid="flip-zoom-in" className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-muted disabled:opacity-40"><ZoomIn size={16} /></button>
            <span className="mx-1 h-5 w-px bg-border" />
            <button type="button" onClick={() => flip(-1)} aria-label="Önceki sayfa" data-testid="flip-prev" className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-muted"><ChevronLeft size={18} /></button>
            <button type="button" onClick={() => flip(1)} aria-label="Sonraki sayfa" data-testid="flip-next" className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-muted"><ChevronRight size={18} /></button>
            <span className="mx-1 h-5 w-px bg-border" />
            <button type="button" onClick={fullscreen} aria-label="Tam ekran" data-testid="flip-fullscreen" className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-muted"><Maximize size={16} /></button>
            <a href={src} download target="_blank" rel="noopener noreferrer" aria-label="PDF indir" data-testid="flip-download" className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-muted"><Download size={17} /></a>
          </div>
          <div className="w-full overflow-auto" style={{ height: Math.min(Math.round(size.h * zoom) + 44, isFullscreen ? window.innerHeight - 56 : Infinity) }}>
            <div style={{ width: size.w * 2 * zoom, height: size.h * zoom, transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
              <HTMLFlipBook
                key={String(size.w) + '-' + String(size.h) + '-' + String(zoom)}
                ref={bookRef}
                width={size.w}
                height={size.h}
                size="fixed"
                minWidth={320}
                maxWidth={1600}
                minHeight={280}
                maxHeight={1600}
                showCover={false}
                mobileScrollSupport
                drawShadow
                flippingTime={750}
                startZIndex={5}
                useMouseEvents
                swipeDistance={30}
                showPageCorners
                maxShadowOpacity={0.5}
                disableFlipByClick={false}
                className="flipbook"
                style={{}}
                startPage={0}
                usePortrait={false}
                autoSize={false}
                clickEventForward
              >
                {pages.map((p, i) => (
                  <div key={i} data-testid={`flip-page-${i + 1}`} style={{ width: size.w, height: size.h, overflow: 'hidden', background: '#fff' }} className="flex items-center justify-center">
                    <img src={p} alt={`${title} — sayfa ${i + 1}`} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none' }} />
                  </div>
                ))}
              </HTMLFlipBook>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
