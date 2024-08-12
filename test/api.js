const API_HOST = "http://localhost:8000"

/**
 * See api.cspapers.org/types/types.go
 * @typedef {{
 *   query:     string,
 *   orderBy:   string,
 *   ascending: bool,
 *   yearFrom:  number,
 *   yearTo:    number,
 *   skip:      number,
 * }} SearchRequest
 * 
 * @typedef {{
 *   total: number,
 *   skip:  number,
 *   duration:  number, // msec, spent on searching
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
const search = async (req) => {
  const calledAt = Date.now()
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

/**
 * Convert SearchRequest to a query string
 * @param {SearchRequest} req 
 * @returns {string} QueryString
 */
const marshal = (req) => {
  const q = new URLSearchParams(req)
  return `/?${q.toString()}`
}

module.exports = {
  search
};
