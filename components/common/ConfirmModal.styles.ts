export const confirmModalStyles = {
  backdrop: "fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200",
  container: "relative w-full max-w-sm rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl p-6 animate-in zoom-in-95 duration-200",
  iconWrapper: {
    danger: "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-4",
    info: "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4",
  },
  title: "text-xl font-bold text-[var(--color-fg)] text-center mb-2",
  message: "text-sm text-[var(--color-fg)] opacity-60 text-center mb-8",
  actions: "flex flex-col gap-2",
  confirmBtn: {
    danger: "w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20",
    info: "w-full py-3 bg-accent text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-accent/20",
  },
  cancelBtn: "w-full py-3 bg-[var(--color-bg)] text-[var(--color-fg)] rounded-xl font-bold border border-[var(--color-border)] hover:bg-[var(--color-border)] px-4 transition-colors",
};
