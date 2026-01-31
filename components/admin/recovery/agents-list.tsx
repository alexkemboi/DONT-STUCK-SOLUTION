"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Phone, Mail, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  assignedCases: number;
  recoveredAmount: number;
  successRate: number;
  isActive: boolean;
}

interface AgentsListProps {
  agents: Agent[];
}

export function AgentsList({ agents }: AgentsListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id} className="border-slate-200">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-600">
                  {agent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{agent.name}</h3>
                  <Badge
                    variant="outline"
                    className={
                      agent.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }
                  >
                    {agent.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" />
                {agent.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                {agent.email}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span className="text-lg font-bold text-slate-900">
                    {agent.assignedCases}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Cases</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-lg font-bold text-emerald-600">
                    {agent.successRate}%
                  </span>
                </div>
                <p className="text-xs text-slate-500">Success</p>
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-slate-900">
                  {formatCurrency(agent.recoveredAmount).replace("KES", "")}
                </span>
                <p className="text-xs text-slate-500">Recovered</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => toast.info(`Viewing ${agent.name}'s cases`)}
              >
                View Cases
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => toast.info(`Assigning case to ${agent.name}`)}
              >
                Assign Case
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add Agent Card */}
      <Card className="border-2 border-dashed border-slate-200">
        <CardContent className="flex h-full min-h-[250px] flex-col items-center justify-center p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <span className="text-2xl text-slate-400">+</span>
          </div>
          <p className="mt-3 font-medium text-slate-600">Add Recovery Agent</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => toast.info("Add agent modal would open")}
          >
            Add Agent
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
