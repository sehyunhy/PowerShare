import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CURRENT_USER_ID } from "@/lib/constants";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['/api/users', CURRENT_USER_ID],
  });

  const { data: userProviders } = useQuery({
    queryKey: ['/api/providers/user', CURRENT_USER_ID],
  });

  const { data: communityStats } = useQuery({
    queryKey: ['/api/community/stats'],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[hsl(207,81%,45%)] text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <span className="material-icons">person</span>
              <h1 className="text-xl font-bold">프로필</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-white hover:bg-blue-700"
            >
              <span className="material-icons mr-2">
                {isEditing ? 'save' : 'edit'}
              </span>
              {isEditing ? '저장' : '편집'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl pb-24">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>프로필 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center">
                <span className="text-blue-800 text-2xl font-medium">
                  {user?.displayName?.slice(0, 2) || "김유"}
                </span>
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      placeholder="표시 이름"
                      defaultValue={user?.displayName || "김유저"}
                    />
                    <Input
                      placeholder="이메일"
                      defaultValue={user?.email || "user@example.com"}
                    />
                    <Input
                      placeholder="위치"
                      defaultValue={user?.location || "서울특별시 강남구"}
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold">{user?.displayName || "김유저"}</h2>
                    <p className="text-gray-600">{user?.email || "user@example.com"}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="material-icons text-sm mr-1">location_on</span>
                      {user?.location || "서울특별시 강남구"}
                    </p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-2">
                  {user?.userType === 'provider' ? '공급자' :
                   user?.userType === 'consumer' ? '소비자' :
                   user?.userType === 'both' ? '공급자 & 소비자' : '사용자'}
                </Badge>
                <div className="text-sm text-gray-500">
                  가입일: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '알 수 없음'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="energy" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="energy">에너지 설정</TabsTrigger>
            <TabsTrigger value="stats">통계</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>
          
          <TabsContent value="energy" className="space-y-4">
            {/* Energy Provider Settings */}
            <Card>
              <CardHeader>
                <CardTitle>에너지 공급 설비</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProviders && userProviders.length > 0 ? (
                    userProviders.map((provider: any) => (
                      <div 
                        key={provider.id}
                        className="border border-gray-200 rounded-lg p-4"
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
                                {provider.energyType} • 최대 {parseFloat(provider.maxCapacity).toFixed(1)} kWh
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch
                              checked={provider.isActive}
                              disabled={!isEditing}
                            />
                            <Label className="text-sm">활성화</Label>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-[hsl(122,39%,49%)]">
                              {parseFloat(provider.currentProduction || "0").toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500">현재 생산</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">
                              {parseFloat(provider.availableEnergy || "0").toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500">사용 가능</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600">
                              ₩{parseFloat(provider.pricePerKwh || "0.15").toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">단가/kWh</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <span className="material-icons text-4xl mb-2">add_circle_outline</span>
                      <p>에너지 공급 설비를 등록해주세요</p>
                      <Button className="mt-4" variant="outline">
                        설비 등록하기
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>나의 에너지 통계</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">42.3</div>
                    <div className="text-sm text-gray-600">총 공급 (kWh)</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">28.1</div>
                    <div className="text-sm text-gray-600">총 소비 (kWh)</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">₩8,420</div>
                    <div className="text-sm text-gray-600">절약 금액</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">15</div>
                    <div className="text-sm text-gray-600">거래 횟수</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>커뮤니티 기여도</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">전체 커뮤니티 대비 기여도</span>
                  <span className="text-lg font-bold text-green-600">12.3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '12.3%' }}></div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>커뮤니티 순위:</span>
                    <span className="font-medium">#8 / {communityStats?.activeProviders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>에코 포인트:</span>
                    <span className="font-medium text-green-600">1,240 pt</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>알림 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>에너지 요청 알림</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>매칭 완료 알림</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>거래 완료 알림</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>커뮤니티 업데이트</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>개인정보 보호</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>위치 정보 공유</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>에너지 데이터 공유</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>프로필 공개</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
