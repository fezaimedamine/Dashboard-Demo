const colors = ["bg-navy-800", "bg-accent", "bg-navy-500", "bg-sky-500"];

export function AvatarStack({ initials }: { initials: string[] }) {
  return (
    <div className="flex -space-x-2">
      {initials.slice(0, 3).map((i, k) => (
        <span key={i} className={`grid size-7 place-items-center rounded-full text-[10px] font-semibold text-white ring-2 ring-white ${colors[k % colors.length]}`}>{i}</span>
      ))}
      {initials.length > 3 && <span className="grid size-7 place-items-center rounded-full bg-navy-50 text-[10px] font-semibold text-navy-500 ring-2 ring-white">+{initials.length - 3}</span>}
    </div>
  );
}
