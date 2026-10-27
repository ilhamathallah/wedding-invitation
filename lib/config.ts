// Edit this file only. Everything on the page reads from here.
export const wedding = {
  music: { src: "/music/weddmusic.mp3" },
  couple: { a: "Women", b: "Man" },
  date: "2026-10-27T07:00:00+07:00", // ISO with timezone
  displayDate: "Date of wedding",
  tagline: "We are getting married",
  events: [
    {
      id: "ceremony", title: "Ceremony", time: "Times", start: "2027-03-20T16:00:00+07:00", end: "2027-03-20T17:00:00+07:00",
      venue: "Place of ceremony", address: "address",
    },
    {
      id: "reception", title: "Reception", time: "Time", start: "2027-03-20T18:00:00+07:00", end: "2027-03-20T21:00:00+07:00",
      venue: "Place of reception", address: "address",
    },
  ],
  mapQuery: "The Glasshouse, Jakarta Selatan",
  dressCode: "Soft neutrals, sage and stone",
  rsvpDeadline: "1 March 2027",

  // Photos: drop files into /public/photos and set src to "/photos/xxx.jpg".
  // Leave src empty to show an elegant placeholder.
  people: {
    bride: {
      role: "The Bride", name: "Women", parents: "the bride's parents",
      bio: "An architect who collects ceramics, keeps too many plants, and laughs before the punchline.",
      photo: "/images/wedding/bride-portrait.png", instagram: "",
    },
    groom: {
      role: "The Groom", name: "Man", parents: "the groom's parents",
      bio: "A photographer who loves early mornings, slow coffee, and finding the good light for everyone else.",
      photo: "/images/wedding/groom-portrait.png", instagram: "",
    },
  },

  story: [
    { year: "2019", title: "A coffee that lasted all evening", text: "They met at a friend’s small gathering and meant to stay for one cup. Hours later, the café was closing and neither had noticed.", photo: "" },
    { year: "2021", title: "Distance, and every call in between", text: "Different cities, same time zone of the heart. Late-night calls turned into a ritual, and the ritual turned into certainty.", photo: "" },
    { year: "2025", title: "A quiet question", text: "On the rooftop where they once talked until sunrise, he asked. She said yes before he could finish the sentence.", photo: "" },
    { year: "2027", title: "Forever, officially", text: "Surrounded by the people who shaped them, they begin the next chapter, together.", photo: "" },
  ],

  // ratio = CSS aspect-ratio of the photo, so the masonry grid keeps its rhythm.
  gallery: [
    { src: "/images/wedding/candid-07.png", alt: "Laughing on a morning walk", ratio: "3/4" },
    { src: "/images/wedding/candid-02.png", alt: "Hands held at the café window", ratio: "1/1" },
    { src: "/images/wedding/candid-03.png", alt: "A shared umbrella in the rain", ratio: "4/5" },
    { src: "/images/wedding/candid-01.png", alt: "Dancing in the kitchen", ratio: "4/5" },
    { src: "/images/wedding/candid-05.png", alt: "Sunset on the rooftop", ratio: "4/3" },
    { src: "/images/wedding/candid-09.png", alt: "Whispering during the engagement", ratio: "3/4" },
    { src: "/images/wedding/candid-04.png", alt: "Walking hand in hand", ratio: "1/1" },
    { src: "/images/wedding/candid-08.png", alt: "Candid laugh with family", ratio: "3/4" },
    { src: "/images/wedding/candid-06.png", alt: "A quiet look between them", ratio: "4/5" },
  ],
};
