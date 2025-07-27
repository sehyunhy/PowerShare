import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CURRENT_USER_ID } from "@/lib/constants";

const energyRequestSchema = z.object({
  energyAmount: z.number().min(0.1).max(50),
  urgencyLevel: z.enum(["immediate", "urgent", "normal", "scheduled"]),
  preferredTimeSlot: z.string().optional(),
  maxPrice: z.number().optional(),
});

type EnergyRequestForm = z.infer<typeof energyRequestSchema>;

interface EnergyRequestFormProps {
  onSuccess?: () => void;
}

export default function EnergyRequestForm({ onSuccess }: EnergyRequestFormProps) {
  const [energyAmount, setEnergyAmount] = useState([5]);
  const [isMatching, setIsMatching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EnergyRequestForm>({
    resolver: zodResolver(energyRequestSchema),
    defaultValues: {
      energyAmount: 5,
      urgencyLevel: "normal",
      preferredTimeSlot: "immediate",
      maxPrice: 0.20,
    },
  });

  const createRequest = useMutation({
    mutationFn: async (data: EnergyRequestForm) => {
      return await apiRequest("POST", "/api/requests", {
        ...data,
        userId: CURRENT_USER_ID,
      });
    },
    onSuccess: () => {
      setIsMatching(true);
      toast({
        title: "에너지 요청 완료",
        description: "AI가 최적의 공급자를 찾고 있습니다.",
      });
      
      // Simulate AI matching process
      setTimeout(() => {
        setIsMatching(false);
        toast({
          title: "매칭 완료!",
          description: "근처 공급자와 연결되었습니다.",
          variant: "default",
        });
        onSuccess?.();
      }, 3000);

      queryClient.invalidateQueries({ queryKey: ['/api/requests'] });
    },
    onError: (error) => {
      toast({
        title: "요청 실패",
        description: "에너지 요청 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EnergyRequestForm) => {
    createRequest.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="energyAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>필요한 에너지량</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Slider
                    value={energyAmount}
                    onValueChange={(value) => {
                      setEnergyAmount(value);
                      field.onChange(value[0]);
                    }}
                    max={50}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-right">
                    <span className="font-medium text-[hsl(207,81%,45%)] text-lg">
                      {energyAmount[0]} kWh
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredTimeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>사용 시간</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="사용 시간대를 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="immediate">지금 즉시</SelectItem>
                  <SelectItem value="1hour">1시간 후</SelectItem>
                  <SelectItem value="evening">저녁 시간대 (18:00-20:00)</SelectItem>
                  <SelectItem value="night">야간 시간대 (22:00-06:00)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="urgencyLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>긴급도</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="긴급도를 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="immediate">즉시 필요</SelectItem>
                  <SelectItem value="urgent">긴급</SelectItem>
                  <SelectItem value="normal">일반</SelectItem>
                  <SelectItem value="scheduled">예약</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-[hsl(14,83%,55%)] hover:bg-[hsl(14,83%,45%)] text-white py-4 px-6 text-lg font-bold"
          disabled={createRequest.isPending || isMatching}
        >
          <span className="material-icons mr-2">flash_on</span>
          {createRequest.isPending || isMatching ? "소집 중..." : "소집 해줘!"}
        </Button>

        {(createRequest.isPending || isMatching) && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="material-icons text-[hsl(207,81%,45%)] animate-spin">sync</span>
                <span className="text-sm font-medium">AI 매칭 진행 중...</span>
              </div>
              <div className="text-xs text-gray-500">
                반경 2km 내 공급자를 분석하고 있습니다.
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </Form>
  );
}
