"use client";

import { useState } from "react";
import type { Translation } from "../../../../data/translations";

export type FetchedVerse = {
  reference: string;
  text: string;
};

export function useVerse() {
  const [verse, setVerse] = useState<FetchedVerse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVerse = async (reference: string, translation: Translation) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/verse?reference=${reference}&translation=${translation}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed");
      }

      setVerse({
        reference: data.reference,
        text: data.text
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { verse, loading, error, fetchVerse };
}