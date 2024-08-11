const venues: Venue[] = ["pldi", "popl", "ooplsa"].map(name => ({
  name,
  crawler: "dblp-pacmpl",
  urls: ["https://dblp.org/db/journals/pacmpl/pacmpl8.html"],
  year: 2024,
}))

export default venues