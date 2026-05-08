export type Project = {
  slug: string;
  title: string;
  client: string;
  year: number;
  roles: string[];
  videoProvider: "vimeo" | "youtube" | "none";
  videoId: string;
  videoHash?: string;
  videoUrl: string;
  description?: string;
  thumbnail?: string;
  stills?: string[];
  category: "commercial" | "music-video" | "dance" | "personal" | "narrative";
  featured: boolean;
  isUnreleased: boolean;
  hoverVideoUrl?: string;
  indexHoverVideo?: string;
  /** width / height ratio of the thumbnail, e.g. 16/9 ≈ 1.778, 4/3 ≈ 1.333, 9/16 ≈ 0.5625 */
  thumbnailAspect?: number;
  /** CSS object-position for the thumbnail when constrained (default "center"). E.g. "top", "top center" */
  thumbnailObjectPosition?: string;
  /**
   * True for work where Andrew was a collaborator (colorist, editor, etc.) but not the director.
   * Credits appear in the index only — clicking opens videoUrl in a new tab, no project page needed.
   */
  isCredit?: boolean;
};

const CATEGORY_LABELS: Record<string, string> = {
  "music-video": "Music Video",
  "commercial": "Commercial",
  "dance": "Dance Film",
  "personal": "Personal",
  "narrative": "Narrative",
};

export function getDisplayTitle(project: Project): string {
  if (!project.isUnreleased) return project.title;
  return CATEGORY_LABELS[project.category] ?? project.title;
}

export const projects: Project[] = [
  {
    slug: "the-remodeling-arena",
    title: "The Remodeling Arena",
    client: "Handoff",
    year: 2025,
    roles: ["Director", "Editor", "Colorist"],
    videoProvider: "vimeo",
    videoId: "1116961193",
    videoUrl: "https://vimeo.com/1116961193",
    thumbnail: "/projects/the-remodeling-arena/thumbnail.jpg",
    indexHoverVideo: "/projects/the-remodeling-arena/hover.mp4",
    category: "commercial",
    featured: false,
    isUnreleased: false,
  },
  {
    slug: "as-rehearsed-dance-film",
    title: "As Rehearsed Dance Film",
    client: "Personal",
    year: 2026,
    roles: ["Director", "DP", "Editor", "Colorist", "VFX"],
    videoProvider: "vimeo",
    videoId: "1183179985",
    videoUrl: "https://vimeo.com/1183179985",
    thumbnail: "/projects/as-rehearsed-dance-film/thumbnail.jpg",
    indexHoverVideo: "/projects/as-rehearsed-dance-film/hover.mp4",
    thumbnailObjectPosition: "top",
    category: "dance",
    featured: true,
    isUnreleased: false,
  },
  {
    slug: "jojos-groove-theory-mv",
    title: "Jojo's Groove Theory MV",
    client: "Jourden Cox",
    year: 2025,
    roles: ["Director", "DP", "Editor", "Colorist"],
    videoProvider: "vimeo",
    videoId: "1189886613",
    videoHash: "8358a83ffb",
    videoUrl: "https://vimeo.com/1189886613/8358a83ffb",
    thumbnail: "/projects/jojos-groove-theory-mv/thumbnail.jpg",
    indexHoverVideo: "/projects/jojos-groove-theory-mv/hover.mp4",
    category: "music-video",
    featured: false,
    isUnreleased: false,
  },
  {
    slug: "sidekick-campaign-film",
    title: "Sidekick Campaign Film",
    client: "Karepango",
    year: 2025,
    roles: ["Director", "Editor", "Colorist", "Sound"],
    videoProvider: "vimeo",
    videoId: "1176403552",
    videoUrl: "https://vimeo.com/1176403552",
    thumbnail: "/projects/sidekick-campaign-film/thumbnail.jpg",
    indexHoverVideo: "/projects/sidekick-campaign-film/hover.mp4",
    category: "commercial",
    featured: true,
    isUnreleased: false,
  },
  {
    slug: "stockline-yc-launch-film",
    title: "YC Launch Film",
    client: "Stockline Inc",
    year: 2025,
    roles: ["Director", "Colorist"],
    videoProvider: "vimeo",
    videoId: "1176398434",
    videoUrl: "https://vimeo.com/1176398434",
    thumbnail: "/projects/stockline-yc-launch-film/thumbnail.jpg",
    indexHoverVideo: "/projects/stockline-yc-launch-film/hover.mp4",
    category: "commercial",
    featured: false,
    isUnreleased: false,
  },
  {
    slug: "got-me-going-dance-film",
    title: "Got Me Going Dance Film",
    client: "Edson Maldonado",
    year: 2025,
    roles: ["Director", "Editor", "Colorist"],
    videoProvider: "vimeo",
    videoId: "1094097331",
    videoUrl: "https://vimeo.com/1094097331",
    thumbnail: "/projects/got-me-going-dance-film/thumbnail.jpg",
    indexHoverVideo: "/projects/got-me-going-dance-film/hover.mp4",
    category: "dance",
    featured: false,
    isUnreleased: false,
  },
  {
    slug: "zenobia-pay-yc-launch-film",
    title: "YC Launch Film",
    client: "Zenobia Pay",
    year: 2025,
    roles: ["Director", "DP", "Editor", "Colorist", "Sound"],
    videoProvider: "vimeo",
    videoId: "1086603035",
    videoUrl: "https://vimeo.com/1086603035",
    thumbnail: "/projects/zenobia-pay-yc-launch-film/thumbnail.jpg",
    indexHoverVideo: "/projects/zenobia-pay-yc-launch-film/hover.mp4",
    category: "commercial",
    featured: false,
    isUnreleased: false,
  },
  {
    slug: "jasmine-ma",
    title: "Jasmine Ma",
    client: "Personal",
    year: 2025,
    roles: ["Director", "DP", "Editor", "Colorist", "Sound"],
    videoProvider: "vimeo",
    videoId: "1069771927",
    videoUrl: "https://vimeo.com/1069771927",
    thumbnail: "/projects/jasmine-ma/thumbnail.jpg",
    indexHoverVideo: "/projects/jasmine-ma/hover.mp4",
    category: "personal",
    featured: true,
    isUnreleased: false,
  },
  {
    slug: "king-kong-mv",
    title: "King Kong MV",
    client: "Unreleased",
    year: 2026,
    roles: ["Director", "Editor", "Colorist"],
    videoProvider: "none",
    videoId: "",
    videoUrl: "",
    thumbnail: "/projects/king-kong-mv/thumbnail.jpg",
    indexHoverVideo: "/projects/king-kong-mv/hover.mp4",
    category: "music-video",
    featured: false,
    isUnreleased: true,
  },
  {
    slug: "cross-colors-mv",
    title: "Cross Colors MV",
    client: "Unreleased",
    year: 2026,
    roles: ["Director", "Editor", "Colorist"],
    videoProvider: "none",
    videoId: "",
    videoUrl: "",
    thumbnail: "/projects/cross-colors-mv/thumbnail.jpg",
    indexHoverVideo: "/projects/cross-colors-mv/hover.mp4",
    category: "music-video",
    featured: false,
    isUnreleased: true,
  },
  // ── Credits (index only — links out to external video) ──────────────────────
  // {
  //   slug: "example-color-credit",
  //   title: "Example Project Title",
  //   client: "Client Name",
  //   year: 2025,
  //   roles: ["Colorist"],           // just the role(s) you performed
  //   videoProvider: "vimeo",
  //   videoId: "000000000",
  //   videoUrl: "https://vimeo.com/000000000",
  //   category: "commercial",
  //   featured: false,
  //   isUnreleased: false,
  //   isCredit: true,                // ← this is all that's needed
  // },

  {
    slug: "got-all-that",
    title: "Got All That?",
    client: "Unreleased",
    year: 2026,
    roles: ["Director", "Editor", "Colorist"],
    videoProvider: "none",
    videoId: "",
    videoUrl: "",
    thumbnail: "/projects/got-all-that/thumbnail_1.1.1.jpg",
    indexHoverVideo: "/projects/got-all-that/hover.mp4",
    category: "commercial",
    featured: false,
    isUnreleased: true,
  },
];
