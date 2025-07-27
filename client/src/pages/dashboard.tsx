import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EnergyStats from "@/components/energy-stats";
import EnergyRequestForm from "@/components/energy-request-form";
import ProviderCard from "@/components/provider-card";
import TransactionList from "@/components/transaction-list";
import EnergyCalendar from "@/components/energy-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/use-websocket";
import { CURRENT_USER_ID } from "@/lib/constants";

export default function Dashboard() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  
  // WebSocket connection for real-time updates
  useWebSocket();

  // Fetch active energy providers
  const { data: providers = [], isLoading: providersLoading } = useQuery({
    queryKey: ['/api/providers'],
  });

  // Fetch user's energy requests
  const { data: userRequests = [] } = useQuery({
    queryKey: ['/api/requests/user', CURRENT_USER_ID],
  });

  // Fetch recent transactions
  const { data: recentTransactions = [] } = useQuery<any[]>({
    queryKey: ['/api/transactions/recent', 5],
  });

  // Fetch community stats
  const { data: communityStats } = useQuery<{
    totalProduction: string;
    totalConsumption: string;
    activeProviders: number;
    activeConsumers: number;
    currentFlowRate: string;
  }>({
    queryKey: ['/api/community/stats'],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[hsl(207,81%,45%)] text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[hsl(33,100%,50%)] rounded-full flex items-center justify-center">
                <span className="material-icons text-white text-lg">flash_on</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">PowerShare 허들</h1>
                <p className="text-blue-100 text-sm">내 집 전력, 이웃과 함께 나눠 쓰기</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-blue-700"
              >
                <span className="material-icons">notifications</span>
              </Button>
              <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
                <span className="text-blue-800 text-sm font-medium">김유</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl pb-24">
        {/* Energy Stats Cards */}
        <EnergyStats communityStats={communityStats} />

        {/* Main Action Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Energy Request Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">에너지 요청</CardTitle>
                <Badge 
                  variant="secondary" 
                  className="bg-[hsl(14,83%,55%)]/10 text-[hsl(14,83%,55%)] hover:bg-[hsl(14,83%,55%)]/20"
                >
                  긴급 수요
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <EnergyRequestForm onSuccess={() => setIsRequestFormOpen(false)} />
            </CardContent>
          </Card>

          {/* Available Energy Providers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">근처 에너지 공급자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {providersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <span className="material-icons animate-spin text-blue-500">sync</span>
                    <span className="ml-2">공급자 검색 중...</span>
                  </div>
                ) : Array.isArray(providers) && providers.length > 0 ? (
                  providers.map((provider: any) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <span className="material-icons text-4xl mb-2">solar_power</span>
                    <p>현재 사용 가능한 공급자가 없습니다</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Energy Flow Visualization */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">실시간 에너지 흐름</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="flex items-center justify-between w-full max-w-lg">
                {/* Energy Producers */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-[hsl(122,39%,49%)] rounded-full flex items-center justify-center mb-2">
                    <span className="material-icons text-white text-xl">solar_power</span>
                  </div>
                  <div className="text-sm font-medium">생산자</div>
                  <div className="text-xs text-gray-500">
                    {communityStats?.activeProviders || 0}명
                  </div>
                </div>

                {/* Flow Animation */}
                <div className="flex-1 flex items-center justify-center relative mx-8">
                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i}
                        className="absolute w-2 h-2 bg-[hsl(33,100%,50%)] rounded-full energy-flow-dot"
                        style={{ top: '0', animationDelay: `${(i-1) * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <span className="material-icons text-[hsl(33,100%,50%)] text-2xl absolute">trending_flat</span>
                </div>

                {/* Energy Consumers */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-[hsl(207,81%,45%)] rounded-full flex items-center justify-center mb-2">
                    <span className="material-icons text-white text-xl">home</span>
                  </div>
                  <div className="text-sm font-medium">소비자</div>
                  <div className="text-xs text-gray-500">
                    {communityStats?.activeConsumers || 0}명
                  </div>
                </div>
              </div>

              {/* Energy Statistics Overlay */}
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700">현재 거래량</div>
                <div className="text-lg font-bold text-[hsl(33,100%,50%)]">
                  {parseFloat(communityStats?.currentFlowRate || "0").toFixed(1)} kWh/h
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History and Community Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TransactionList transactions={recentTransactions} />
          <EnergyCalendar />
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsRequestFormOpen(true)}
        className="fixed bottom-20 right-6 md:bottom-6 w-14 h-14 bg-[hsl(14,83%,55%)] hover:bg-[hsl(14,83%,45%)] text-white rounded-full shadow-lg"
        size="icon"
      >
        <span className="material-icons">flash_on</span>
      </Button>
    </div>
  );
}
