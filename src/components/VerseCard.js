"use client"

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { verses } from "../data/verses";

export default function VerseCard({ id }) {
    const verse = verses.find((v) => v.id === id);

    if (!verse) return null;

    const {
        attributes, 
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className="bg-white p-3 rounded-lg shadow cursor-grab active:cursor-grabbing"
        >
          <p className="font-semibold text-sm text-stone-600">{verse.reference}</p>
          <p className="text-xs text-stone-800">{verse.text}</p> 
        </div>
    )
}