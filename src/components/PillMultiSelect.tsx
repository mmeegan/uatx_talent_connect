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
      <span
        id={id}
        className="block text-sm font-medium text-uatx-ink"
      >
        {label}
        {optional && (
          <span className="ml-1 font-normal text-uatx-sand">(optional)</span>
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
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-uatx-gold focus:ring-offset-2 " +
                (isSelected
                  ? "border-uatx-gold bg-uatx-gold text-uatx-ink"
                  : "border-gray-200 bg-white text-uatx-ink hover:border-uatx-gold/50 hover:bg-uatx-gold/5")
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
