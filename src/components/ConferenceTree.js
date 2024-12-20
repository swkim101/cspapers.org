import { useEffect, useState } from 'react';
import { comments, conferences } from '../conferences';
import { isEven } from '../functional';

/**
 * 
 * @param {{ value: [string], onChange: (venue: [string]) => void }} props 
 * @returns 
 */
function ConferenceTree(props) {
  const defaultSelected = conferences.flatten(conferences.tree)
  const [venue, _setVenue] = useState(defaultSelected)
  const [unfolded, setUnfolded] = useState([])
  const setVenue = (venue) => {
    _setVenue(venue)
    props.onChange(venue)
  }
  useEffect(() => {
    _setVenue(props.value)
  }, [props.value])

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
    <div>
      {conferences.tree.name} (1960-) [ <span onClick={() => setVenue([])} className='underline pointer'>off</span> | <span onClick={() => setVenue(conferences.flatten(conferences.tree))} className='underline pointer'>on</span> ]
      {
        conferences.tree.children.map(d1 =>
          <div key={d1.name}>
            <hr />
            {d1.name} [ <span onClick={() => delVenueList(conferences.flatten(d1))} className='underline pointer'>off</span> | <span onClick={() => addVenueList(conferences.flatten(d1))} className='underline pointer'>on</span> ]
            {d1.children.map(d2 =>
              <div key={d2.name}>
                <div className="flex justify-between">
                  <span>
                    <span className='pointer underline text-blue' onClick={() => toggleUnfolded(d2.name)}>
                      {isUnfolded(d2.name) ? "▼ " : "► "}
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
                  <div key={d3.name} className={`flex justify-between ${isEven(idx) ? "bg-gray-100" : undefined}`}>
                    <label htmlFor={d3.name}>{d3.name}{comments[d3.name]}</label>
                    <input checked={venue.includes(d3.name)} onChange={e => addOrDelVenue(d3.name, e.target.checked)} type="checkbox" id={d3.name} />
                  </div>
                )}
              </div>
            )}
          </div>)
      }
      <hr />
    </div>
  )
}

export default ConferenceTree