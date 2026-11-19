export const beninFilm = {
  title: "Le Bénin, intensément",
  subtitle: "Un carnet visuel signé AYIFFA",
  duration: 22,
  ambient: "/videos/benin-carnet-ambient.mp4",
  hd: "/videos/benin-carnet-hd.mp4",
  poster: "/images/benin-film-poster.jpg",
  captions: "/videos/benin-carnet-fr.vtt",
  description: "Un montage muet de photographies animées de Ganvié et d’une séquence aérienne réelle de Ouidah. Des paysages d’eau, une ville en mouvement, une autre idée du Bénin.",
  chapters: [
    { title: "Au fil de l’eau", location: "Ganvié", start: 0, number: "01", image: "/images/ganvie.jpg" },
    { title: "Changer de regard", location: "Ouidah", start: 6, number: "02", image: "/images/ouidah.jpg" },
    { title: "Revenir à l’essentiel", location: "Lac Nokoué", start: 15, number: "03", image: "/images/pirogue.jpg" },
  ],
  sources: [
    { author: "Kenza Loussouarn", type: "Photographie de Ganvié", url: "https://www.pexels.com/photo/6729748/" },
    { author: "mataki klimtetou", type: "Séquence aérienne de la cité historique de Ouidah", url: "https://www.pexels.com/video/17511220/" },
    { author: "Kenza Loussouarn", type: "Photographie du lac Nokoué", url: "https://www.pexels.com/photo/6729842/" },
  ],
};

export function formatFilmTime(seconds: number) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(value / 60).toString().padStart(2, "0")}:${(value % 60).toString().padStart(2, "0")}`;
}
