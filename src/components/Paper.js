import { useState } from 'react';
import { getAbstract } from '../api';
import Highlight from './Highlight'

/**
 * 
 * @param {{ year: number, venue: string, title: string, highlight: string[] }} props
 * @returns 
 */
function Paper(props) {
  const [collapsed, setCollapsed] = useState(true)
  const [abstract, setAbstract] = useState('')
  const [isAbsLoaded, setIsAbsLoaded] = useState(false)
  const venueUpper = props.venue.toUpperCase()

  const toggleCollapsed = () => {
    const nextCollapsed = !collapsed
    setCollapsed(nextCollapsed)
    if (nextCollapsed) {
      return
    }
    if (isAbsLoaded) {
      return
    }
    getAbstract(props.year, props.venue, props.title)
      .then(([abs, err]) => {
        if (err) {
          setAbstract("failed to retreive an abstract: ", err)
        } else {
          setAbstract(abs)
        }
        setIsAbsLoaded(true)
      })
  }

  return (
    <div className="mb-2">
      <div>
        <span className='pointer underline mr-2' onClick={() => toggleCollapsed()}>
          <span className="text-blue">{collapsed ? '► ' : '▼ '}</span>
          [{venueUpper} {props.year}] <Highlight text={props.title} highlight={props.highlight} />
        </span>
        <a rel="noreferrer" target="_blank" href={`https://scholar.google.com/scholar?q=${props.title}`}>
          [Google scholar]
        </a>
      </div>
      <pre className={collapsed ? 'none' : 'initial pre-line'}>
        {
          isAbsLoaded ?
            <Highlight text={abstract} highlight={props.highlight} /> ||
            <>No abstract indexed. See <a rel="noreferrer" target="_blank" href={`https://scholar.google.com/scholar?q=${props.title}`}>
              Google scholar
            </a></> :
            "...fetching"
        }
      </pre>
    </div>
  )
}

export default Paper;

