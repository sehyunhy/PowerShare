import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EnergyStatsProps {
  communityStats?: {
    totalProduction: string;
    totalConsumption: string;
    activeProviders: number;
    activeConsumers: number;
    currentFlowRate: string;
  };
}

export default function EnergyStats({ communityStats }: EnergyStatsProps) {
  // Mock user's personal energy data
  const myProduction = {
    current: 15.2,
    efficiency: 76,
    surplus: 8.3
  };

  const myUsage = {
    current: 6.9,
    savings: 2340
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* My Energy Production */}
      <Card className="border-l-4 border-[hsl(122,39%,49%)]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-700">내 에너지 생산</CardTitle>
            <span className="material-icons text-[hsl(122,39%,49%)]">solar_power</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold text-[hsl(122,39%,49%)]">
            {myProduction.current} kWh
          </div>
          <div className="text-sm text-gray-500">현재 생산량</div>
          <div className="bg-[hsl(122,39%,49%)]/10 rounded-full h-2">
            <div 
              className="bg-[hsl(122,39%,49%)] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${myProduction.efficiency}%` }}
            />
          </div>
          <div className="text-xs text-gray-400">
            잉여: <span className="font-medium text-[hsl(122,39%,49%)]">{myProduction.surplus} kWh</span>
          </div>
        </CardContent>
      </Card>

      {/* Community Energy Pool */}
      <Card className="border-l-4 border-[hsl(122,39%,49%)]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-700">커뮤니티 에너지 풀</CardTitle>
            <span className="material-icons text-[hsl(122,39%,49%)]">group</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold text-[hsl(122,39%,49%)]">
            {communityStats ? parseFloat(communityStats.totalProduction).toFixed(1) : '0'} kWh
          </div>
          <div className="text-sm text-gray-500">현재 사용 가능</div>
          <div className="flex items-center text-xs text-gray-400">
            <span className="material-icons text-xs mr-1">people</span>
            <span>{communityStats?.activeProviders || 0}명</span>이 공유 중
          </div>
        </CardContent>
      </Card>

      {/* My Energy Usage */}
      <Card className="border-l-4 border-[hsl(207,81%,45%)]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-700">내 에너지 사용</CardTitle>
            <span className="material-icons text-[hsl(207,81%,45%)]">home</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold text-[hsl(207,81%,45%)]">
            {myUsage.current} kWh
          </div>
          <div className="text-sm text-gray-500">현재 사용량</div>
          <div className="text-xs text-gray-400">
            절약: <span className="font-medium text-[hsl(122,39%,49%)]">₩{myUsage.savings.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
