# cspapers.org

Search engine for computer science papers.

Indexes title and abstract. Paper contents and authors are ***not*** indexed.

## How to add papers

If you would like to add some papers, please add them in `data/` and make a PR. Once it is merged, CD/CI will reindex and distribute automatically.

### Current Index

Indexed 
* 2018 - current: USENIX SEC[^1], NDSS[^1], OSDI[^1], ATC[^1], CCS, IEEE SP, SOSP
* 2024: ASPLOS[^1], ACL

[^1]: Abstract is indexed.

## How to run local

Install dependencies
```bash
npm install
```

Build and run

```bash
# generate index db
go run api.cspapers.org/index -debug
# run server
go run api.cspapers.org/server -debug
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

## Why not Google Scholar

Poor conference filter:

![google scholar](image.png)

¯\\_(ツ)_/¯

## Todo

* Pagination
* Add more papers
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
