import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Connect to WebSocket server
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      // Authenticate with user ID (in a real app, this would come from auth)
      ws.current?.send(JSON.stringify({ type: 'auth', userId: 1 }));
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'energy_data_update':
            // Invalidate energy-related queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['/api/providers'] });
            queryClient.invalidateQueries({ queryKey: ['/api/community/stats'] });
            break;
            
          case 'new_request':
            toast({
              title: "새로운 에너지 요청",
              description: "커뮤니티에서 에너지를 요청했습니다.",
            });
            queryClient.invalidateQueries({ queryKey: ['/api/requests'] });
            break;
            
          case 'match_found':
            toast({
              title: "매칭 완료!",
              description: "에너지 공급자와 연결되었습니다.",
            });
            queryClient.invalidateQueries({ queryKey: ['/api/requests'] });
            queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
            break;
            
          case 'provider_added':
            toast({
              title: "새로운 공급자",
              description: "근처에 새로운 에너지 공급자가 등록되었습니다.",
            });
            queryClient.invalidateQueries({ queryKey: ['/api/providers'] });
            break;
            
          default:
            console.log('Unhandled WebSocket message:', data);
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [queryClient, toast]);

  return ws.current;
}
