import React from 'react';
import { Layers, Users } from 'lucide-react';
import { useTenantStore } from '../../stores/tenantStore';
import { cn } from '../../lib/utils';

interface FloorSidebarProps {
  selectedFloorId: string | null;
  onSelectFloor: (floorId: string | null) => void;
}

const FloorSidebar: React.FC<FloorSidebarProps> = ({ selectedFloorId, onSelectFloor }) => {
  const { floors, rooms } = useTenantStore();

  const getRoomCountByFloor = (floorId: string) => {
    return rooms.filter(r => r.floorId === floorId).length;
  };

  const sortedFloors = [...floors].sort((a, b) => a.sortOrder - b.sortOrder);
  const totalRooms = rooms.length;

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#165DFF]" />
          楼层导航
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        <button
          onClick={() => onSelectFloor(null)}
          className={cn(
            'w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors',
            'hover:bg-gray-50',
            selectedFloorId === null ? 'bg-blue-50 text-[#165DFF] font-medium' : 'text-gray-700'
          )}
        >
          <span className="text-sm">全部楼层</span>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            selectedFloorId === null ? 'bg-[#165DFF]/10 text-[#165DFF]' : 'bg-gray-100 text-gray-500'
          )}>
            {totalRooms}间
          </span>
        </button>

        <div className="my-1 border-t border-gray-100" />

        {sortedFloors.map(floor => {
          const roomCount = getRoomCountByFloor(floor.id);
          const isSelected = selectedFloorId === floor.id;
          
          return (
            <button
              key={floor.id}
              onClick={() => onSelectFloor(floor.id)}
              className={cn(
                'w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors',
                'hover:bg-gray-50',
                isSelected ? 'bg-blue-50 text-[#165DFF] font-medium' : 'text-gray-700'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{floor.name}</span>
              </div>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                isSelected ? 'bg-[#165DFF]/10 text-[#165DFF]' : 'bg-gray-100 text-gray-500'
              )}>
                {roomCount}间
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Users className="w-3.5 h-3.5" />
          <span>共 {totalRooms} 个会议室</span>
        </div>
      </div>
    </aside>
  );
};

export default FloorSidebar;
