const api = require("./api")
const levenshtein = require('js-levenshtein');

const fs = require("fs");
const path = require("path");

const CURRENT_YEAR = (new Date()).getFullYear()
/**
 *@type {{
  *   query:     string,
  *   orderBy:   string,
  *   ascending: bool,
  *   yearFrom:  number,
  *   yearTo:    number,
  *   skip:      number,
  * }} SearchRequest
  */
const req = title => ({
  query: title,
  orderBy: "score",
  ascending: false,
  skip: 0,
  venue: "AAAI,IJCAI,CVPR,ICLR,ICML,NeurIPS,ACL,EMNLP,NAACL,SIGIR,WWW,ASPLOS,NDSS,Usenix,SP,CCS,SIGMOD,VLDB,MobiCom,MobiSys,SenSys,OSDI,SOSP,ATC,EuroSYS,FSE,ICSE,ASE,ISSTA,PACMPL,PLDI,FOCS,SODA,STOC,CRYPTO,EuroCrypt,LICS,EC,WINE,CHI,UbiComp,UIST,ICRA,IROS,RSS",
  yearFrom: 2018,
  yearTo: CURRENT_YEAR,
})

const walk = async (dir, callback) => {
  if (dir.includes("2024")) { return }
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      await walk(filepath, callback);
    } else if (stats.isFile()) {
      await callback(file, dir);
    }
  }
};

(async () => {
  await walk("data", async (title, dir) => {
    /* todo */
    // if (title.includes("?") || title.includes("“")) { return }
    const [res, err] = await api.search(req(title))
    if (err) { 
      console.log(err)
      process.exit(1)
    }
    if (res.total === 0) {
      fs.appendFileSync("unreachables", title + "\n")
      return
    }
    if (title === res.data[0].title) {
      return
    }
    const sus = res.data.filter(d => levenshtein(d.title, title) < 4)
    if (1 < sus.length) {
      fs.appendFileSync("duplicates", JSON.stringify(sus, null, 2) + ",\n")
    }
  })
})()