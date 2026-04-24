"use client";

import { useEffect } from "react";
import { trackEvent } from "@/components/MetaPixel";

type Props = {
  name: string;
  id?: string;
  category?: string;
};

export default function TrackViewContent({ name, id, category }: Props) {
  useEffect(() => {
    trackEvent({
      name: "ViewContent",
      contentName: name,
      contentIds: id ? [id] : undefined,
      contentCategory: category,
    });
  }, [name, id, category]);
  return null;
}
