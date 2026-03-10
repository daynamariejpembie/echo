"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import CategoryBoard from "../components/CategoryBoard";
import { useVerse } from "./api/verse/hooks/useVerse";
import { translations } from "../data/translations";
import VerseCard from "../components/VerseCard";
import type { FetchedVerse } from "./api/verse/hooks/useVerse";

 type BoardId =
      |  "available"
      |  "peace"
      |  "hope"
      |  "strength";

  type Boards = Record<BoardId, string[]>;

  const boardTitles: Record<BoardId, string> = {
    available: "Available Verses",
    peace: "Peace & Trust",
    hope: "Hope & Encouragement",
    strength: "Strength & Courage"
  };
export default function Home() {
  const { verse, loading, error, fetchVerse } = useVerse();
  const [input, setInput] = useState("");

  const [translation, setTranslation] = useState("kjv");

  const [verseMap, setVerseMap] = useState<Record<string, FetchedVerse>>({});

   const [boards, setBoards] = useState<Boards>({
        available:[],
        peace: [],
        hope: [],
        strength: [] 
    });

  useEffect(() => {
    if (!verse) return; 

    const verseId = 
    verse.reference
    .replace(/\s+/g, "")
    .replace(":", "")
    .toLowerCase() + 
    "-" + 
    translation;

    if (verseMap[verseId]) return;

    setVerseMap(prev => ({
      ...prev,
      [verseId]: verse
    }));

    setBoards(prev => {
      if (prev.available.includes(verseId)) return prev;
      
      return{
        ...prev,
        available: [...prev.available, verseId]
      };
    });

  }, [verse, translation, verseMap]);
  

  const findBoard = (id: string): BoardId | undefined => {
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
      setBoards(prev => {

      if (sourceBoard === "available") {
        if (prev[targetBoard].includes(activeId)) return prev;

        return {
          ...prev,
          [targetBoard]: [...prev[targetBoard], activeId]
        };
      }

        return{
        ...prev,
        [sourceBoard]: boards[sourceBoard].filter(id => id !== activeId),
        [targetBoard]: [...boards[targetBoard], activeId]
      };
      });
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
      <div className="flex">
        <select
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          className="border p-2 rounded mr-2 text-gray-500"
        >
          {translations.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>  
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter verse (e.g. John 3:16)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={() => {fetchVerse(input, translation);
              fetchVerse(input, translation);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:cursor-pointer"
          >
            Fetch Verse
          </button>
        </div> 
      </div>
      
      <div className="p-8 flex gap-6 overflow-x-auto">
     
      {(Object.keys(boards) as BoardId[]).map((boardId) => (
        <CategoryBoard
          key={boardId}
          id={boardId}
          title={boardTitles[boardId]}
          items={boards[boardId]}
          verseMap={verseMap}
        />
      ))}
      
      </div>
    </DndContext>
  )};
