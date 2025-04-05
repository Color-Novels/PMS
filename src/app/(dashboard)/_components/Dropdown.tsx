"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

export default function SearchDropdown({
  items,
  urlParameterName = "filter",
}: {
  items: { label: string; value: string }[];
  urlParameterName?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function handleSelect(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(urlParameterName, value); // Ensure correct parameter is updated
    router.replace(`${pathname}?${params.toString()}`);
  }

  const selectedValue = searchParams.get(urlParameterName) || items[0].value; // get the first one in array

  return (
    <Select onValueChange={handleSelect} value={selectedValue}>
      <SelectTrigger className="w-48 h-full">
        <SelectValue placeholder="Search by" />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
