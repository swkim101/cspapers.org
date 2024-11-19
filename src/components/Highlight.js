const startsWithLower = (text = "", tok = "") =>
  text.toLowerCase().startsWith(tok.toLowerCase())

const consume = (text = "", tok = "") =>
  startsWithLower(text, tok) ? 
  text.substring(tok.length) :
  text

const split = (text = "", sep = []) => {
  if (sep.length === 0) {
    return []
  }
  const ret = []
  /* match long word first */
  sep = sep.sort((a, b) => b.length - a.length)
  
  let word = ""
  while (text.length !== 0) {
    let tok = ""
    for(tok of sep) {
      if (startsWithLower(text, tok)) {
        break
      }
      tok = ""
    }
    if (tok === "") {
      word += text.charAt(0)
      text = text.substring(1)
    } else {
      if (word !== "") {
        ret.push(word)
        word = ""
      }
      if (ret.length === 0) {
        ret.push("")
      }
      ret.push(text.substring(0, tok.length))
      text = consume(text, tok)
    }
  }
  if (word !== "") {
    ret.push(word)
    word = ""
  }
  return ret
}

/**
 * 
 * @param {{ text: string, highlight: string[] }} props
 * @returns 
 */
function Highlight(props) {
  const parts = split(props.text, props.highlight);
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <span key={part + index} className="highlight">
        {part}
      </span>
    ) : (
      part
    )
  );
}


export default Highlight;
