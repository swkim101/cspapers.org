import { default as dblp1 } from "./dblp.1"; 
import { default as dblp2 } from "./dblp.2"; 
import { default as dblp3 } from "./dblp.3";
import pl from "./pl"

const venues = [
  ...dblp1,
  ...dblp2,
  ...dblp3,
  ...pl,
]

export default venues