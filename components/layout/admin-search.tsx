"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, FileText, Loader2 } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { searchAction, type SearchResult } from "@/app/actions/search";
import { formatCurrency } from "@/lib/utils";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Inactive: "bg-slate-100 text-slate-800",
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-blue-100 text-blue-800",
  Rejected: "bg-red-100 text-red-800",
  Disbursed: "bg-purple-100 text-purple-800",
  NPL: "bg-red-100 text-red-800",
  Closed: "bg-slate-100 text-slate-800",
};

export function AdminSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({ clients: [], loans: [] });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Cmd+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (value.trim().length < 2) {
        setResults({ clients: [], loans: [] });
        return;
      }
      startTransition(async () => {
        const data = await searchAction(value);
        setResults(data);
      });
    },
    []
  );

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    setResults({ clients: [], loans: [] });
    router.push(href);
  };

  const hasResults = results.clients.length > 0 || results.loans.length > 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-full max-w-md items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 transition-colors hover:bg-white"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search clients, loans...</span>
        <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs font-medium text-slate-400 sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search across clients and loans"
        showCloseButton={false}
      >
        <CommandInput
          placeholder="Search clients, loans..."
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList>
          {isPending && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          )}

          {!isPending && query.length >= 2 && !hasResults && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {!isPending && query.length < 2 && (
            <div className="py-6 text-center text-sm text-slate-400">
              Type at least 2 characters to search...
            </div>
          )}

          {results.clients.length > 0 && (
            <CommandGroup heading="Clients">
              {results.clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={`client-${client.name}`}
                  onSelect={() => handleSelect(`/dss/admin/clients`)}
                  className="cursor-pointer"
                >
                  <Users className="h-4 w-4 text-blue-500" />
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="text-xs text-slate-500">{client.phone}</p>
                    </div>
                    <Badge className={statusColors[client.status] || "bg-slate-100 text-slate-800"}>
                      {client.status}
                    </Badge>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results.clients.length > 0 && results.loans.length > 0 && (
            <CommandSeparator />
          )}

          {results.loans.length > 0 && (
            <CommandGroup heading="Loans">
              {results.loans.map((loan) => (
                <CommandItem
                  key={loan.id}
                  value={`loan-${loan.purpose}-${loan.clientName}`}
                  onSelect={() => handleSelect(`/dss/admin/loans`)}
                  className="cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-purple-500" />
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{loan.purpose}</p>
                      <p className="text-xs text-slate-500">
                        {loan.clientName} &middot; {formatCurrency(loan.amount)}
                      </p>
                    </div>
                    <Badge className={statusColors[loan.status] || "bg-slate-100 text-slate-800"}>
                      {loan.status}
                    </Badge>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
