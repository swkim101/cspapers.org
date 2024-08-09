Today's (predominantly cloud-based) File sharing products leave users at the mercy of providers and nation-state adversaries with subpoena and National Security Letter (NSL) powers. In-transit and provider-side at-rest encryption do little to handle this.Almost-weekly breaches [7-13, 17] and NSL revelations [2] show that the problem becomes only worse with increasingly privacy-unfriendly regulation [14]. We believe it is important to provide hype-free, easy-to-use strongly-secure solutions that protect individual privacy while also defeating cloud breaches and compromises. CipherLocker provides practical, easy-to-use, client-side encrypted File sharing with integrated ranked search. All data and metadata is strongly encrypted before leaving the client. Users can securely store, share, sync, and search. The design does not allow even a compromised or compelled cloud provider to ever access user data or search queries. CipherLocker shows that highly-scalable, fast ranked search on encrypted data is possible without the deployment of expensive and often insecure server-side search-on-encrypted-data cryptography which would require 3-5 orders of magnitude more resources and cannot scale to even thousands of users, or the simplest sharing scenarios without breaking security. CipherLocker is the result of several years of work and it cannot be exhaustively detailed and analyzed in this space. This is the first of a series of papers discussing CipherLocker design, implementation and security properties. The main goal here is to briefly overview and introduce key design decisions and behaviors.