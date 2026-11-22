export function Bad({ invalid }: { invalid: boolean }) {
  const remove = () => {
    if (confirm("Delete?")) alert("Deleted");
  };
  return (
    <form className="flex flex-col gap-5 p-[13px] font-bold">
      <p className="text-gray-500 bg-[#ff0000] mt-4 font-semibold">Hello</p>
      <p style={{ color: "#123456", fontWeight: 300 }}>Inline</p>
      <button type="submit" disabled={invalid}>Save</button>
      <button onClick={remove}>
        <svg viewBox="0 0 16 16"><path d="M0 0h16v16H0z" /></svg>
      </button>
      <a href="#add">Anchor (not a colour)</a>
    </form>
  );
}
