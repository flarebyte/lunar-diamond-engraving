# Sequence diagram for Lunar diamond engraving event store

> Facilitate the writing of records in a cloud event store


## Lifelines

    - dispatcher: Payload dispatcher
    - latest-storage: Latest storage
    - historical-storage: Historical storage
    - audit-journal: Audit journal
    - rejection-journal: Rejection journal
    - search-record: A contenation of fields used for search purpose


## Sequence Diagram
```mermaid
sequenceDiagram
    participant dispatcher
    participant latest-storage
    participant historical-storage
    participant audit-journal
    participant rejection-journal
    participant search-record

    dispatcher->>+latest-storage: store latest
    dispatcher->>+historical-storage: Keeps historical records
    dispatcher->>+rejection-journal: Keep a journal of invalid access
    dispatcher->>+audit-journal: Keep a journal of valid access
    dispatcher->>+search-record: Keep the metadata useful for searching the records
```