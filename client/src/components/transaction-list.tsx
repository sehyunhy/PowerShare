import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: number;
  energyAmount: string;
  pricePerKwh: string;
  totalPrice: string;
  status: string;
  createdAt: string;
}

interface TransactionListProps {
  transactions?: Transaction[];
  showAll?: boolean;
}

export default function TransactionList({ transactions, showAll = false }: TransactionListProps) {
  const displayTransactions = showAll ? transactions : transactions?.slice(0, 5);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'received':
        return 'arrow_downward';
      case 'supplied':
        return 'arrow_upward';
      case 'payment':
        return 'account_balance_wallet';
      default:
        return 'sync_alt';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'received':
        return 'bg-[hsl(122,39%,49%)] text-[hsl(122,39%,49%)]';
      case 'supplied':
        return 'bg-[hsl(207,81%,45%)] text-[hsl(207,81%,45%)]';
      case 'payment':
        return 'bg-[hsl(33,100%,50%)] text-[hsl(122,39%,49%)]';
      default:
        return 'bg-gray-500 text-gray-500';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    } else {
      return time.toLocaleDateString();
    }
  };

  const displayData = displayTransactions || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">최근 거래 내역</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayData.length > 0 ? (
            displayData.map((transaction: Transaction) => {
              // Determine transaction type based on status
              const transactionType = transaction.status === 'completed' ? 'received' : 'pending';
              const colorClass = getTransactionColor(transactionType);
              const iconBgClass = colorClass.split(' ')[0];
              const textColorClass = colorClass.split(' ')[1];
              
              return (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${iconBgClass} rounded-full flex items-center justify-center`}>
                      <span className="material-icons text-white text-sm">
                        {getTransactionIcon(transactionType)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {parseFloat(transaction.energyAmount).toFixed(1)} kWh 거래
                      </div>
                      <div className="text-sm text-gray-500">
                        ₩{parseFloat(transaction.pricePerKwh).toFixed(2)}/kWh
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${textColorClass}`}>
                      ₩{parseFloat(transaction.totalPrice).toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatTime(transaction.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="material-icons text-4xl mb-2">receipt_long</span>
              <p>거래 내역이 없습니다</p>
            </div>
          )}
        </div>

        {!showAll && displayData.length > 0 && (
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-[hsl(207,81%,45%)] hover:bg-blue-50"
          >
            전체 거래 내역 보기
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
