# [`xstate`](https://xstate.js.org/docs/) Finite State Machine

## State Diagram

```mermaid
stateDiagram
     [*] --> outdated

    state parallel_fork <<fork>>
    state parallel_join <<join>>

    outdated --> parallel_fork : UPDATE
    parallel_fork --> queuing
    parallel_fork --> upserting

    state updating {
        state q_queuing queuing {
            state "queuing" as q_start
            state "final" as q_done
            [*] --> q_start
            q_start --> q_done : onDone
            q_done --> [*]
        }
        --

        state upserting {
            state "upserting" as u_start
            state "final" as u_done
            
            [*] --> u_start
            u_start --> u_done : onDone
            u_done --> [*]
        }
    }

    queuing --> parallel_join
    upserting --> parallel_join

    parallel_join --> updated: onDone
    updated --> [*]
```