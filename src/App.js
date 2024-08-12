import * as api from './api';
import { conferences } from './conferences';

import { useEffect, useState } from 'react';
import Paper from './components/Paper';
import ConferenceTree from './components/ConferenceTree';
import { seq } from './functional';
import { ASCE, CURRENT_YEAR, DATE, MIN_YEAR, SCORE } from './const';

function App() {
  /**
   * @type {[[api.SearchResponseUnit], React.Dispatch<React.SetStateAction<[api.SearchResponseUnit]>>]}
   */
  const [data, setData] = useState([])
  const [skip, setSkip] = useState(0)
  const [total, setTotal] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showFilter, setShowFilter] = useState(true)
  const [yearFrom, setYearFrom] = useState(MIN_YEAR)
  const [yearTo, setYearTo] = useState(CURRENT_YEAR + 1)
  const [venue, setVenue] = useState([])
  const [orderBy, setOrderBy] = useState(SCORE)
  const [ascending, setAscending] = useState(false)
  const [query, setQuery] = useState('')

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
    const req = {
      query,
      yearFrom,
      yearTo,
      venue,
      orderBy,
      ascending,
      skip,
    }
    const [res, err] = await api.search(req)
    if (!err ) {
      setData(res.data || [])
      setTotal(res.total)
      setDuration(res.duration)
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
          }
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
      <form onSubmit={e => submit(e)}>
        <input autoFocus value={query} onChange={e => setQuery(e.target.value)} className='mr-1 mb-1' type="text" placeholder='fuzzing' />
        <input type="submit" value="search" />
        <span className='text-gray-400'> - {total} resulsts ({duration / 1000} seconds) </span>
      </form>
      <div
        onClick={() => setShowFilter(!showFilter)}
        className={`pointer underline mb-2 ${!showFilter || "none-560"}`}
      >{showFilter ? "Hide" : "Show"} filters</div>
      <div className={`mb-2 ${showFilter || "none"}`}>
        <span>From </span>
        <select value={yearFrom} onChange={e => setYearFrom(e.target.value)}>
          {
            seq(MIN_YEAR, CURRENT_YEAR + 2).reverse().map(e => <option key={e} value={e}>{e}</option>)
          }
        </select>
        <span> to </span>
        <select value={yearTo} onChange={e => setYearTo(e.target.value)}>
          {
            seq(MIN_YEAR, CURRENT_YEAR + 2).reverse().map(e => <option key={e} value={e} onClick={e => setYearTo(e.target.value)}>{e}</option>)
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
      <div className='flex flex-column-560'>
        <div className={showFilter && 'w--280 w-100-560'} >
          <div className={(data.length === 0 && query !== "") ? undefined : "none"}>no result</div>
          {
            data.map((e, idx) => <Paper key={`${e.title}-${e.score}-${idx}`} {...e} />)
          }
          <hr />
          <div className={0 === total ? "none" : undefined}>
            page ({skip / 20 + 1} / {Math.ceil(total / 20)}): <span
              className={0 < skip ? "initial mt-2 text-blue underline pointer" : "none" }
              onClick={() => setSkip(0)}
            >first</span> | <span
              className={20 <= skip ? "initial mt-2 text-blue underline pointer" : "none" }
              onClick={() => prev()}
            >prev</span> | <span
              className={skip < total - 20 ? "initial mt-2 text-blue underline pointer" : "none" }
              onClick={() => next()}
            >next</span>
          </div>
        </div>
        <div className={showFilter ? 'w-280' : 'none'}>
          <ConferenceTree onChange={e => setVenue(e)}/>
          <hr />
        </div>
      </div>
    </div>
  );
}

export default App;
