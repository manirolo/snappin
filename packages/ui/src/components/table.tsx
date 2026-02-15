"use client";

import * as React from "react";

import { cn } from "@snappin/ui/lib/utils";
import {
  Table as ReactTableType,
  flexRender,
  Column,
} from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { ExtraSmall,} from "./typography";
import { PaginatedResponse } from "@snappin/shared/pagination";
import { Skeleton } from "./skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

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
        "flex items-center gap-1 Capitalize cursor-pointer select-none hover:opacity-80",
        className,
      )}
    >
      {title}

      <span className="relative flex h-4 w-4 items-center justify-center">
        {/* Unsorted: both arrows */}
        {!sorted && (
          <span className="absolute flex flex-col items-center opacity-40">
            <Icon icon="dashicons:arrow-up" className="size-4 -mb-2" />
            <Icon icon="dashicons:arrow-down" className="size-4" />
          </span>
        )}

        {/* Sorted ASC */}
        {sorted === "asc" && (
          <Icon icon="dashicons:arrow-up" className="size-4 text-primary" />
        )}

        {/* Sorted DESC */}
        {sorted === "desc" && (
          <Icon icon="dashicons:arrow-down" className="size-4 text-primary" />
        )}
      </span>
    </button>
  );
}

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative rounded-2xl pb-2 w-full max-w-[100vw] overflow-x-auto"
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
        "h-10 px-2 text-left align-middle font-semibold text-slate-600 text-[12.5px] whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[role=checkbox]:translate-y-0.5",
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
        <TableRow key={rowIdx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={colIdx} className="py-4">
              <Skeleton className="h-8 w-full rounded-md" />
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
};

export function PaginatedTable<T>({
  table,
  loading = false,
  pagination,
  next,
  prev,
  changeLimit,
  toolbar,
  // emptyTitle,
  // emptyDescription,
  // emptyAction,
}: PaginatedTableProps<T>) {
  const { page, totalPages, limit, hasPrevPage, hasNextPage } = pagination;
  const pages = getVisiblePages(page, totalPages);

  return (
    <Card>
      {toolbar && <CardHeader className="border-b px-4 py-4 border-dashed">{toolbar}</CardHeader>}
      <CardContent>
        <Table>
          <TableHeader className="h-12">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[12px] font-medium tracking-wide text-muted-foreground"
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
                rows={3}
              />
            </TableBody>
          ) : (
            <TableBody className="bg-white border-b last:border-b-transparent">
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors border-b last:border-b-0 hover:bg-gray-2 cursor-pointer border-border"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="first:rounded-l-lg last:rounded-r-lg"
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
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full py-3">
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
      </CardFooter>
    </Card>
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
