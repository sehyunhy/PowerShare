import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProviderCardProps {
  provider: {
    id: number;
    providerName: string;
    energyType: string;
    availableEnergy: string;
    currentProduction: string;
    pricePerKwh: string;
    isActive: boolean;
  };
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const getEnergyTypeIcon = (type: string) => {
    switch (type) {
      case 'solar':
        return 'solar_power';
      case 'wind':
        return 'air';
      case 'battery':
        return 'battery_charging_full';
      default:
        return 'flash_on';
    }
  };

  const getEnergyTypeName = (type: string) => {
    switch (type) {
      case 'solar':
        return '태양광 패널';
      case 'wind':
        return '풍력 발전';
      case 'battery':
        return '배터리 저장';
      default:
        return '에너지 공급';
    }
  };

  const isAvailable = parseFloat(provider.availableEnergy || "0") > 0;

  return (
    <div className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
      !isAvailable ? 'opacity-60' : ''
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isAvailable ? 'bg-[hsl(122,39%,49%)]' : 'bg-gray-400'
          }`}>
            <span className="material-icons text-white">
              {getEnergyTypeIcon(provider.energyType)}
            </span>
          </div>
          <div>
            <h4 className="font-medium">{provider.providerName}</h4>
            <div className="text-sm text-gray-500">
              거리 정보 • {getEnergyTypeName(provider.energyType)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${
            isAvailable ? 'text-[hsl(122,39%,49%)]' : 'text-gray-400'
          }`}>
            {parseFloat(provider.availableEnergy || "0").toFixed(1)} kWh
          </div>
          <div className="text-xs text-gray-400">
            {isAvailable ? '사용 가능' : '사용 불가'}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`material-icons text-sm ${
            isAvailable ? 'text-[hsl(122,39%,49%)]' : 'text-gray-400'
          }`}>
            {isAvailable ? 'check_circle' : 'schedule'}
          </span>
          <span className="text-sm text-gray-600">
            {isAvailable ? '실시간 공유 중' : '일시적 사용 불가'}
          </span>
          {isAvailable && (
            <Badge variant="outline" className="text-xs">
              ₩{parseFloat(provider.pricePerKwh || "0.15").toFixed(2)}/kWh
            </Badge>
          )}
        </div>
        <Button 
          size="sm" 
          disabled={!isAvailable}
          className={isAvailable ? '' : 'cursor-not-allowed'}
        >
          {isAvailable ? '연결하기' : '대기 중'}
        </Button>
      </div>
    </div>
  );
}
