import './App.css';

import * as api from './api';
import conferences from './conferences';

import { useEffect, useState } from 'react';
import Paper from './Paper';
import { ASCE, DATE, SCORE } from './const';

const seq = (start, end, step = 1) => Array.from({ length: end - start }, (_, i) => start + i * step)
const isEven = n => n % 2 === 0
const currentYear = (new Date()).getFullYear()

function App() {
  const [unfolded, setUnfolded] = useState([])
  const [data, setData] = useState([])
  const [yearFrom, setYearFrom] = useState(currentYear - 5)
  const [yearTo, setYearTo] = useState(currentYear + 1)
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
    // search()
    
  }, [])

  const toggleUnfolded = n => {
    if (isUnfolded(n)) {
      setUnfolded(unfolded.filter(e => e !== n))
    } else {
      setUnfolded([...unfolded, n])
    }
  }
  const isUnfolded = n => unfolded.includes(n)
  const addVenue = (v) => {
    if (venue.includes(v)) { return }
    setVenue([...venue, v])
  }
  const delVenue = (v) => {
    setVenue(venue.filter(e => e !== v))
  }
  const addOrDelVenue = (name, add) => add ? addVenue(name) : delVenue(name)

  const addVenueList = (v) => {
    v = v.filter(e => !venue.includes(e))
    setVenue([...venue, ...v])
  }
  const delVenueList = (v) => {
    setVenue(venue.filter(e => !v.includes(e)))
  }
  const addOrDelVenueList = (name, add) => add ? addVenueList(name) : delVenueList(name)
  const isVenueIncludeAll = (v = []) => v.every(e => venue.includes(e))

  return (
    <div className='p-2'>
      <div className='mb-2'>
        <b>cspapers.org: computer science papers indexed </b>
        <a rel="noreferrer" target="_blank" href="https://github.com/swkim101/cspapers.org">( GitHub )</a>
      </div>
      <form onSubmit={e => submit(e)}>
        <input value={query} onChange={e => setQuery(e.target.value)} className='mr-1 mb-1' type="text" placeholder='fuzzing' />
        <input type="submit" value="search" />
      </form>
      <div className='mb-2'>
        <span>From </span>
        <select value={yearFrom} onChange={e => setYearFrom(e.target.value)}>
          {
            seq(2010, currentYear+2).reverse().map(e => <option key={e} value={e}>{e}</option>)
          }
        </select>
        <span> to </span>
        <select value={yearTo} onChange={e => setYearTo(e.target.value)}>
          {
            seq(2010, currentYear+2).reverse().map(e => <option key={e} value={e} onClick={e => setYearTo(e.target.value)}>{e}</option>)
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
      <div className='flex'>
        <div className='w--280 overflow-hidden'>
          {
            data.map(e => <Paper key={e.title} props={e} />)
          }
        </div>
        <div className='w-280'>
          {conferences.tree.name} [ <span onClick={() => setVenue([])} className='underline pointer'>off</span> | <span onClick={() => setVenue(conferences.flatten(conferences.tree))} className='underline pointer'>on</span> ]
          {
            conferences.tree.children.map(d1 =>
              <div key={d1.name}>
                <hr />
                {d1.name} [ <span onClick={() => delVenueList(conferences.flatten(d1))} className='underline pointer'>off</span> | <span onClick={() => addVenueList(conferences.flatten(d1))} className='underline pointer'>on</span> ]
                {d1.children.map(d2 =>
                  <div key={d2.name}>
                    <div className="flex justify-between">
                      <span>
                        <span className='pointer underline' onClick={() => toggleUnfolded(d2.name)}>
                          { isUnfolded(d2.name) ? "▼ " : "► " }
                        </span>
                        <label htmlFor={d2.name}> {d2.name}</label>
                      </span>
                      <input
                        onChange={e => addOrDelVenueList(d2.children.map(v => v.name), e.target.checked)}
                        checked={isVenueIncludeAll(d2.children.map(e => e.name))}
                        type="checkbox"
                        id={d2.name}
                      />
                    </div>
                    {isUnfolded(d2.name) && d2.children.map((d3, idx) =>
                      <div key={d3.name} className={`flex justify-between ${isEven(idx) && "bg-gray-100"}`}>
                        <label htmlFor={d3.name}>{d3.name}</label>
                        <input checked={venue.includes(d3.name)} onChange={e => addOrDelVenue(d3.name, e.target.checked)} type="checkbox" id={d3.name} />
                      </div>
                    )}
                  </div>
                )}

              </div>)
          }
        </div>
      </div>
    </div>
  );
}

export default App;
