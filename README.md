# Spotify Migration Tool

## Configurazione App Spotify (Aggiornata - Una Singola App)

Per utilizzare correttamente questo strumento, è ora necessario configurare **una sola app** nel [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

### Configurazione della Singola App Spotify

1. Accedi al [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Crea una nuova app (o usa una esistente)
3. Vai su "Edit Settings" della tua app
4. Aggiungi **entrambi** i Redirect URI:
   - `http://localhost:5000/api/auth/source/callback`
   - `http://localhost:5000/api/auth/destination/callback`
5. Salva le impostazioni

### Configurazione delle Variabili d'Ambiente

Crea un file `.env` nella directory principale del progetto con il seguente contenuto:

```env
# Configurazione App Spotify (Una Singola App)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/source/callback

# URI di redirect per account destinazione (stessa app)
DEST_REDIRECT_URI=http://localhost:5000/api/auth/destination/callback

# Configurazione sessione
SESSION_SECRET=your_random_session_secret_here

# Configurazione server
PORT=5000
NODE_ENV=development
```

### Autorizzazioni (Scopes) Necessarie

Assicurati che la tua app Spotify abbia le seguenti autorizzazioni abilitate:
- `user-read-private`
- `user-read-email`
- `playlist-read-private`
- `playlist-read-collaborative`
- `playlist-modify-public`
- `playlist-modify-private`
- `user-library-read`
- `user-library-modify`
- `user-follow-read`
- `user-follow-modify`
- `user-top-read`
- `ugc-image-upload`

### Configurazione Utenti di Test

⚠️ **IMPORTANTE**: Se la tua app è in modalità sviluppo (impostazione predefinita), devi aggiungere entrambi gli account Spotify che vuoi usare come "utenti di test":

1. Nel Dashboard della tua app, vai su "Settings"
2. Scorri verso il basso fino alla sezione "User Management"
3. Clicca su "Add New User"
4. Inserisci l'email dell'account **sorgente** che vuoi migrare
5. Clicca su "Save"
6. Ripeti per l'account **destinazione**

### Risoluzione dei Problemi di Autenticazione

Se riscontri errori 403 Forbidden durante l'autenticazione:

1. **Verifica Redirect URI**: Assicurati che entrambi i redirect URI siano configurati correttamente nell'app
2. **Utenti di Test**: Controlla che entrambi gli account siano aggiunti come utenti di test
3. **Autorizzazioni**: Verifica che tutti gli scope necessari siano abilitati
4. **Cache Browser**: Prova a cancellare i cookie e riavviare l'applicazione
5. **Account Diversi**: Assicurati di usare account Spotify diversi per sorgente e destinazione

### Vantaggi della Nuova Configurazione

- ✅ **Più Semplice**: Una sola app da configurare invece di due
- ✅ **Meno Errori**: Nessun rischio di confondere le credenziali
- ✅ **Stesso Funzionamento**: Stessa funzionalità di migrazione
- ✅ **Compatibilità**: Supporto per configurazioni legacy

## Avvio dell'applicazione

1. Installa le dipendenze:
   ```bash
   npm install
   ```

2. Configura il file `.env` come descritto sopra

3. Avvia il server:
   ```bash
   npm start
   ```

4. Accedi all'applicazione nel browser:
   ```
   http://localhost:5000
   ```

## Come Funziona

1. **Connetti Account Sorgente**: Autentica l'account da cui vuoi migrare i dati
2. **Connetti Account Destinazione**: Autentica l'account verso cui migrare i dati
3. **Seleziona Contenuti**: Scegli playlist, brani salvati e artisti da migrare
4. **Avvia Migrazione**: Inizia il processo di trasferimento automatico

## Troubleshooting

### Errore 403 durante la migrazione
- Verifica che entrambi gli account siano utenti di test
- Controlla che l'app abbia tutti gli scope necessari
- Prova a disconnettere e riconnettere entrambi gli account

### Token scaduti
- L'applicazione gestisce automaticamente il refresh dei token
- Se persistono problemi, riavvia l'applicazione

### Playlist non trovate
- Le playlist private potrebbero non essere visibili
- Verifica che l'account sorgente abbia accesso alle playlist da migrare