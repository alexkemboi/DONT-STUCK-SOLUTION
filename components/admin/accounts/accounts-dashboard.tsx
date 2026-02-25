import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Define the type for each account balance
export type Balance = {
  gl_account_id: string; // unique account id
  account_type: "Asset" | "Liability";
  balance: number;
};


// Define the props for the component


type AccountsDashboardProps = {
  balances: Balance[];
};



export function AccountsDashboard({ balances }: AccountsDashboardProps) {
  const totalAssets = balances
    .filter(b => b.account_type === "Asset")
    .reduce((s, b) => s + b.balance, 0);

  const totalLiabilities = balances
    .filter(b => b.account_type === "Liability")
    .reduce((s, b) => s + b.balance, 0);

  const netPosition = totalAssets - totalLiabilities;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="flex gap-4 p-4">
          <Wallet />
          <div>
            <p className="text-sm text-slate-500">Total Assets</p>
            <p className="text-xl font-bold">
              {formatCurrency(totalAssets)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex gap-4 p-4">
          <TrendingDown />
          <div>
            <p className="text-sm text-slate-500">Total Liabilities</p>
            <p className="text-xl font-bold">
              {formatCurrency(totalLiabilities)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex gap-4 p-4">
          <TrendingUp />
          <div>
            <p className="text-sm text-slate-500">Net Position</p>
            <p className="text-xl font-bold">
              {formatCurrency(netPosition)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
