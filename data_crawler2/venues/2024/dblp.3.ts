import { seq } from "../../functional";

const prefix = 'https://dblp.org/db/conf'
const names: [string, (_: number) => string[]][] = [
  [
    "asplos",
    (year: number) => seq(1, 5).map(vol => `${prefix}/asplos/asplos${year}-${vol}.html`)
  ],
  [
    "eurocrypt",
    (year: number) => seq(1, 8).map(vol => `${prefix}/eurocrypt/eurocrypt${year}-${vol}.html`)
  ],
  [
    "crypto",
    (year: number) => seq(1, 6).map(vol => `${prefix}/crypto/crypto${year}-${vol}.html`)
  ],  
]

const venues: Venue[] = names.map(([name, fn]) => ({
  name,
  year: 2024,
  crawler: "dblp-common",
  urls: fn(2024),
}))

export default venues