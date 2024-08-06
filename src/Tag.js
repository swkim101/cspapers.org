import './Tag.css';

function Tag({ children, onClick }) {
  return (
  <span>
    { children }
    <span className='underline pointer' onClick={onClick}>
      (x)
    </span>
  </span>)
}

export default Tag;

