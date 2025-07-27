import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EnergyCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEnergyEvent = (day: number) => {
    // Mock energy events for demo
    const events: { [key: number]: { type: string; title: string } } = {
      15: { type: 'high-production', title: 'High production expected' },
      16: { type: 'high-demand', title: 'High demand expected' },
      17: { type: 'today', title: 'Today' },
      18: { type: 'scheduled', title: 'Scheduled sharing' },
      20: { type: 'high-production', title: 'High production expected' },
    };
    return events[day];
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'high-production':
        return 'bg-[hsl(122,39%,49%)]';
      case 'high-demand':
        return 'bg-[hsl(14,83%,55%)]';
      case 'today':
        return 'bg-[hsl(207,81%,45%)]';
      case 'scheduled':
        return 'bg-[hsl(45,93%,47%)]';
      default:
        return 'bg-gray-400';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date().getDate();
  const isCurrentMonth = currentMonth.getMonth() === new Date().getMonth() && 
                         currentMonth.getFullYear() === new Date().getFullYear();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">전력 허들 캘린더</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('prev')}
            >
              <span className="material-icons">chevron_left</span>
            </Button>
            <span className="font-medium px-2">
              {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('next')}
            >
              <span className="material-icons">chevron_right</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-12" />;
            }

            const event = getEnergyEvent(day);
            const isToday = isCurrentMonth && day === today;

            return (
              <div
                key={day}
                className={`h-12 flex flex-col justify-center border border-gray-100 hover:bg-gray-50 transition-colors ${
                  isToday ? 'bg-blue-50' : ''
                }`}
              >
                <div className={`font-medium ${isToday ? 'text-[hsl(207,81%,45%)]' : ''}`}>
                  {day}
                </div>
                {event && (
                  <div 
                    className={`w-2 h-2 ${getEventColor(event.type)} rounded-full mx-auto`}
                    title={event.title}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-[hsl(122,39%,49%)] rounded-full" />
            <span>높은 생산 예상</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-[hsl(14,83%,55%)] rounded-full" />
            <span>높은 수요 예상</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-[hsl(45,93%,47%)] rounded-full" />
            <span>예약된 공유</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
