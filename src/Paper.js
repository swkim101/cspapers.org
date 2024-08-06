import { useEffect, useState } from 'react';
import './Paper.css';

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

  useEffect(() => {
    if (collapsed === true) {
      return
    }
    if (abstract !== '') {
      return
    }
    fetch("https://raw.githubusercontent.com/swkim101/swkim101.github.io/main/style.css")
      .then(e => {
        e.text().then(e => setAbstract(e))
      })

  }, [collapsed, abstract])

  props.venue = props.venue.toUpperCase()
  return (
    <div className="mb-2">
      <div>
        <span className='pointer underline mr-2' onClick={() => setCollapsed(!collapsed)}>
          <span>{ collapsed ? '► ' : '▼ ' }</span>
          [{props.venue} {props.year}] {props.title}
        </span>
        <a rel="noreferrer" target="_blank" href={`https://scholar.google.com/scholar?q=${props.title}`}>
          [Google scholar]
        </a>
      </div>
<pre className={collapsed ? 'none' : 'initial'}>
{abstract}
</pre>
    </div>
  )
}

export default Paper;

