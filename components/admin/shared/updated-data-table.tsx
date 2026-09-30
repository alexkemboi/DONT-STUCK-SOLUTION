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
import { Search } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

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

    return (
        <div className="w-full space-y-4">
            {(enableSearch || toolbar) && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {enableSearch && (
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={searchPlaceholder}
                                value={globalFilter ?? ""}
                                onChange={(event) =>
                                    setGlobalFilter(event.target.value)
                                }
                                className="pl-9"
                            />
                        </div>
                    )}
                    {toolbar && (
                        <div className="flex flex-wrap items-center gap-2">
                            {toolbar}
                        </div>
                    )}
                </div>
            )}

            <div className="w-full overflow-x-auto rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="whitespace-nowrap"
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
                                    className={
                                        onRowClick ? "cursor-pointer" : ""
                                    }
                                    onClick={() => onRowClick?.(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="whitespace-nowrap"
                                        >
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
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
