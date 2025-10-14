import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Canvas as FabricCanvas, Line, Circle, Rect } from "fabric";
import { Minus, TrendingUp, Circle as CircleIcon, Square, Type, Eraser, Trash2 } from "lucide-react";

interface ChartDrawingToolsProps {
  width: number;
  height: number;
  onDrawingChange?: (hasDrawings: boolean) => void;
}

export type DrawingTool = "select" | "line" | "trendline" | "horizontal" | "circle" | "rectangle" | "text" | "fibonacci";

export const ChartDrawingTools: React.FC<ChartDrawingToolsProps> = ({ width, height, onDrawingChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<DrawingTool>("select");
  const [drawingColor, setDrawingColor] = useState("#3b82f6");
  const isDrawingRef = useRef(false);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "transparent",
      selection: activeTool === "select",
    });

    fabricCanvasRef.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, [width, height]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.selection = activeTool === "select";
    canvas.isDrawingMode = false;

    if (activeTool === "select") {
      canvas.defaultCursor = "default";
      return;
    }

    canvas.defaultCursor = "crosshair";

    const handleMouseDown = (e: any) => {
      if (activeTool === "select" as DrawingTool) return;
      
      const pointer = canvas.getPointer(e.e);
      startPointRef.current = { x: pointer.x, y: pointer.y };
      isDrawingRef.current = true;
    };

    const handleMouseMove = (e: any) => {
      if (!isDrawingRef.current || !startPointRef.current) return;

      const pointer = canvas.getPointer(e.e);
      
      // Remove temporary drawing object
      const objects = canvas.getObjects();
      if (objects.length > 0) {
        const lastObj = objects[objects.length - 1] as any;
        if (lastObj.data?.temporary) {
          canvas.remove(objects[objects.length - 1]);
        }
      }

      let tempObject: any = null;

      switch (activeTool) {
        case "line":
        case "trendline":
        case "horizontal":
          tempObject = new Line(
            [startPointRef.current.x, startPointRef.current.y, pointer.x, activeTool === "horizontal" ? startPointRef.current.y : pointer.y],
            {
              stroke: drawingColor,
              strokeWidth: 2,
              selectable: false,
              data: { temporary: true }
            }
          );
          break;
        case "circle":
          const radius = Math.sqrt(
            Math.pow(pointer.x - startPointRef.current.x, 2) + Math.pow(pointer.y - startPointRef.current.y, 2)
          );
          tempObject = new Circle({
            left: startPointRef.current.x,
            top: startPointRef.current.y,
            radius,
            stroke: drawingColor,
            strokeWidth: 2,
            fill: "transparent",
            originX: "center",
            originY: "center",
            selectable: false,
            data: { temporary: true }
          });
          break;
        case "rectangle":
          tempObject = new Rect({
            left: Math.min(startPointRef.current.x, pointer.x),
            top: Math.min(startPointRef.current.y, pointer.y),
            width: Math.abs(pointer.x - startPointRef.current.x),
            height: Math.abs(pointer.y - startPointRef.current.y),
            stroke: drawingColor,
            strokeWidth: 2,
            fill: "transparent",
            selectable: false,
            data: { temporary: true }
          });
          break;
        case "fibonacci":
          // Draw fibonacci retracement levels
          const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
          const yDiff = pointer.y - startPointRef.current.y;
          
          levels.forEach(level => {
            const y = startPointRef.current!.y + (yDiff * level);
            const line = new Line([0, y, width, y], {
              stroke: drawingColor,
              strokeWidth: 1,
              strokeDashArray: [5, 5],
              selectable: false,
              data: { temporary: true, fibLevel: level }
            });
            canvas.add(line);
          });
          break;
      }

      if (tempObject) {
        canvas.add(tempObject);
        canvas.renderAll();
      }
    };

    const handleMouseUp = (e: any) => {
      if (!isDrawingRef.current || !startPointRef.current) return;

      const pointer = canvas.getPointer(e.e);
      
      // Remove temporary objects
      const objects = canvas.getObjects();
      objects.forEach(obj => {
        const objWithData = obj as any;
        if (objWithData.data?.temporary) {
          canvas.remove(obj);
        }
      });

      let finalObject: any = null;

      switch (activeTool) {
        case "line":
        case "trendline":
        case "horizontal":
          finalObject = new Line(
            [startPointRef.current.x, startPointRef.current.y, pointer.x, activeTool === "horizontal" ? startPointRef.current.y : pointer.y],
            {
              stroke: drawingColor,
              strokeWidth: 2,
              selectable: true
            }
          );
          break;
        case "circle":
          const radius = Math.sqrt(
            Math.pow(pointer.x - startPointRef.current.x, 2) + Math.pow(pointer.y - startPointRef.current.y, 2)
          );
          finalObject = new Circle({
            left: startPointRef.current.x,
            top: startPointRef.current.y,
            radius,
            stroke: drawingColor,
            strokeWidth: 2,
            fill: "transparent",
            originX: "center",
            originY: "center",
            selectable: true
          });
          break;
        case "rectangle":
          finalObject = new Rect({
            left: Math.min(startPointRef.current.x, pointer.x),
            top: Math.min(startPointRef.current.y, pointer.y),
            width: Math.abs(pointer.x - startPointRef.current.x),
            height: Math.abs(pointer.y - startPointRef.current.y),
            stroke: drawingColor,
            strokeWidth: 2,
            fill: "transparent",
            selectable: true
          });
          break;
        case "fibonacci":
          const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
          const yDiff = pointer.y - startPointRef.current.y;
          
          levels.forEach(level => {
            const y = startPointRef.current!.y + (yDiff * level);
            const line = new Line([0, y, width, y], {
              stroke: drawingColor,
              strokeWidth: 1,
              strokeDashArray: [5, 5],
              selectable: true,
              data: { fibLevel: level }
            });
            canvas.add(line);
          });
          break;
      }

      if (finalObject) {
        canvas.add(finalObject);
      }

      canvas.renderAll();
      onDrawingChange?.(canvas.getObjects().length > 0);

      isDrawingRef.current = false;
      startPointRef.current = null;
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [activeTool, drawingColor, width, onDrawingChange]);

  const clearDrawings = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.clear();
    canvas.renderAll();
    onDrawingChange?.(false);
  };

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach(obj => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
    onDrawingChange?.(canvas.getObjects().length > 0);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Drawing toolbar */}
      <div className="absolute top-3 right-3 pointer-events-auto bg-background/90 backdrop-blur rounded-lg border border-border p-2 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Button
            variant={activeTool === "select" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTool("select")}
            className="w-full justify-start"
          >
            Select
          </Button>
          <Button
            variant={activeTool === "trendline" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTool("trendline")}
            className="w-full justify-start"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Trend Line
          </Button>
          <Button
            variant={activeTool === "horizontal" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTool("horizontal")}
            className="w-full justify-start"
          >
            <Minus className="w-4 h-4 mr-2" />
            Horizontal
          </Button>
          <Button
            variant={activeTool === "fibonacci" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTool("fibonacci")}
            className="w-full justify-start text-xs"
          >
            Fibonacci
          </Button>
          <Button
            variant={activeTool === "circle" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTool("circle")}
            className="w-full justify-start"
          >
            <CircleIcon className="w-4 h-4 mr-2" />
            Circle
          </Button>
          <Button
            variant={activeTool === "rectangle" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTool("rectangle")}
            className="w-full justify-start"
          >
            <Square className="w-4 h-4 mr-2" />
            Rectangle
          </Button>
        </div>
        
        <div className="border-t border-border pt-2 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs">Color:</span>
            <input
              type="color"
              value={drawingColor}
              onChange={(e) => setDrawingColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={deleteSelected}
            className="w-full justify-start"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearDrawings}
            className="w-full justify-start"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};
