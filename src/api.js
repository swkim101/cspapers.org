import { ABSTRACT_URL, API_HOST } from "./const";

/**
 * See api.cspapers.org/types/types.go
 * @typedef {{
 *   query:     string,
 *   orderBy:   string,
 *   ascending: bool,
 *   yearFrom:  number,
 *   yearTo:    number,
 *   skip:      number,
 *   take:      number,
 * }} SearchRequest
 * 
 * @typedef {{
 *   total: number,
 *   skip:  number,
 *   duration:  number, // msec, spent on searching
 *   take:  number,
 *   data:  [SearchResponseUnit],
 * }} SearchResponse
 * 
 * @typedef {{
 *   title: string,
 *   year:  number,
 *   venue: string,
 *   index: string,
 *   score: number,
 * }} SearchResponseUnit
 * 
 */


/**
 * 
 * @param {SearchRequest} req 
 * @returns {[SearchResponse, Error | null ]}
 */
let lastlyCalledAt = 0;
/*
App() can invoke multiple fetch() in parallel, however,
is interestd the latest search() result. 
So, search() shares and update the timestamp of latest call.
Using this, search() returns only if the latest call timestamp
matches with the current context's call timestamp.
*/
const search = async (req) => {
  const calledAt = Date.now()
  try {
    lastlyCalledAt = calledAt
    const res = await fetch(API_HOST + marshal(req))
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }
    const json = await res.json();
    if (json === null) {
      throw new Error(`response data is null`);
    }

    /* mimicking atomic compare-and-swap */
    const lastlyCalledAtAfterFetch = lastlyCalledAt
    lastlyCalledAt = calledAt === lastlyCalledAt ? 0 : lastlyCalledAt
    /* mimicking atomic compare-and-swap */

    if (lastlyCalledAtAfterFetch === calledAt) {
      // we are the latest call
      return [json, false]
    } else {
      return [{}, new Error(`Later call exists`)]
    }
  } catch (error) {
    console.error(error)
    /* mimicking atomic compare-and-swap */
    lastlyCalledAt = calledAt === lastlyCalledAt ? 0 : lastlyCalledAt
    /* mimicking atomic compare-and-swap */
    return [{}, error]
  }
}

/**
 * Convert SearchRequest to a query string
 * @param {SearchRequest} req 
 * @returns {string} QueryString
 */
const marshal = (req) => {
  const q = new URLSearchParams(req)
  return `/?${q.toString()}`
}

/**
 * 
 * @param {number} year
 * @param {string} venue 
 * @param {string} title 
 * @returns {[string, Error | null ]} abstract
 */
const getAbstract = async (year, venue, title) => {
  try {
    const res = await fetch(`${ABSTRACT_URL}/${year}/${venue.toLowerCase()}/${title}`)
    if (res.status === 404) {
      return ["", null]
    } else if (!res.ok) {
      return ["", new Error(`${res.status} ${res.statusText}`)]
    }
    const text = await res.text()
    return [text, null]
  } catch (err) {
    return ["", err]
  }
}

export {
  getAbstract, search
};
