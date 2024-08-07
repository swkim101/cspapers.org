/* see api.cspapers.org/types/types.go */

import { ABSTRACT_URL, API_HOST } from "./const";

/*
type SearchRequest struct {
	Query     string  `json:"query"`
	OrderBy   float32 `json:"orderBy"`
	Ascending bool    `json:"ascending"`
	YearFrom  uint32  `json:"yearFrom"`
	YearTo    uint32  `json:"yearTo"`
	Skip      uint32  `json:"skip"`
	Take      uint32  `json:"take"`
}
*/
const defaultRequest = {
  query: '',
  orderBy: global.SCORE,
  ascending: false,
  venue: [],
  yearFrom: 2018,
  yearTo: 2024,
  skip: 0,
  take: 20,
}
/*
type SearchResponse struct {
	Total int                   `json:"total"`
	Skip  uint32                `json:"skip"`
	Take  uint32                `json:"take"`
	Data  []*SearchResponseUnit `json:"data"`
}

type SearchResponseUnit struct {
	Paper
	Index string  `json:"index"`
	Score float64 `json:"score"`
}
*/
const search = async (req) => {
  try {
    const res = await fetch(API_HOST + marshal(req))
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }
    const json = await res.json();
    if (json === null) {
      throw new Error(`response data is null`);
    }
    return [json, false]
  } catch (error) {
    console.error(error)
    return [{}, error]
  }
}

// marshal :: SearchRequest -> QueryString
const marshal = (req = defaultRequest) => {
  const q = new URLSearchParams(req)
  return `/?${q.toString()}`
}

// getAbstract :: Int -> String -> String -> (String, Error)
const getAbstract = async (year = 0, venue = "", title = "") => {
  try {
    const res = await fetch(`${ABSTRACT_URL}/${year}/${venue.toLowerCase()}/${title}`)
    const text = await res.text()
    return [text, null]
  } catch(err) {
    return ["", err]
  }
}

export {
  search,
  getAbstract,
}