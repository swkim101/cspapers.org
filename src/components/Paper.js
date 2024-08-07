import { useEffect, useState } from 'react';
import { getAbstract } from '../api';

const defaultProps = {
  title: '',
  year: 0,
  venue: '',
  index: '',
  score: '',
}
function Paper({ props = defaultProps }) {
  const [collapsed, setCollapsed] = useState(true)
  const [abstract, setAbstract] = useState('')
  const [isAbsLoaded, setIsAbsLoaded] = useState(false)
  const venueUpper = props.venue.toUpperCase()

  useEffect(() => {
    if (collapsed) {
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
  }, [collapsed])

  return (
    <div className="mb-2">
      <div>
        <span className='pointer underline mr-2' onClick={() => setCollapsed(!collapsed)}>
          <span>{collapsed ? '► ' : '▼ '}</span>
          [{venueUpper} {props.year}] {props.title}
        </span>
        <a rel="noreferrer" target="_blank" href={`https://scholar.google.com/scholar?q=${props.title}`}>
          [Google scholar]
        </a>
      </div>
      <pre className={collapsed ? 'none' : 'initial pre-line'}>
        {
          isAbsLoaded ?
            abstract ||
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

