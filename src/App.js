import * as api from './api';
import { conferences } from './conferences';

import { useEffect, useState } from 'react';
import Paper from './components/Paper';
import ConferenceTree from './components/ConferenceTree';
import { seq, doubleQuotes } from './functional';
import { ASCE, CURRENT_YEAR, DATE, MIN_YEAR, SCORE, LAST_UPDATE } from './const';

function App() {
  /**
   * @type {[[api.SearchResponseUnit], React.Dispatch<React.SetStateAction<[api.SearchResponseUnit]>>]}
   */
  const [data, setData] = useState([])
  const [skip, setSkip] = useState(0)
  const [total, setTotal] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showFilter, setShowFilter] = useState(true)
  const [yearFrom, setYearFrom] = useState(CURRENT_YEAR - 10)
  const [yearTo, setYearTo] = useState(CURRENT_YEAR)
  const [venue, setVenue] = useState([])
  const [orderBy, setOrderBy] = useState(SCORE)
  const [ascending, setAscending] = useState(false)
  const [query, setQuery] = useState('')
  const [isWaiting, setWaiting] = useState(false)
  const [isTimeoutError, setTimeoutError] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    search()
  }

  const next = () => {
    setSkip(skip + 20)
  }
  const prev = () => {
    setSkip(Math.max(0, skip - 20))
  }

  const search = async () => {
    const must = doubleQuotes(query)
    const req = {
      query,
      yearFrom,
      yearTo,
      venue,
      orderBy,
      ascending,
      skip,
      must,
    }
    setWaiting(true)
    const [res, err] = await api.search(req)

    /* Safe from parallel execution. See comments in api.search() */
    if (err.message === 'timeout') {
      setTimeoutError(true)
    }
    if (!err || query === "") {
      setData(res.data || [])
      setTotal(res.total)
      setDuration(res.duration)
      setWaiting(false)
      window.location.hash = new URLSearchParams(req).toString()
    }
  }

  useEffect(() => {
    const a = new URLSearchParams(window.location.hash.replace("#", ""));
    setVenue(conferences.flatten(conferences.tree))
    for (let [k, v] of a.entries()) {
      switch (k) {
        case 'yearFrom':
          setYearFrom(+v)
          break;
        case 'yearTo':
          setYearTo(+v)
          break;
        case 'query':
          setQuery(v)
          break;
        case 'orderBy':
          setOrderBy(v)
          break;
        case ASCE:
          setAscending(v === 'true')
          break;
        case 'venue':
          if (v !== "") {
            setVenue(v.split(','))
          } else {
            setVenue([])
          }
          break;
        case 'must':
          break;
        case 'skip':
          setSkip(v)
          break
        default:
          console.error("unknwon field ", k)
      }
    }
    if (window.screen.width < 560) {
      setShowFilter(false)
    }
  }, [])


  useEffect(() => {
    if (query === "") {
      setData([])
      setDuration(0)
      setTotal(0)
      return
    }
    search()
  }, [query,
    yearFrom,
    yearTo,
    venue,
    orderBy,
    ascending,
    skip,
  ])

  useEffect(() => {
    setSkip(0)
  }, [query,
    yearFrom,
    yearTo,
    venue,
    orderBy,
    ascending,
  ])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [skip])

  return (
    <div className='p-2'>
      <div className='mb-2'>
        <b>cspapers.org: computer science papers indexed </b>
        <a rel="noreferrer" target="_blank" href="https://github.com/swkim101/cspapers.org">( GitHub )</a>
      </div>
      <div className='flex'>
        <div className={showFilter ? "w--280 w-100-560" : undefined}>
          <form onSubmit={e => submit(e)}>
            <input autoFocus type="search" value={query} onChange={e => setQuery(e.target.value)} className='mr-1 mb-1' placeholder='fuzzing' />
            <input type="submit" value="search" className='mr-2' />
            <span className={isWaiting ? 'none' : 'text-gray-400'}>- {total} results ({duration / 1000} seconds) </span>
            <progress className={isWaiting ? undefined : 'none'}></progress>
            <span className={isTimeoutError ? undefined : 'none'}>- Stuck; Please refresh </span>
          </form>
          <div
            onClick={() => setShowFilter(!showFilter)}
            className={`pointer underline mb-2 ${!showFilter || "none-560"}`}
          >{showFilter ? "Hide" : "Show"} filters</div>
          <div className={`mb-2 ${showFilter || "none"}`}>
            <span>From </span>
            <select value={yearFrom} onChange={e => setYearFrom(e.target.value)}>
              {
                seq(MIN_YEAR, CURRENT_YEAR + 1).reverse().map(e => <option key={e} value={e}>{e}</option>)
              }
            </select>
            <span> to </span>
            <select value={yearTo} onChange={e => setYearTo(e.target.value)}>
              {
                seq(MIN_YEAR, CURRENT_YEAR + 1).reverse().map(e => <option key={e} value={e} onClick={e => setYearTo(e.target.value)}>{e}</option>)
              }
            </select>
            <span> order by [</span>
            <label htmlFor="rel">relevance</label>
            <input checked={orderBy === SCORE} onChange={() => setOrderBy(SCORE)} name="orderBy" type="radio" id="rel" />
            <span>| </span>
            <label htmlFor="date">date</label>
            <input checked={orderBy === DATE} onChange={() => setOrderBy(DATE)} name="orderBy" type="radio" id="date" />
            <span>]</span>
            <span> [</span>
            <label htmlFor="asec">ascending</label>
            <input checked={ascending} onChange={() => setAscending(true)} name="order" type="radio" id="asec" />
            <span>|</span>
            <label htmlFor="desc">descending</label>
            <input checked={!ascending} onChange={() => setAscending(false)} name="order" type="radio" id="desc" />
            <span>]</span>
          </div>
          <div className={showFilter ? 'w-280 none-560' : 'none'}>
            <ConferenceTree value={venue} onChange={e => setVenue(e)} />
          </div>
          <div className={(data.length === 0 && query !== "") ? undefined : "none"}>no result</div>
          {
            data.map((e, idx) =>
              <Paper key={`${e.title}-${e.score}-${idx}`}
                {...e} highlight={doubleQuotes(query)}
              />)
          }
          {
            0 === total ? undefined : <hr />
          }
          <div className={0 === total ? "none" : undefined}>
            page ({skip / 20 + 1} / {Math.ceil(total / 20)}): <span
              className={0 < skip ? "initial mt-2 text-blue underline pointer" : "none"}
              onClick={() => setSkip(0)}
            >first</span> | <span
              className={20 <= skip ? "initial mt-2 text-blue underline pointer" : "none"}
              onClick={() => prev()}
            >prev</span> | <span
              className={skip < total - 20 ? "initial mt-2 text-blue underline pointer" : "none"}
              onClick={() => next()}
            >next</span>
          </div>
          <hr />
          <div className='text-gray-400 text-xs'>{LAST_UPDATE}</div>
        </div>
        <div className={showFilter ? 'w-280 show-560' : 'none'}>
          <ConferenceTree value={venue} onChange={e => setVenue(e)} />
        </div>
      </div>
    </div>
  );
}

export default App;
