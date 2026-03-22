"use client";

import * as React from "react";

import { cn } from "@snappin/ui/lib/utils";
import {
  Table as ReactTableType,
  flexRender,
  Column,
  Row,
} from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { ExtraSmall } from "./typography";
import { PaginatedResponse } from "@snappin/shared/pagination";
import { Skeleton } from "./skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Spinner } from "../assets/svg/spinner";

type SortableHeaderProps<TData> = {
  column: Column<TData, unknown>;
  title: string;
  className?: string;
};

export function SortableHeader<TData>({
  column,
  title,
  className,
}: SortableHeaderProps<TData>) {
  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn(
        "w-full flex items-center gap-1 text-xs p-0 font-medium text-muted-foreground cursor-pointer select-none hover:opacity-80",
        className,
      )}
    >
      <span className="flex items-center gap-1">
        {title}

        {sorted === "asc" && (
          <Icon icon="dashicons:arrow-up" className="size-4" />
        )}

        {sorted === "desc" && (
          <Icon icon="dashicons:arrow-down" className="size-4" />
        )}
      </span>
    </button>
  );
}

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full max-w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom overflow-x-auto text-sm",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b-0", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-semibold text-slate-600 text-xs whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[role=checkbox]:translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[role=checkbox]:translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

function TableSkeleton({
  columns,
  rows = 2,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow
          key={rowIdx}
          className={cn(
            "bg-card border-b-0 hover:bg-card-secondary",
            rowIdx === 0 &&
              "[&>td:first-child]:rounded-tl-2xl [&>td:last-child]:rounded-tr-2xl",
            rowIdx === rows - 1 &&
              "[&>td:first-child]:rounded-bl-2xl [&>td:last-child]:rounded-br-2xl",
          )}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={colIdx} className="py-4">
              <Skeleton className="h-6 w-full rounded-md" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function getVisiblePages(current: number, total: number) {
  const pages: number[] = [];

  for (let i = 1; i <= total; i++) {
    pages.push(i);
  }

  return pages;
}

type TableTab = {
  key: string;
  label: string;
  count?: number;
};

export function TableTabs({
  value,
  onChange,
  tabs,
}: {
  value: string;
  onChange: (v: string) => void;
  tabs: TableTab[];
}) {
  return (
    <div className="flex items-center">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "px-2 py-1 text-sm cursor-pointer font-medium rounded-lg transition-colors",
            value === tab.key
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
          {typeof tab.count === "number" && (
            <span className="ml-1 text-xs opacity-60">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export type PaginatedTableProps<T> = {
  table: ReactTableType<T>;
  loading?: boolean;
  pagination: Pick<
    PaginatedResponse<T>,
    "page" | "totalPages" | "limit" | "hasNextPage" | "hasPrevPage"
  >;
  next: () => void;
  prev: () => void;
  toolbar?: React.ReactNode;
  changeLimit?: (limit: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  processingStateText?: string | null;
  onRowClick?: (row: Row<T>) => void;
  hidePagination?: boolean;
  emptyStateComponent?: React.ReactNode;
  selectedRowIndex?: number | null;
};

export function PaginatedTable<T>({
  table,
  loading = false,
  pagination,
  next,
  prev,
  changeLimit,
  toolbar,
  selectedRowIndex,
  hidePagination = false,
  processingStateText,
  emptyStateComponent,
  onRowClick,
  // emptyTitle,
  // emptyDescription,
  // emptyAction,
}: PaginatedTableProps<T>) {
  const { page, totalPages, limit, hasPrevPage, hasNextPage } = pagination;
  const pages = getVisiblePages(page, totalPages);
  const colSpan = table.getAllLeafColumns().length;

  return (
    <>
      {!loading &&
      table.getRowModel().rows.length <= 0 &&
      emptyStateComponent ? (
        emptyStateComponent
      ) : (
        <div className="w-full bg-table shadow mb-2 border border-border/50 px-2 rounded-xl pt-0">
          {toolbar && <div className="pb-4">{toolbar}</div>}
          <div className="w-full">
            <div className="w-full overflow-hidden">
              <Table>
                <TableHeader className="p-0 h-12 border-b! border-border/40">
                  {table.getHeaderGroups().map((group) => (
                    <TableRow key={group.id} className="hover:bg-transparent">
                      {group.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          style={{ width: header.getSize() }}
                          className="text-xs font-medium tracking-wide text-muted-foreground"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                {loading ? (
                  <TableBody>
                    <TableSkeleton
                      columns={table.getAllLeafColumns().length}
                      rows={5}
                    />
                  </TableBody>
                ) : (
                  <TableBody className="bg-table border-b border-border last:border-b-transparent">
                    {processingStateText && (
                      <TableRow>
                        <TableCell colSpan={colSpan}>
                          <div className="flex items-center text-gray-500 gap-2">
                            <Spinner className="size-4" />
                            {processingStateText}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {table.getRowModel().rows.map((row, rowIndex) => (
                      <TableRow
                        key={row.id}
                        onClick={() => onRowClick?.(row)}
                        className={cn(
                          "group transition-colors border-b-0 hover:bg-accent/20 cursor-pointer border-border/80", // ← add `group`
                          "transition-colors border-b hover:bg-accent/30 cursor-pointer border-border/50",
                          row
                            .getAllCells()
                            .some(
                              (c) => c.column.columnDef.meta?.disableHover,
                            ) && "hover:bg-transparent cursor-default",
                          rowIndex === 0 &&
                            "[&>td:first-child]:rounded-tl-lg [&>td:last-child]:rounded-tr-lg",
                          rowIndex === selectedRowIndex &&
                            "bg-accent hover:bg-accent", // ← highlight selected
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            style={{ width: cell.column.getSize() }}
                            className="py-3.5 text-gray-700"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </div>
            {!hidePagination && (
              <div className="flex items-center justify-between p-3 pb-4 w-full">
                {/* Left Section - Limit Selector (Optional) */}
                {changeLimit && (
                  <div className="flex items-center gap-2">
                    <ExtraSmall className="text-muted-foreground">
                      Rows per page
                    </ExtraSmall>
                    <Select
                      value={String(limit)}
                      onValueChange={(value) => changeLimit?.(Number(value))}
                    >
                      <SelectTrigger size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" align="start">
                        {[5, 10, 20, 50].map((size) => (
                          <SelectItem
                            className="py-1.5"
                            key={size}
                            value={String(size)}
                          >
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Middle Section - Page Numbers */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={prev}
                    disabled={!hasPrevPage}
                    className="px-2 py-1 text-sm disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {pages.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        if (p < page) prev();
                        if (p > page) next();
                      }}
                      className={`px-3 py-1 text-sm rounded ${
                        p === page ? "font-semibold" : ""
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={next}
                    disabled={!hasNextPage}
                    className="px-2 py-1 text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export type SimpleTableProps<T> = {
  table: ReactTableType<T>;
  loading?: boolean;
  toolbar?: React.ReactNode;
  emptyStateComponent?: React.ReactNode;
  processingStateText?: string | null;
  onRowClick?: (row: Row<T>) => void;
  selectedRowIndex?: number | null;
};

export function SimpleTable<T>({
  table,
  loading = false,
  toolbar,
  emptyStateComponent,
  processingStateText,
  onRowClick,
  selectedRowIndex,
}: SimpleTableProps<T>) {
  const colSpan = table.getAllLeafColumns().length;

  if (!loading && table.getRowModel().rows.length <= 0 && emptyStateComponent) {
    return <>{emptyStateComponent}</>;
  }

  return (
    <div className="w-full bg-table shadow pb-2 mb-2 border border-border/50 px-2 rounded-xl pt-0">
      {toolbar && <div className="pb-4">{toolbar}</div>}
      <div className="pt-0">
        <div className="w-full">
          <Table className="px-0">
            <TableHeader className="h-12 border-b! border-border/40">
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id} className="hover:bg-transparent">
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="text-xs font-medium tracking-wide text-gray-400"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {loading ? (
              <TableBody>
                <TableSkeleton columns={colSpan} rows={2} />
              </TableBody>
            ) : (
              <TableBody className="bg-table">
                {processingStateText && (
                  <TableRow>
                    <TableCell colSpan={colSpan}>
                      <div className="flex items-center text-gray-500 gap-2">
                        <Spinner className="size-4" />
                        {processingStateText}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {table.getRowModel().rows.map((row, rowIndex) => (
                  <TableRow
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "transition-colors border-b hover:bg-accent/20 cursor-pointer border-border/80",
                      row
                        .getAllCells()
                        .some((c) => c.column.columnDef.meta?.disableHover) &&
                        "hover:bg-transparent cursor-default",
                      rowIndex === 0 &&
                        "[&>td:first-child]:rounded-tl-lg [&>td:last-child]:rounded-tr-lg",
                      rowIndex === selectedRowIndex &&
                        "bg-accent hover:bg-accent/90", // ← highlight selected
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className="py-3 text-gray-700 first:rounded-l-md last:rounded-r-md"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
}

export * from "@tanstack/react-table";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
