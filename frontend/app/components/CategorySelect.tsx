import { CATEGORIES } from "../constants";
import type { Category } from "../types";

type CategorySelectProps = {
  value: Category;
  onChange: (value: Category) => void;
  id?: string;
};

export default function CategorySelect({
  value,
  onChange,
  id,
}: CategorySelectProps) {
  return (
    <select
      id={id}
      className="select select-bordered w-full"
      value={value}
      onChange={(e) => onChange(e.target.value as Category)}
    >
      {CATEGORIES.map((c) => (
        <option key={c.value} value={c.value}>
          {c.label}
        </option>
      ))}
    </select>
  );
}
