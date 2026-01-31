"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export interface SearchResult {
  clients: {
    id: string;
    name: string;
    phone: string;
    status: string;
  }[];
  loans: {
    id: string;
    purpose: string;
    clientName: string;
    status: string;
    amount: number;
  }[];
}

export async function searchAction(query: string): Promise<SearchResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { clients: [], loans: [] };
    }

    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      return { clients: [], loans: [] };
    }

    const searchTerm = `%${trimmed}%`;

    const [clients, loans] = await Promise.all([
      prisma.client.findMany({
        where: {
          OR: [
            { surname: { contains: trimmed, mode: "insensitive" } },
            { otherNames: { contains: trimmed, mode: "insensitive" } },
            { phoneMobile: { contains: trimmed } },
            { idPassportNo: { contains: trimmed, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: {
          id: true,
          surname: true,
          otherNames: true,
          phoneMobile: true,
          status: true,
        },
      }),
      prisma.loanApplication.findMany({
        where: {
          OR: [
            { purpose: { contains: trimmed, mode: "insensitive" } },
            { id: { contains: trimmed, mode: "insensitive" } },
            {
              client: {
                OR: [
                  { surname: { contains: trimmed, mode: "insensitive" } },
                  { otherNames: { contains: trimmed, mode: "insensitive" } },
                ],
              },
            },
          ],
        },
        take: 5,
        select: {
          id: true,
          purpose: true,
          status: true,
          amountRequested: true,
          client: {
            select: { surname: true, otherNames: true },
          },
        },
      }),
    ]);

    return {
      clients: clients.map((c) => ({
        id: c.id,
        name: `${c.otherNames} ${c.surname}`,
        phone: c.phoneMobile,
        status: c.status,
      })),
      loans: loans.map((l) => ({
        id: l.id,
        purpose: l.purpose,
        clientName: `${l.client.otherNames} ${l.client.surname}`,
        status: l.status,
        amount: Number(l.amountRequested),
      })),
    };
  } catch {
    return { clients: [], loans: [] };
  }
}
