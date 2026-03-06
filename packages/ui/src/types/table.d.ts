// At the top of table.tsx or in a separate table.d.ts
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    disableHover?: boolean;
  }
}