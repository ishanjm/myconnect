export const modalStyles = {
  backdrop: "fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200",
  container: "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl animate-in zoom-in-95 duration-200",
  header: "flex items-center justify-between border-b border-[var(--color-border)] p-5 sticky top-0 bg-[var(--color-surface)] z-10",
  title: "text-lg font-bold text-[var(--color-fg)]",
  closeBtn: "rounded-full p-2 text-[var(--color-fg)] opacity-50 transition-all hover:bg-[var(--color-fg)]/10 hover:opacity-100",
  content: "p-6",
};
