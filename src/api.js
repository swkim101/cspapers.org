import { SCORE } from './const'

const API_HOST = /development/i.test(process.env.NODE_ENV) ? 'http://localhost:8000' : 'https://cspaper-org.fly.dev'


/* see api.cspapers.org/types/types.go */
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
  orderBy: SCORE,
  ascending: false,
  venue: [],
  yearFrom: 2014,
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

export {
  search
}