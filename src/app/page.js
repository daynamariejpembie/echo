"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { verses } from "../data/verses";
import CategoryBoard from "@/components/CategoryBoard";

export default function Home() {
  const [boards, setBoards] = useState({
    available: verses.map((v) => v.id),
    peace: [],
    hope: [],
    strength: []
  });

  const findBoard = (id) => {
    return Object.keys(boards).find((key) =>
      boards[key].includes(id)
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const sourceBoard = findBoard(activeId);
    const targetBoard = findBoard(overId) || overId;

    if (!sourceBoard || !targetBoard) return;

    if (sourceBoard === targetBoard) {
      const oldIndex = boards[sourceBoard].indexOf(activeId);
      const newIndex = boards[sourceBoard].indexOf(overId);

      setBoards({
        ...boards,
        [sourceBoard]: arrayMove(
          boards[sourceBoard],
          oldIndex,
          newIndex
        )
      });
    } else {
      const sourceItems = boards[sourceBoard].filter(
        (id) => id !== activeId
      );

      const targetItems = [...boards[targetBoard], activeId];

      setBoards({
        ...boards,
        [sourceBoard]: sourceItems,
        [targetBoard]: targetItems
      });
    }
  };

  return (
    <div className="p-8 flex gap-6 overflow-x-auto">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <CategoryBoard id="available" title="Available Verses" items={boards.available} />
        <CategoryBoard id="peace" title="Peace & Trust" items={boards.peace} />
        <CategoryBoard id="hope" title="Hope & Encouragement" items={boards.hope} />
        <CategoryBoard id="strength" title="Strength & Courage" items={boards.strength} />
      </DndContext>
    </div>
  );
}
