export type ShareMetadata = {
  title: string;
  slug: string;
  description: string;
  status: string;
  is_public: boolean;
};

export type ShareLinkMode = "standard" | "conversational";

export type QRSize = "small" | "medium" | "large";
