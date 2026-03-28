
// components/shared/DataTable.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => string);
  render?: (item: T) => React.ReactNode;
};



type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading: boolean;
};

export function DataTable<T extends { _id?: string }>({
  columns,
  data,
  isLoading,
}: DataTableProps<T>) {


  return (
    <div className="w-full overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100 text-black text-lg">
          <tr>
            {columns.map((col) => (
              <th key={String(col.accessor)} className="border px-4 py-2">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? [...Array( 10)].map((_, idx) => (
                <tr key={idx}>
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            : data.map((row, rowIdx) => (
                <tr key={row._id || rowIdx} className="bg-white text-black hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={String(col.accessor)} className="border px-4 py-2">
                    {col.render
                      ? col.render(row)
                      : typeof col.accessor === "function"
                      ? col.accessor(row)
                      : String(row[col.accessor] ?? "")}
                  </td>
                  
                  ))}
                </tr>
              ))}
        </tbody>
      </table>

    
    </div>
  );
}
