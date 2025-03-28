<h2 align="center">
  <img src="https://github.com/user-attachments/assets/d7d31c38-520b-4e25-8e9a-87608b354c8f" alt="cspapers.org" />
</h2>
<h1 align="center"><a href="https://cspapers.org" target="_blank">cspapers.org</a></h1>
<h4 align="center">Rapid search engine for Computer Science papers</h4>

<p align="center">
  <a href="https://github.com/swkim101/cspapers.org/actions">
    <img src="https://github.com/swkim101/cspapers.org/actions/workflows/test.yml/badge.svg"
         alt="Continuous Deployment">
  </a>
</p>

---
## Description

[cspapers.org](https://cspapers.org) is a rapid search engine for computer science papers, which provides very useful features for paper searches.

1. It provides a conference filter, which Google Scholar poorly supports.
2. It provides a year range filter.
3. It supports exact matching and word highlighting. __Try "double quote!"__
4. It supports corrections using a levenstein distance plus <a href="https://github.com/michmech/lemmatization-lists">lemmatization</a>
5. We open cspapers.org to the public.
6. We open api.cspapers.org as well, the backend of cspapers.org. You can use api.cspapers.org for your project.

## Usage

### On browsers

Go [cspapers.org](https://cspapers.org)

![image](https://github.com/user-attachments/assets/486662bc-3715-49f2-b54f-02ecfc2b0d2e)

Just type what you want in the box, or:

1. Choose a year range. It's inclusive.
2. Choose a sorting method. Relevance or date. We calculate relevance using <a href="https://en.wikipedia.org/wiki/Tf%E2%80%93idf">tf-idf</a> in <a href="https://github.com/blevesearch/bleve">bleve</a>
3. Choose a sorting order. Ascending or descending?
4. Choose conferences. You can choose a conference by a category or venue.
5. __use "double quote"__ for exact matching
6. Scroll down, and select next for paginations
7. Click a paper title and get an abstract.


### On command line

Do you want to use cspapers in a command line? Use CURL:

```bash
$ curl 'https://api.cspapers.org/?query=bluetooth&yearFrom=2019&yearTo=2025&venue=NDSS%2CUsenix%2CSP%2CCCS&orderBy=score&ascending=false&skip=0'
{"total":45,"duration":117,"skip":0,"data":[{"title":"BIAS: Bluetooth Impersonation AttackS","year":2020,"venue":"sp","index":"2020/sp/BIAS: Bluetooth Impersonation AttackS","score":8.824175482299081},{"title":"Method Confusion Attack on Bluetooth Pairing","year":2021,"venue":"sp","index":"2021/sp/Method Confusion Attack on Bluetooth Pairing","score":8.020260180024453},{"title":"Blacktooth: Breaking through the Defense of Bluetooth in Silence","year":2022,"venue":"ccs","index":"2022/ccs/Blacktooth: Breaking through the Defense of Bluetooth in Silence","score":7.9203305079550415},{"title":"Linking Bluetooth LE \u0026 Classic and Implications for Privacy-Preserving Bluetooth-Based Protocols","year":2021,"venue":"sp","index":"2021/sp/Linking Bluetooth LE \u0026 Classic and Implications for Privacy-Preserving Bluetooth-Based Protocols","score":7.77337712762691},{"title":"LIGHTBLUE: Automatic Profile-Aware Debloating of Bluetooth Stacks","year":2021,"venue":"usenix","index":"2021/usenix/LIGHTBLUE: Automatic Profile-Aware Debloating of Bluetooth Stacks","score":7.205307062497967},{"title":"BLUFFS: Bluetooth Forward and Future Secrecy Attacks and Defenses","year":2023,"venue":"ccs","index":"2023/ccs/BLUFFS: Bluetooth Forward and Future Secrecy Attacks and Defenses","score":7.043655050898645},{"title":"Formal Model-Driven Discovery of Bluetooth Protocol Design Vulnerabilities","year":2022,"venue":"sp","index":"2022/sp/Formal Model-Driven Discovery of Bluetooth Protocol Design Vulnerabilities","score":6.650957280334602},{"title":"SoK: The Long Journey of Exploiting and Defending the Legacy of King Harald Bluetooth","year":2024,"venue":"sp","index":"2024/sp/SoK: The Long Journey of Exploiting and Defending the Legacy of King Harald Bluetooth","score":6.55978416347678},{"title":"Blue's Clues: Practical Discovery of Non-Discoverable Bluetooth Devices","year":2023,"venue":"sp","index":"2023/sp/Blue's Clues: Practical Discovery of Non-Discoverable Bluetooth Devices","score":6.411898677112692},{"title":"BadBluetooth: Breaking Android Security Mechanisms via Malicious Bluetooth Peripherals","year":2019,"venue":"ndss","index":"2019/ndss/BadBluetooth: Breaking Android Security Mechanisms via Malicious Bluetooth Peripherals","score":6.206026485875929},{"title":"Finding Traceability Attacks in the Bluetooth Low Energy Specification and Its Implementations","year":2024,"venue":"usenix","index":"2024/usenix/Finding Traceability Attacks in the Bluetooth Low Energy Specification and Its Implementations","score":6.027275683637093},{"title":"Frankenstein: Advanced Wireless Fuzzing to Exploit New Bluetooth Escalation Targets","year":2020,"venue":"usenix","index":"2020/usenix/Frankenstein: Advanced Wireless Fuzzing to Exploit New Bluetooth Escalation Targets","score":5.947169481187168},{"title":"The KNOB is Broken: Exploiting Low Entropy in the Encryption Key Negotiation Of Bluetooth BR EDR","year":2019,"venue":"usenix","index":"2019/usenix/The KNOB is Broken: Exploiting Low Entropy in the Encryption Key Negotiation Of Bluetooth BR EDR","score":5.810896576151459},{"title":"Extrapolating Formal Analysis to Uncover Attacks in Bluetooth Passkey Entry Pairing","year":2023,"venue":"ndss","index":"2023/ndss/Extrapolating Formal Analysis to Uncover Attacks in Bluetooth Passkey Entry Pairing","score":5.802666133524476},{"title":"Please Pay Inside: Evaluating Bluetooth-based Detection of Gas Pump Skimmers","year":2019,"venue":"usenix","index":"2019/usenix/Please Pay Inside: Evaluating Bluetooth-based Detection of Gas Pump Skimmers","score":5.763460599273381},{"title":"FirmXRay: Detecting Bluetooth Link Layer Vulnerabilities From Bare-Metal Firmware","year":2020,"venue":"ccs","index":"2020/ccs/FirmXRay: Detecting Bluetooth Link Layer Vulnerabilities From Bare-Metal Firmware","score":5.733829008848415},{"title":"Breaking Secure Pairing of Bluetooth Low Energy Using Downgrade Attacks","year":2020,"venue":"usenix","index":"2020/usenix/Breaking Secure Pairing of Bluetooth Low Energy Using Downgrade Attacks","score":5.673357961609881},{"title":"BrakTooth: Causing Havoc on Bluetooth Link Manager via Directed Fuzzing","year":2022,"venue":"usenix","index":"2022/usenix/BrakTooth: Causing Havoc on Bluetooth Link Manager via Directed Fuzzing","score":5.558591094625656},{"title":"The Bluetooth CYBORG: Analysis of the Full Human-Machine Passkey Entry AKE Protocol","year":2021,"venue":"ndss","index":"2021/ndss/The Bluetooth CYBORG: Analysis of the Full Human-Machine Passkey Entry AKE Protocol","score":5.528599966660929},{"title":"Security and Privacy Analysis of Samsung's Crowd-Sourced Bluetooth Location Tracking System","year":2024,"venue":"usenix","index":"2024/usenix/Security and Privacy Analysis of Samsung's Crowd-Sourced Bluetooth Location Tracking System","score":5.389775223561923}]}
```

Or NodeJS:

```js
const q = {
  query:     "bluetooth fuzzing",
  orderBy:   "score",
  ascending: false,
  venue:     ["Usenix", "SP"],
  yearFrom:  2024,
  yearTo:    2025,
  skip:      0,
  must: ["bluetooth"]
}
const qs = new URLSearchParams(q)
fetch(`https://api.cspapers.org/?${qs}`)
.then(async (res) => {
  console.log(await res.json());
})
```

```js
{
  total: 5,
  duration: 16,
  skip: 0,
  data: [
    {
      title: 'SoK: The Long Journey of Exploiting and Defending the Legacy of King Harald Bluetooth',
      year: 2024,
      venue: 'sp',
      index: '2024/sp/SoK: The Long Journey of Exploiting and Defending the Legacy of King Harald Bluetooth',
      score: 1.2392758132970945
    },
    {
      title: "To Boldly Go Where No Fuzzer Has Gone Before: Finding Bugs in Linux' Wireless Stacks through VirtIO Devices",
      year: 2024,
      venue: 'sp',
      index: "2024/sp/To Boldly Go Where No Fuzzer Has Gone Before: Finding Bugs in Linux' Wireless Stacks through VirtIO Devices",
      score: 0.6473919808944251
    },
    {
      title: 'Finding Traceability Attacks in the Bluetooth Low Energy Specification and Its Implementations',
      year: 2024,
      venue: 'usenix',
      index: '2024/usenix/Finding Traceability Attacks in the Bluetooth Low Energy Specification and Its Implementations',
      score: 0.611447165298126
    },
    {
      title: "Security and Privacy Analysis of Samsung's Crowd-Sourced Bluetooth Location Tracking System",
      year: 2024,
      venue: 'usenix',
      index: "2024/usenix/Security and Privacy Analysis of Samsung's Crowd-Sourced Bluetooth Location Tracking System",
      score: 0.5697451083649359
    },
    {
      title: 'Practical Obfuscation of BLE Physical-Layer Fingerprints on Mobile Devices',
      year: 2024,
      venue: 'sp',
      index: '2024/sp/Practical Obfuscation of BLE Physical-Layer Fingerprints on Mobile Devices',
      score: 0.30033476991027963
    }
  ]
}
```

And then you can retrieve abstract here:
```
https://raw.githubusercontent.com/swkim101/cspapers.org/main/{index}
```
E.g., 
```js
const a = await fetch("https://raw.githubusercontent.com/swkim101/cspapers.org/main/index2/2022/sp/Formal Model-Driven Discovery of Bluetooth Protocol Design Vulnerabilities")
console.log(await a.text())
//The Bluetooth protocol suite, including Bluetooth Classic, Bluetooth Low Energy, and Bluetooth Mesh, has become the de facto standard for short-range wireless communications. While formal methods have been applied to Bluetooth security, existing efforts either focus on one configuration of a protocol or one protocol of the suite, without considering other configurations or interactions among protocols. As a result, manual analysis still dominates the state-of-the-art security research of Bluetooth specification. To enable automatic Bluetooth security analysis with formal guarantees, we propose a comprehensive formal model for Bluetooth protocol suite covering both the key sharing phase and the data transmission phase, in all the three Bluetooth protocols, and detecting their design flaws automatically. Our formal model, written in ProVerif, adopts a modular design by abstracting each step within a protocol into an interface and implementing different methods in each step as modules to instantiate the interface, through which all possible configurations of a protocol could be examined. We further abstract different Bluetooth protocols into modules enabling the modeling of their interactions and relax the threat model to allow reasoning about semi-compromised devices. We use this model to formally verify 418 security properties and find 82 violations with attack examples capturing 5 known vulnerabilities and discovering 2 new security issues. Bluetooth SIG confirmed our independent discovery of these 2 new issues, with one issue assigned a CVE and the other issue acknowledged in a security notice. Our model provides one step towards formally verified Bluetooth security.
```

## Why not Google Scholar

Poor conference filter:

![google scholar](image.png)

¯\\_(ツ)_/¯

## Research

Dear researchers, feel free to contact me at iam@sungwoo-kim, if you need any help.  
For example, I can archive the search results with a timestamp so you can more reliably cite a URL in your paper.

* [USENIX'25] [SoK: Towards Effective Automated Vulnerability Repair](https://arxiv.org/pdf/2501.18820)

## Acknowlegement

We referred to csrankings.org for organizing conferences.

Thanks to https://github.com/michmech/lemmatization-lists for lemma data.

All data is from to Semantic Schoalr. Thank you.

If this is helpful, consider citing Semantic Scholar and cspapers:
```
@misc{kim2024cspapers, title={cspapers.org}, url={https://cspapers.org/}, author={Kim, Sungwoo}, year={2024}, month=aug, language={en} }
@misc{https://doi.org/10.48550/arxiv.2301.10140,
 title = {The Semantic Scholar Open Data Platform},
 author = {Kinney, Rodney and Anastasiades, Chloe and Authur, Russell and Beltagy, Iz and Bragg, Jonathan and Buraczynski, Alexandra and Cachola, Isabel and Candra, Stefan and Chandrasekhar, Yoganand and Cohan, Arman and Crawford, Miles and Downey, Doug and Dunkelberger, Jason and Etzioni, Oren and Evans, Rob and Feldman, Sergey and Gorney, Joseph and Graham, David and Hu, Fangzhou and Huff, Regan and King, Daniel and Kohlmeier, Sebastian and Kuehl, Bailey and Langan, Michael and Lin, Daniel and Liu, Haokun and Lo, Kyle and Lochner, Jaron and MacMillan, Kelsey and Murray, Tyler and Newell, Chris and Rao, Smita and Rohatgi, Shaurya and Sayre, Paul and Shen, Zejiang and Singh, Amanpreet and Soldaini, Luca and Subramanian, Shivashankar and Tanaka, Amber and Wade, Alex D. and Wagner, Linda and Wang, Lucy Lu and Wilhelm, Chris and Wu, Caroline and Yang, Jiangjiang and Zamarron, Angele and Van Zuylen, Madeleine and Weld, Daniel S.},
 publisher = {arXiv},
 year = {2023},
 doi = {10.48550/ARXIV.2301.10140},
 url = {https://arxiv.org/abs/2301.10140},
 }
```

## Disclaimer

We index titles and abstracts. Paper contents and authors are ***not*** indexed.

All data is from Semantic Scholar Dataset: https://api.semanticscholar.org/api-docs/datasets

cspapers.org is served as implemented as is in this repository. I do not modify source code or data in and after distributions.  
cspapers.org uses cloudflare for caching and fly.io for serving.  
cspapers.org does not collect user data, such as search history and IP address. However, Cloudflare and fly.io do this for pricing and security purposes.  
I personally own stock (less than 10k) of Cloudflare, and I hope they will profit so I can be rich. This is why I bought a domain name from Cloudflare—that will add ~ $10 per year to net sales.  
