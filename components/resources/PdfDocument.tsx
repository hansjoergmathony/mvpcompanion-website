type PdfDocumentProps = {
  src: string;
  title: string;
  readOnline: string;
  openDocument: string;
  downloadPdf: string;
};

export function PdfDocument({
  src,
  title,
  readOnline,
  openDocument,
  downloadPdf,
}: PdfDocumentProps) {
  return (
    <section aria-label={title} className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <p className="text-sm text-muted">{readOnline}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-blue underline-offset-4 hover:underline"
          >
            {openDocument}
          </a>
          <a
            href={src}
            download
            className="text-sm font-medium text-blue underline-offset-4 hover:underline"
          >
            {downloadPdf}
          </a>
        </div>
      </div>
      <iframe
        src={src}
        title={title}
        className="mt-6 h-[72vh] min-h-[38rem] w-full rounded-xl border border-border bg-card"
      />
    </section>
  );
}
