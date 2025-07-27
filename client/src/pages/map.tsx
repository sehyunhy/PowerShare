import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MapView() {
  const { data: providers, isLoading } = useQuery({
    queryKey: ['/api/providers'],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[hsl(207,81%,45%)] text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <span className="material-icons">map</span>
              <h1 className="text-xl font-bold">에너지 공급자 지도</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl pb-24">
        {/* Map Placeholder */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center relative">
              <div className="text-center">
                <span className="material-icons text-6xl text-gray-400 mb-4">map</span>
                <p className="text-gray-600">지도 구현 예정</p>
                <p className="text-sm text-gray-500 mt-2">
                  Leaflet.js를 사용한 대화형 지도가 여기에 표시됩니다
                </p>
              </div>
              
              {/* Simulated map pins */}
              <div className="absolute top-20 left-20">
                <div className="w-4 h-4 bg-[hsl(122,39%,49%)] rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div className="absolute top-32 right-24">
                <div className="w-4 h-4 bg-[hsl(14,83%,55%)] rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div className="absolute bottom-24 left-32">
                <div className="w-4 h-4 bg-[hsl(33,100%,50%)] rounded-full border-2 border-white shadow-lg"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="material-icons">list</span>
              <span>근처 공급자 목록</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <span className="material-icons animate-spin text-blue-500">sync</span>
                  <span className="ml-2">공급자 로딩 중...</span>
                </div>
              ) : providers && providers.length > 0 ? (
                providers.map((provider: any) => (
                  <div 
                    key={provider.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[hsl(122,39%,49%)] rounded-full flex items-center justify-center">
                          <span className="material-icons text-white">
                            {provider.energyType === 'solar' ? 'solar_power' : 
                             provider.energyType === 'wind' ? 'air' : 'battery_charging_full'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{provider.providerName}</h4>
                          <div className="text-sm text-gray-500">
                            거리 정보 • {provider.energyType} 에너지
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[hsl(122,39%,49%)]">
                          {parseFloat(provider.availableEnergy || "0").toFixed(1)} kWh
                        </div>
                        <div className="text-xs text-gray-400">사용 가능</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="material-icons text-[hsl(122,39%,49%)] text-sm">check_circle</span>
                        <span className="text-sm text-gray-600">실시간 공유 중</span>
                        <Badge variant="outline" className="text-xs">
                          ₩{parseFloat(provider.pricePerKwh || "0.15").toFixed(2)}/kWh
                        </Badge>
                      </div>
                      <Button size="sm">연결하기</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="material-icons text-4xl mb-2">solar_power</span>
                  <p>근처에 활성화된 공급자가 없습니다</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
