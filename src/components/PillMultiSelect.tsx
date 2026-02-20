"use client";

export type PillMultiSelectProps = {
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
  id: string;
  optional?: boolean;
};

export default function PillMultiSelect({
  options,
  selected,
  onChange,
  label,
  id,
  optional = false,
}: PillMultiSelectProps) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, value: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(value);
    }
  }

  return (
    <div>
      <span id={id} className="block text-sm font-medium text-zinc-300">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-zinc-500">(optional)</span>
        )}
      </span>
      <div
        className="mt-3 flex flex-wrap gap-2"
        role="group"
        aria-labelledby={id}
        aria-label={label}
      >
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggle(opt)}
              onKeyDown={(e) => handleKeyDown(e, opt)}
              className={
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-[#0B0F14] " +
                (isSelected
                  ? "border-zinc-400 bg-zinc-100 text-zinc-900"
                  : "border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800")
              }
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
