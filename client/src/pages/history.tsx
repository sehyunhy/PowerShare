import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionList from "@/components/transaction-list";
import { CURRENT_USER_ID } from "@/lib/constants";

export default function History() {
  const { data: userRequests } = useQuery({
    queryKey: ['/api/requests/user', CURRENT_USER_ID],
  });

  const { data: userTransactions } = useQuery({
    queryKey: ['/api/transactions/user', CURRENT_USER_ID],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[hsl(207,81%,45%)] text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <span className="material-icons">history</span>
              <h1 className="text-xl font-bold">거래 기록</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl pb-24">
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">거래 내역</TabsTrigger>
            <TabsTrigger value="requests">요청 내역</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-4">
            <TransactionList transactions={userTransactions} showAll={true} />
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>에너지 요청 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userRequests && userRequests.length > 0 ? (
                    userRequests.map((request: any) => (
                      <div 
                        key={request.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            request.status === 'pending' ? 'bg-[hsl(45,93%,47%)]' :
                            request.status === 'matched' ? 'bg-[hsl(122,39%,49%)]' :
                            request.status === 'fulfilled' ? 'bg-[hsl(207,81%,45%)]' :
                            'bg-gray-400'
                          }`}>
                            <span className="material-icons text-white text-sm">
                              {request.status === 'pending' ? 'schedule' :
                               request.status === 'matched' ? 'link' :
                               request.status === 'fulfilled' ? 'check' :
                               'close'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">
                              {parseFloat(request.energyAmount).toFixed(1)} kWh 요청
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.urgencyLevel === 'immediate' ? '즉시' :
                               request.urgencyLevel === 'urgent' ? '긴급' :
                               request.urgencyLevel === 'normal' ? '일반' : '예약'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              request.status === 'pending' ? 'secondary' :
                              request.status === 'matched' ? 'default' :
                              request.status === 'fulfilled' ? 'outline' :
                              'destructive'
                            }
                          >
                            {request.status === 'pending' ? '대기 중' :
                             request.status === 'matched' ? '매칭됨' :
                             request.status === 'fulfilled' ? '완료' :
                             '취소됨'}
                          </Badge>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <span className="material-icons text-4xl mb-2">request_quote</span>
                      <p>아직 에너지 요청 내역이 없습니다</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
