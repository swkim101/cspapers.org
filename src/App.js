import * as api from './api';
import conferences from './conferences';

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
  const [showConferenceFilter, setShowConferenceFilter] = useState(true)
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

  const search = async () => {
    const req = {
      query,
      yearFrom,
      yearTo,
      venue,
      orderBy,
      ascending,
      skip: 0,
      take: 20,
    }
    const [res, err] = await api.search(req)
    if (!err) {
      setData(res.data || [])
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
        default:
          console.error("unknwon field ", k)
      }
    }
  }, [])
  useEffect(() => {
    if (query === "")
      return
    search()
  }, [query,
    yearFrom,
    yearTo,
    venue,
    orderBy,
    ascending,
  ])

  return (
    <div className='p-2'>
      <div className='mb-2'>
        <b>cspapers.org: computer science papers indexed </b>
        <a rel="noreferrer" target="_blank" href="https://github.com/swkim101/cspapers.org">( GitHub )</a>
      </div>
      <form onSubmit={e => submit(e)}>
        <input autoFocus value={query} onChange={e => setQuery(e.target.value)} className='mr-1 mb-1' type="text" placeholder='fuzzing' />
        <input type="submit" value="search" />
      </form>
      <div className='mb-2'>
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
        <div className={showConferenceFilter && 'w--280 w-100-560'} >
          {
            data.map(e => <Paper key={e.title} {...e} />)
          }
        </div>
        {showConferenceFilter || <div onClick={() => setShowConferenceFilter(true)} className='pointer underline mb-2'>Show conferences</div>}
        <div className={showConferenceFilter ? 'w-280' : 'none'}>
          <div onClick={() => setShowConferenceFilter(false)} className='pointer underline mb-2 none-560'>Hide conferences</div>
          <ConferenceTree onChange={e => setVenue(e)}/>
          <hr />
        </div>
      </div>
    </div>
  );
}

export default App;
