/**
 * Renders a JSON-LD structured-data block. Server component — the script ships
 * in the initial HTML so crawlers and AI retrievers read it without running JS.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Schema is built from trusted internal data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
