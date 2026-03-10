export type Translation = 
| "kjv"
| "web"
| "asv"
| "bbe";

export const translations: { value: Translation; label: string }[] =[
    { value: "kjv", label: "King James Version (KJV)" },
  { value: "web", label: "World English Bible (WEB)" },
  { value: "asv", label: "American Standard Version (ASV)" },
  { value: "bbe", label: "Bible in Basic English (BBE)" } 
]