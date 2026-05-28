type JsonLdProps = {
  data: Record<string, unknown>;
};

/** Injects JSON-LD for search engines (public pages only). */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
