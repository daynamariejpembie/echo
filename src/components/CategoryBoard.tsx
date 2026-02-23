"use client"

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import VerseCard from "./VerseCard";

export default function CategoryBoard({id, title, items}) {
    const { setNodeRef } = useDroppable({id});

    return (
        <div className="w-72 bg-gray-100 rounded-xl p-4 shadow">
            <h2 className="text-stone-900 font-bold mb-4">{title}</h2>

            <div ref={setNodeRef} className="min-h-37.5 space-y-3">
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((itemId) => (
                  <VerseCard key={itemId} id={itemId} />
                ))}

              </SortableContext>
            </div>
        </div>
    );
}