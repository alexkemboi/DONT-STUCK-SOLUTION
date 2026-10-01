"use client"

import * as React from "react"
import {
    useTable,
    type ColumnDef,
    type ColumnFiltersState,
    type ColumnVisibilityState,
    type RowData,
    type RowSelectionState,
    type SortingState,
} from "@tanstack/react-table"
import { Search, SearchX, X } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"

import { features, type DataTableFeatures } from "./data-table-features"
import { DataTablePagination } from "./pagination"

interface DataTableProps<TData extends RowData> {
    columns: ColumnDef<DataTableFeatures, TData>[]
    data: TData[]
    /** Placeholder for the built-in global search input. Omit `searchPlaceholder` and pass `enableSearch={false}` to hide it entirely. */
    searchPlaceholder?: string
    enableSearch?: boolean
    /** Slot for extra controls (status filters, add button, export, ...) rendered next to the search input. */
    toolbar?: React.ReactNode
    pageSize?: number
    onRowClick?: (row: TData) => void
}

export function DataTable<TData extends RowData>({
    columns,
    data,
    searchPlaceholder = "Search...",
    enableSearch = true,
    toolbar,
    pageSize = 10,
    onRowClick,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<ColumnVisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
        {}
    )
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize,
    })

    const table = useTable({
        features,
        data,
        columns,
        globalFilterFn: "includesString",
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
            pagination,
        },
    })

    const rowCount = table.getFilteredRowModel().rows.length

    return (
        <div className="w-full space-y-4">
            {(enableSearch || toolbar) && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {enableSearch && (
                        <div className="flex items-center gap-2">
                            <div className="relative w-full sm:w-72">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="search"
                                    placeholder={searchPlaceholder}
                                    value={globalFilter ?? ""}
                                    onChange={(event) =>
                                        setGlobalFilter(event.target.value)
                                    }
                                    className="pl-9 pr-8"
                                />
                                {globalFilter ? (
                                    <button
                                        type="button"
                                        onClick={() => setGlobalFilter("")}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        <span className="sr-only">Clear search</span>
                                    </button>
                                ) : null}
                            </div>
                            {globalFilter ? (
                                <span className="hidden whitespace-nowrap text-sm text-slate-500 sm:inline">
                                    {rowCount} result{rowCount === 1 ? "" : "s"}
                                </span>
                            ) : null}
                        </div>
                    )}
                    {toolbar && (
                        <div className="flex flex-wrap items-center gap-2">
                            {toolbar}
                        </div>
                    )}
                </div>
            )}

            <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="bg-slate-50 hover:bg-slate-50"
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="h-11 whitespace-nowrap text-xs font-semibold tracking-wide text-slate-500 uppercase"
                                        >
                                            {header.isPlaceholder ? null : (
                                                <table.FlexRender
                                                    header={header}
                                                />
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={cn(
                                        "border-slate-100 hover:bg-slate-50",
                                        onRowClick && "cursor-pointer"
                                    )}
                                    onClick={() => onRowClick?.(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="whitespace-nowrap py-2.5 text-slate-700"
                                        >
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={columns.length} className="p-0">
                                    <Empty className="border-none py-10">
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <SearchX />
                                            </EmptyMedia>
                                            <EmptyTitle>No results</EmptyTitle>
                                            <EmptyDescription>
                                                {globalFilter
                                                    ? `Nothing matches "${globalFilter}". Try a different search.`
                                                    : "There's nothing to show here yet."}
                                            </EmptyDescription>
                                        </EmptyHeader>
                                        {globalFilter ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setGlobalFilter("")}
                                            >
                                                Clear search
                                            </Button>
                                        ) : null}
                                    </Empty>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} />
        </div>
    )
}
