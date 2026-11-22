import { useState } from 'react';
import { getAbstract } from '../api';
import Highlight from './Highlight'

/**
 * 
 * @param {{ index: string, year: number, venue: string, title: string, highlight: string[] }} props
 * @returns 
 */
function Paper(props) {
  const [collapsed, setCollapsed] = useState(true)
  const [abstract, setAbstract] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const venueUpper = props.venue.toUpperCase()
  const scholarURL = `https://scholar.google.com/scholar?q=${encodeURIComponent(props.title)}`

  const toggleCollapsed = async () => {
    const nextCollapsed = !collapsed
    setCollapsed(nextCollapsed)
    if (nextCollapsed || isLoading || abstract !== null) {
      return
    }

    setIsLoading(true)
    setHasError(false)
    try {
      setAbstract(await getAbstract(props.index))
    } catch {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-2">
      <div>
        <span className='pointer underline mr-2' onClick={() => toggleCollapsed()}>
          <span className="text-blue">{collapsed ? '► ' : '▼ '}</span>
          [{venueUpper} {props.year}] <Highlight text={props.title} highlight={props.highlight} />
        </span>
        <a rel="noreferrer" target="_blank" href={scholarURL}>
          [Google scholar]
        </a>
      </div>
      <pre className={collapsed ? 'none' : 'initial pre-line'}>
        {isLoading && "…fetching"}
        {hasError && "Could not load the abstract. Collapse and reopen to retry."}
        {abstract === "" && <>No abstract found. See <a rel="noreferrer" target="_blank" href={scholarURL}>Google Scholar</a>.</>}
        {abstract && <Highlight text={abstract} highlight={props.highlight} />}
      </pre>
    </div>
  )
}

export default Paper;

