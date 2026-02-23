"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { verses } from "../data/verses";
import CategoryBoard from "../components/CategoryBoard";

type Boards = {
  [key: string]: string[];
};

export default function Home() {
  const [boards, setBoards] = useState<Boards>({
    available: verses.map((v) => v.id),
    peace: [],
    hope: [],
    strength: []
  });

  const findBoard = (id: string): string | undefined => {
    return Object.keys(boards).find((key) =>
      boards[key].includes(id)
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceBoard = findBoard(activeId);
    const targetBoard = findBoard(overId) || overId;

    if (!sourceBoard || !targetBoard) return;

    if (sourceBoard === targetBoard) {
      const oldIndex = boards[sourceBoard].indexOf(activeId);
      const newIndex = boards[sourceBoard].indexOf(overId);

      setBoards(prev => ({
        ...prev,
        [sourceBoard]: arrayMove(
          boards[sourceBoard],
          oldIndex,
          newIndex
        )
      }));
    } else {
      setBoards(prev => ({
        ...prev,
        [sourceBoard]: boards[sourceBoard].filter(id => id !== activeId),
        [targetBoard]: [...boards[targetBoard], activeId]
      }));
    }
  };

  useEffect(() => {
  const saved = localStorage.getItem("verseBoards");
  if (saved) {
    setBoards(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  localStorage.setItem("verseBoards", JSON.stringify(boards));
}, [boards]);


  return (
     <DndContext 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
      <div className="p-8 flex gap-6 overflow-x-auto">
     
        <CategoryBoard id="available" title="Available Verses" items={boards.available} />
        <CategoryBoard id="peace" title="Peace & Trust" items={boards.peace} />
        <CategoryBoard id="hope" title="Hope & Encouragement" items={boards.hope} />
        <CategoryBoard id="strength" title="Strength & Courage" items={boards.strength} />
      
      </div>
    </DndContext>
  );
}
