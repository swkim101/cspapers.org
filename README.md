# cspapers.org

Search engine for computer science papers.

Indexes title and abstract. Paper contents and authors are ***not*** indexed.

## Current Index

Indexed 
* Full (2018 - 2023): USENIX SEC, NDSS, OSDI, ATC, CCS, IEEE SP, SOSP, FSE, ASE, ICSE, ISSTA, EuroSys, WWW
* Partial: ACL 2024, PLDI 2018-2022

## How to add new conferences/papers

Add an abstract in `./data/<year>/<venue>/<papertitle>`.  
If the venue is new, add venue in `./src/conferences.js`.

PR is welcome.

## How to run local

Install dependencies
```bash
npm install

# For serving data directory.
sudo npm install http-server -g
```

Build and run

```bash
# generate index db. It takes ~15min.
go run ./api.cspapers.org/index -debug
# run index server
go run ./api.cspapers.org/server -debug
```

```bash
# serve data directory
cd data
http-server -p 3001 --cors
```

```bash
# run web
npm run start
```

or

```
docker build -t server .
docker run -it server
npm run start
```

try: http://localhost:8000/?query=bluetooth&yearFrom=2019&yearTo=2025&venue=NDSS%2CUsenix%2CSP%2CCCS&orderBy=score&ascending=false&skip=0&take=20

## Query

Curl https://cspaper-org.fly.dev works:

```bash
$ curl 'https://cspaper-org.fly.dev/?query=bluetooth&yearFrom=2019&yearTo=2025&venue=NDSS%2CUsenix%2CSP%2CCCS&orderBy=score&ascending=false&skip=0&take=20'
[1]+  Done                    curl https://cspaper-org.fly.dev/?query=bluetooth
{"total":10,"skip":0,"take":0,"data":[{"title":"BLUFFS: Bluetooth Forward and Future Secrecy Attacks and Defenses","year":2023,"venue":"ccs","index":"2023/ccs/BLUFFS: Bluetooth Forward and Future Secrecy Attacks and 
(...)
```

### Request fields

All fields are required.

| Field    | Type    | Description  |
| -------- | ------- | ------------ |
| query    | String  | find relative documents |
| yearFrom | Int     | must be satisfied. inclusive. |
| yearTo   | Int     | must be satisfied. inclusive. |
| venue    | String, String, ...  | find papers in (venue A or venue B or ...) |
| orderBy  | ENUM("score", "date")  | order by relevance or published date |
| ascending  | Boolean | return in an ascending order if true |
| skip  | Int | WIP. For pagination |
| take  | Int | WIP. For pagination |

### Response fields

| Field    | Type    | Description  |
| -------- | ------- | -----------  |
| total    | Int  | total number of index matched |
| skip    | Int  | WIP. For pagination |
| take    | Int  | WIP. For pagination |
| data    | [SearchResult]  |  See below |

SearchResult Fields:

| Field    | Type    | Description |
| -------- | ------- | ------------ |
| title    | Int  | paper title |
| year     | Int  | published year |
| venue    | String  | published venue |
| index    | String  | pointer to an abstract |
| score    | Float  | query-relevance score |


## Data source and corectness

There are two data sources:
* (farely accurate) https://dblp.org + https://www.semanticscholar.org/
* conference site, e.g., https://www.usenix.org/conference/usenixsecurity24/fall-accepted-papers

The crawler sometimes misses paper from the first source if semantic scholar returns nothing (see ./data_crawler/failed.json).

For the second source, the crawler somtimes confuse paper talk and keynote talk (and others). So, search results sometime contains *not* papers (see [3b6c738](https://github.com/swkim101/cspapers.org/commit/3b6c7386b685b72a18cb4074aa69a71570d50134)). The Google scholar button can help verifying this.

Reporting wrong index is always welcome.

## Why not Google Scholar

Poor conference filter:

![google scholar](image.png)

¯\\_(ツ)_/¯

## Todo

* Pagination
* Add more papers
* Add more abstract
* Term aliasing (e.g., uaf = use-after-free)

PR is welcome

## Acknowlegement

Referred to csrankings.org for organizing conferences.

## Disclaimer

cspapers.org is served as implemented in this repository. I do not modify source code or data in and after distributions.  
The source code shows that cspapers.org does not collect user data, such as search history and IP address. However, Cloudflare and fly.io do this for pricing and security purposes.  
I personally own stock (less than 10k) of Cloudflare, and I hope they will have profit so I can be rich. This is why I bought a domain name from Cloudflare - that will add ~10$ per year to net sales.  
cspapers.org uses fly.io because it is the cheapest server. It costs 3.19$ per month with 1 core and 512MB RAM in the Virginia region. I am always willing to migrate to a cheaper one. Suggestion is welcome.  
Each conference site provides origins of titles and abstracts of papers.
