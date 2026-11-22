export function Good({ onDelete }: { onDelete: () => void }) {
  const form = { confirm: () => true };
  form.confirm();
  return (
    <form className="flex flex-col gap-6 p-4 font-semibold text-ink bg-surface">
      <button type="submit">Save</button>
      <button type="button" aria-label="Delete invoice" onClick={onDelete}>
        <svg viewBox="0 0 16 16"><path d="M0 0h16v16H0z" /></svg>
      </button>
      <button type="button">
        <svg viewBox="0 0 16 16"><path d="M0 0h16v16H0z" /></svg>
        <span className="sr-only">Close</span>
      </button>
      {/* everyday-lint-ignore-next-line spacing -- optical alignment with the logo */}
      <div className="mt-5">Logo row</div>
    </form>
  );
}
