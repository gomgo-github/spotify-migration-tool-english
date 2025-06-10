# Guida: Come aggiungere un utente di test nel Developer Dashboard di Spotify

Questo documento spiega come risolvere l'errore 403 Forbidden che si verifica durante l'autenticazione con le API di Spotify quando l'app è in modalità sviluppo.

## Il problema

Quando un'app Spotify è in modalità sviluppo (impostazione predefinita per le nuove app), solo gli utenti esplicitamente aggiunti come "utenti di test" possono utilizzarla. Se tenti di autenticarti con un account che non è stato aggiunto come utente di test, riceverai un errore 403 Forbidden.

## Soluzione: Aggiungere il tuo account come utente di test

Segui questi passaggi per aggiungere il tuo account Spotify come utente di test:

1. Accedi al [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)

2. Seleziona l'app che stai utilizzando (devi farlo sia per l'app sorgente che per l'app destinazione)

3. Clicca su "Settings" (⚙️) nell'angolo in alto a destra

4. Scorri verso il basso fino alla sezione "User Management"

5. Clicca su "Add New User"

6. Inserisci l'indirizzo email associato al tuo account Spotify che stai utilizzando per l'autenticazione

7. Clicca su "Save"

8. Ripeti questi passaggi per entrambe le app (sorgente e destinazione)

## Note importanti

- Devi aggiungere come utente di test l'account Spotify che stai effettivamente utilizzando per accedere all'applicazione

- Se stai testando sia l'account sorgente che l'account destinazione, entrambi devono essere aggiunti come utenti di test nelle rispettive app

- Dopo aver aggiunto un utente di test, potrebbe essere necessario attendere qualche minuto prima che le modifiche abbiano effetto

- Se continui a ricevere l'errore 403 Forbidden, prova a cancellare i cookie del browser e riavviare l'applicazione

## Alternativa: Richiedere la modalità estesa

Se prevedi di distribuire l'app a un pubblico più ampio, puoi richiedere che l'app passi dalla modalità sviluppo alla modalità estesa:

1. Nel Developer Dashboard, seleziona l'app

2. Clicca su "Settings" (⚙️)

3. Scorri verso il basso fino alla sezione "Extended Quota Mode"

4. Clicca su "Request Extended Quota"

5. Compila il modulo con le informazioni richieste

Tuttavia, per il semplice utilizzo personale o per i test, aggiungere il tuo account come utente di test è la soluzione più rapida e semplice.