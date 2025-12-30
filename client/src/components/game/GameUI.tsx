import { useState, useRef } from "react";
import { useRollerCoaster } from "@/lib/stores/useRollerCoaster";
import { Button } from "@/components/ui/button";

export function GameUI() {
  const {
    mode,
    trackPoints,
    startRide,
    stopRide,
    clearTrack,
    rideProgress,
    selectedPointId,
    removeTrackPoint,
    rideSpeed,
    setRideSpeed,
    isAddingPoints,
    setIsAddingPoints,
    isLooped,
    setIsLooped,
    hasChainLift,
    setHasChainLift,
  } = useRollerCoaster();
  
  const [position, setPosition] = useState({ x: 8, y: 8 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input')) return;
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const canRide = trackPoints.length >= 2;
  
  return (
    <div 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="absolute pointer-events-auto bg-black/80 p-2 rounded-lg text-white text-xs cursor-move select-none"
        style={{ left: position.x, top: position.y, maxWidth: '180px' }}
        onMouseDown={handleMouseDown}
      >
        <h1 className="text-sm font-bold mb-1">Coaster Builder</h1>
        
        {mode === "build" && (
          <>
            <p className="text-gray-400 mb-1 text-[10px]">
              Pts: {trackPoints.length} | Drag menu to move
            </p>
            
            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                onClick={() => setIsAddingPoints(!isAddingPoints)}
                className={`h-6 text-[10px] px-2 ${isAddingPoints 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-gray-600 hover:bg-gray-700"}`}
              >
                {isAddingPoints ? "Add Pts ON" : "Add Pts OFF"}
              </Button>
              
              <Button
                size="sm"
                onClick={() => setIsLooped(!isLooped)}
                disabled={trackPoints.length < 3}
                className={`h-6 text-[10px] px-2 ${isLooped 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "bg-gray-600 hover:bg-gray-700"}`}
              >
                {isLooped ? "Loop ON" : "Loop OFF"}
              </Button>
              
              <Button
                size="sm"
                onClick={() => setHasChainLift(!hasChainLift)}
                className={`h-6 text-[10px] px-2 ${hasChainLift 
                  ? "bg-yellow-600 hover:bg-yellow-700" 
                  : "bg-gray-600 hover:bg-gray-700"}`}
              >
                {hasChainLift ? "Chain ON" : "Chain OFF"}
              </Button>
              
              <Button
                size="sm"
                onClick={startRide}
                disabled={!canRide}
                className="h-6 text-[10px] px-2 bg-green-600 hover:bg-green-700"
              >
                Ride
              </Button>
              
              <Button
                size="sm"
                onClick={clearTrack}
                variant="destructive"
                disabled={trackPoints.length === 0}
                className="h-6 text-[10px] px-2"
              >
                Clear
              </Button>
              
              {selectedPointId && (
                <Button
                  size="sm"
                  onClick={() => removeTrackPoint(selectedPointId)}
                  variant="outline"
                  className="h-6 text-[10px] px-2 border-red-500 text-red-500 hover:bg-red-500/20"
                >
                  Delete Pt
                </Button>
              )}
            </div>
            
            <div className="mt-2">
              <label className="text-[10px] text-gray-400 block">
                Speed: {rideSpeed.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.25"
                value={rideSpeed}
                onChange={(e) => setRideSpeed(parseFloat(e.target.value))}
                className="w-full h-2"
              />
            </div>
          </>
        )}
        
        {mode === "ride" && (
          <>
            <div className="mb-2">
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-100"
                  style={{ width: `${rideProgress * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {Math.round(rideProgress * 100)}%
              </p>
            </div>
            
            <Button
              size="sm"
              onClick={stopRide}
              variant="outline"
              className="h-6 text-[10px] px-2 border-white text-white hover:bg-white/20 w-full"
            >
              Exit
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
