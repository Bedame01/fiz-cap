export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg text-muted font-medium mb-6 md:mb-8 italic font-serif tracking-wide">
      ({children})
    </p>
  );
}
