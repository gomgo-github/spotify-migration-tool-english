# 🎵 Spotify Migration Tool

<div align="center">

![Spotify Migration Tool](https://img.shields.io/badge/Spotify-Migration%20Tool-1DB954?style=for-the-badge&logo=spotify&logoColor=white)
![Version](https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**🚀 Migra facilmente playlist, brani salvati e artisti seguiti tra account Spotify diversi**

*Un'applicazione web moderna e sicura per trasferire la tua libreria musicale*

</div>

---

## 📋 Indice

- [✨ Caratteristiche](#-caratteristiche)
- [🎯 Cosa puoi migrare](#-cosa-puoi-migrare)
- [⚡ Avvio Rapido](#-avvio-rapido)
- [🔧 Setup Completo](#-setup-completo)
- [🎮 Come Usare l'App](#-come-usare-lapp)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [❓ FAQ](#-faq)
- [🆘 Supporto](#-supporto)

---

## ✨ Caratteristiche

<div align="center">

| 🎵 **Playlist** | 💚 **Brani Salvati** | 👨‍🎤 **Artisti** | 🎨 **Interfaccia** |
|:---:|:---:|:---:|:---:|
| Migra tutte le tue playlist | Trasferisci i tuoi "Mi piace" | Copia gli artisti seguiti | Design moderno e intuitivo |
| Mantiene nomi e descrizioni | Preserva l'ordine originale | Funzione batch intelligente | Tema Spotify autentico |
| Supporta immagini personalizzate | Gestione duplicati automatica | Zero perdite di dati | Barra progresso in tempo reale |

</div>

### 🚀 **Funzionalità Avanzate**
- ✅ **Architettura Single-App** - Una sola configurazione Spotify
- ✅ **Autenticazione Sicura** - OAuth2 + refresh automatico token
- ✅ **Zero Perdite** - Controllo duplicati intelligente
- ✅ **Interfaccia Moderna** - Design responsive con Material-UI
- ✅ **Logging Dettagliato** - Monitoraggio completo delle operazioni
- ✅ **Gestione Errori** - Recovery automatico e retry intelligente

---

## 🎯 Cosa puoi migrare

<table>
<tr>
<td width="33%">

### 🎵 **Playlist**
- ✅ Tutte le playlist (pubbliche e private)
- ✅ Nomi e descrizioni originali
- ✅ Ordine dei brani mantenuto
- ✅ Immagini personalizzate delle playlist
- ✅ Playlist collaborative (come follower)

</td>
<td width="33%">

### 💚 **Brani Salvati** 
- ✅ Tutti i brani "Mi piace"
- ✅ Fino a 10.000+ brani
- ✅ Controllo duplicati automatico
- ✅ Preservazione dell'ordine
- ✅ Gestione batch intelligente

</td>
<td width="33%">

### 👨‍🎤 **Artisti Seguiti**
- ✅ Tutti gli artisti che segui
- ✅ Migrazione batch ottimizzata
- ✅ Verifica automatica duplicati
- ✅ Zero perdite di dati
- ✅ Processo veloce e affidabile

</td>
</tr>
</table>

---

## ⚡ Avvio Rapido

> **🎯 Per utenti esperti**: Se hai già familiarità con Node.js e Spotify API

### 1️⃣ **Clone e Installazione**
```bash
git clone https://github.com/tomzdev/spotify-migration-tool.git
cd spotify-migration-tool
npm install
cd client && npm install && npm run build && cd ..
```

### 2️⃣ **Configurazione App Spotify**
1. Vai su [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) 
2. Crea una nuova app
3. Aggiungi questi Redirect URI:
   - `http://localhost:5000/api/auth/source/callback`
   - `http://localhost:5000/api/auth/destination/callback`

### 3️⃣ **File .env**

> **💡 Usa il template**: Copia il file `config-example.env` e rinominalo in `.env`

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret  
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/source/callback
DEST_REDIRECT_URI=http://localhost:5000/api/auth/destination/callback
SESSION_SECRET=your_random_secret_here
PORT=5000
```

### 4️⃣ **Avvio**
```bash
npm start
```

### 5️⃣ **Accesso**
Apri http://localhost:5000

---

## 🔧 Setup Completo

> **📚 Per tutti gli utenti**: Guida dettagliata passo-passo

### 📋 **Prerequisiti**

<details>
<summary>🖥️ <strong>Installa Node.js</strong> (clicca per espandere)</summary>

1. **Scarica Node.js**:
   - Vai su [nodejs.org](https://nodejs.org/)
   - Scarica la versione **LTS** (versione stabile)
   - Installa seguendo la procedura guidata

2. **Verifica installazione**:
   ```bash
   node --version
   npm --version
   ```
   Dovresti vedere i numeri di versione.

</details>

<details>
<summary>🎵 <strong>Account Spotify</strong> (clicca per espandere)</summary>

**Ti servono DUE account Spotify**:
- 🟢 **Account Sorgente**: Da cui vuoi copiare i dati
- 🔵 **Account Destinazione**: Dove vuoi trasferire i dati

> **💡 Suggerimento**: Puoi usare account gratuiti o premium indifferentemente

</details>

---

### 🌟 **Step 1: Scaricare l'Applicazione**

<details>
<summary>📥 <strong>Metodo 1: Download ZIP</strong> (più semplice)</summary>

1. Vai su https://github.com/tomzdev/spotify-migration-tool
2. Clicca sul pulsante verde **"Code"**
3. Seleziona **"Download ZIP"**
4. Estrai il file ZIP in una cartella a tua scelta
5. Apri il terminale/prompt nella cartella estratta

</details>

<details>
<summary>⚡ <strong>Metodo 2: Git Clone</strong> (per utenti Git)</summary>

```bash
git clone https://github.com/tomzdev/spotify-migration-tool.git
cd spotify-migration-tool
```

</details>

---

### 🎵 **Step 2: Configurare App Spotify**

> **⚠️ IMPORTANTE**: Questo è il passaggio più critico!

#### **2.1 Accedi al Developer Dashboard**

1. **Vai su**: [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. **Accedi** con qualsiasi account Spotify (anche diverso da quelli che userai)
3. **Clicca** su **"Create app"**

#### **2.2 Configura la Nuova App**

Compila i campi come segue:

| Campo | Valore |
|-------|--------|
| **App name** | `Spotify Migration Tool` (o quello che preferisci) |
| **App description** | `Tool per migrare playlist tra account Spotify` |
| **Website** | `http://localhost:5000` |
| **Redirect URI** | Vedi sotto ⬇️ |

#### **2.3 Configura i Redirect URI** 

> **🔑 CRUCIALE**: Aggiungi ESATTAMENTE questi due URI:

**Nel campo "Redirect URI", aggiungi uno alla volta:**

1. `http://localhost:5000/api/auth/source/callback`
2. `http://localhost:5000/api/auth/destination/callback`

**Visualizzazione finale**:
```
Redirect URIs:
✅ http://localhost:5000/api/auth/source/callback
✅ http://localhost:5000/api/auth/destination/callback
```

#### **2.4 Ottieni le Credenziali**

1. **Clicca** su **"Save"**
2. Vai nella pagina **"Settings"** della tua app
3. **Copia** il **Client ID** e il **Client Secret**

> **🛡️ SICUREZZA**: Non condividere mai il Client Secret!

---

### ⚙️ **Step 3: Configurazione Locale**

#### **3.1 Installa le Dipendenze**

Nel terminale, dalla cartella del progetto:

```bash
# Installa dipendenze backend
npm install

# Installa dipendenze frontend
cd client
npm install
npm run build
cd ..
```

#### **3.2 Crea il File .env**

> **🚀 Metodo Veloce**: Copia il file `config-example.env` e rinominalo in `.env`

1. **Nella cartella del progetto**, trovi il file **`config-example.env`**
2. **Copialo** e **rinominalo** in `.env`
3. **Apri** il file `.env` e modifica i valori:

**Oppure crea manualmente:**

1. **Crea un file** chiamato `.env` nella cartella principale
2. **Copia e incolla** questo contenuto:

```env
# Credenziali della tua app Spotify
SPOTIFY_CLIENT_ID=inserisci_qui_il_tuo_client_id
SPOTIFY_CLIENT_SECRET=inserisci_qui_il_tuo_client_secret

# URI di callback (NON modificare)
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/source/callback
DEST_REDIRECT_URI=http://localhost:5000/api/auth/destination/callback

# Sicurezza sessione (genera una stringa casuale)
SESSION_SECRET=il_tuo_secret_super_sicuro_qui

# Porta del server (NON modificare se non necessario)
PORT=5000
```

3. **Sostituisci**:
   - `inserisci_qui_il_tuo_client_id` con il Client ID copiato
   - `inserisci_qui_il_tuo_client_secret` con il Client Secret copiato
   - `il_tuo_secret_super_sicuro_qui` con una stringa casuale lunga

#### **3.3 Aggiungi Utenti di Test**

> **⚠️ OBBLIGATORIO**: La tua app Spotify è in modalità sviluppo

1. **Torna** al [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. **Apri** la tua app
3. **Vai** su **"User Management"**
4. **Clicca** **"Add New User"**
5. **Aggiungi** l'email dell'account **sorgente** (da cui copi)
6. **Ripeti** per l'account **destinazione** (dove copi)

**Risultato finale**:
```
Users:
✅ email-account-sorgente@example.com
✅ email-account-destinazione@example.com
```

---

### 🚀 **Step 4: Avviare l'Applicazione**

#### **4.1 Avvia il Server**

Nel terminale:

```bash
npm start
```

**Output atteso**:
```
🚀 Server avviato su porta 5000
🎵 Spotify Migration Tool pronto!
🌐 Apri: http://localhost:5000
```

#### **4.2 Accedi all'App**

1. **Apri** il browser
2. **Vai** su: http://localhost:5000
3. **Dovresti vedere** l'interfaccia di benvenuto

---

## 🎮 Come Usare l'App

### 🏠 **Interfaccia Principale**

Quando apri l'app vedrai:

```
🎵 Spotify Migration Tool
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Stato Configurazione: ░░░░░░░░░░ 0%

🔸 Passaggio 1: Connetti Account Sorgente     [ Non Connesso ]
🔸 Passaggio 2: Connetti Account Destinazione [ Non Connesso ]  
🔸 Passaggio 3: Inizia Migrazione            [ Non Disponibile ]
```

### 1️⃣ **Connetti Account Sorgente**

1. **Clicca** su **"Connetti Account Sorgente"**
2. **Verrai reindirizzato** su Spotify
3. **Accedi** con l'account da cui vuoi **copiare** i dati
4. **Autorizza** l'applicazione
5. **Tornerai** all'app con l'account connesso

**Stato aggiornato**:
```
📊 Stato Configurazione: ████████░░ 50%

✅ Passaggio 1: Account Sorgente Connesso     [ username_sorgente ]
🔸 Passaggio 2: Connetti Account Destinazione [ Non Connesso ]
🔸 Passaggio 3: Inizia Migrazione            [ Non Disponibile ]
```

### 2️⃣ **Connetti Account Destinazione**

1. **Clicca** su **"Connetti Account Destinazione"**
2. **⚠️ IMPORTANTE**: Spotify potrebbe mostrarti ancora l'account precedente
3. **Clicca** su **"Non sei tu?"** o **"Cambia account"**
4. **Accedi** con l'account **destinazione**
5. **Autorizza** l'applicazione

**Stato finale**:
```
📊 Stato Configurazione: ██████████ 100%

✅ Passaggio 1: Account Sorgente Connesso      [ username_sorgente ]
✅ Passaggio 2: Account Destinazione Connesso  [ username_destinazione ]
✅ Passaggio 3: Inizia Migrazione             [ 🚀 PRONTO ]
```

### 3️⃣ **Avvia la Migrazione**

1. **Clicca** su **"Inizia Migrazione"**
2. **Seleziona** cosa migrare:
   - ☑️ Playlist (27 trovate)
   - ☑️ Brani Salvati (1,247 trovati)
   - ☑️ Artisti Seguiti (89 trovati)

3. **Opzioni avanzate**:
   - ☑️ Segui playlist esistenti invece di duplicarle
   - ☑️ Trasferisci immagini delle playlist
   - ☑️ Salta duplicati automaticamente

4. **Clicca** **"Avvia Migrazione"**

### 📊 **Monitoraggio Progresso**

Durante la migrazione vedrai:

```
🎵 Migrazione in Corso...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Playlist:       ████████████░░░░░░░░ 15/27 (55%)
💚 Brani Salvati:  ██████░░░░░░░░░░░░░░ 312/1247 (25%)  
👨‍🎤 Artisti:       ████████████████████ 89/89 (100%) ✅

⏱️ Tempo trascorso: 2m 34s
📊 Stato: Migrazione playlist "Estate 2024"...
```

### ✅ **Migrazione Completata**

```
🎉 Migrazione Completata con Successo!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Riepilogo:
✅ Playlist:      27/27 migrate (0 errori)
✅ Brani Salvati: 1,247/1,247 aggiunti (0 duplicati)
✅ Artisti:       89/89 seguiti (0 errori)

⏱️ Tempo totale: 8m 42s
📁 Log dettagliato: Scarica Report
```

---

## 🛠️ Troubleshooting

### 🔴 **Errori Comuni**

<details>
<summary><strong>❌ "INVALID_CLIENT: Invalid redirect URI"</strong></summary>

**Problema**: I Redirect URI non sono configurati correttamente

**Soluzione**:
1. Vai su [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Apri la tua app → Settings
3. Verifica che ci siano ESATTAMENTE:
   - `http://localhost:5000/api/auth/source/callback`
   - `http://localhost:5000/api/auth/destination/callback`
4. Salva e riprova

</details>

<details>
<summary><strong>❌ "403 Forbidden" durante l'autenticazione</strong></summary>

**Problema**: L'account non è aggiunto come utente di test

**Soluzione**:
1. Vai su [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Apri la tua app → User Management
3. Aggiungi l'email dell'account che sta dando errore
4. Salva e riprova

</details>

<details>
<summary><strong>❌ "Cannot connect to server" o porta occupata</strong></summary>

**Problema**: La porta 5000 è già in uso

**Soluzione**:
1. Cambia porta nel file `.env`:
   ```env
   PORT=3000
   ```
2. Riavvia l'app
3. Accedi su `http://localhost:3000`

</details>

<details>
<summary><strong>❌ App si chiude subito o errori NPM</strong></summary>

**Problema**: Dipendenze non installate correttamente

**Soluzione**:
```bash
# Pulisci e reinstalla tutto
rm -rf node_modules client/node_modules
npm install
cd client && npm install && npm run build && cd ..
npm start
```

</details>

### 🟡 **Avvertimenti Non Critici**

<details>
<summary><strong>⚠️ "Warning: Source and destination accounts are the same"</strong></summary>

**Cosa significa**: Stai usando lo stesso account per sorgente e destinazione

**È grave?**: No, ma non ha senso migrare da un account a se stesso

**Soluzione**: Disconnetti un account e connetti un account diverso

</details>

<details>
<summary><strong>⚠️ "Some tracks could not be migrated"</strong></summary>

**Cosa significa**: Alcuni brani non sono disponibili nell'account destinazione

**È normale?**: Sì, può succedere per:
- Brani non disponibili nella regione dell'account destinazione
- Brani rimossi da Spotify
- File locali (non possono essere migrati)

**Soluzione**: Nessuna azione richiesta, è normale

</details>

### 🔧 **Strumenti di Debug**

<details>
<summary><strong>🔍 Modalità Debug</strong></summary>

Per attivare logging dettagliato:

1. Nel file `.env` aggiungi:
   ```env
   NODE_ENV=development
   DEBUG=true
   ```

2. Riavvia l'app

3. Controlla i log nel terminale per dettagli

</details>

---

## ❓ FAQ

<details>
<summary><strong>❓ Posso usare account gratuiti?</strong></summary>

**Sì!** L'app funziona perfettamente con account Spotify gratuiti e premium indifferentemente.

</details>

<details>
<summary><strong>❓ I miei dati sono sicuri?</strong></summary>

**Assolutamente sì!** 
- Tutti i dati rimangono tra te e Spotify
- L'app non salva le tue credenziali
- Usa solo le API ufficiali Spotify
- Codice open source verificabile

</details>

<details>
<summary><strong>❓ Quanti brani posso migrare?</strong></summary>

**Teoricamente illimitati!** L'app gestisce automaticamente:
- Playlist con migliaia di brani
- Fino a 10,000+ brani salvati
- Centinaia di artisti seguiti

L'unico limite è quello imposto da Spotify (50 richieste per secondo).

</details>

<details>
<summary><strong>❓ Cosa succede se interrompo la migrazione?</strong></summary>

**Nessun problema!** Puoi:
- Fermare l'app in qualsiasi momento
- Riavviare e continuare da dove avevi interrotto
- L'app evita automaticamente i duplicati

</details>

<details>
<summary><strong>❓ Posso migrare tra paesi diversi?</strong></summary>

**Sì, ma con limitazioni**. Alcuni brani potrebbero non essere disponibili in paesi diversi per motivi di licensing.

</details>

<details>
<summary><strong>❓ L'app funziona su Mac/Linux?</strong></summary>

**Sì!** L'app è basata su Node.js e funziona su:
- ✅ Windows
- ✅ macOS
- ✅ Linux
- ✅ Qualsiasi sistema con Node.js

</details>

---

## 🆘 Supporto

### 🎯 **Hai bisogno di aiuto?**

<div align="center">

| 📚 **Documentazione** | 🐛 **Bug Report** | 💬 **Discussioni** | 📧 **Email** |
|:---:|:---:|:---:|:---:|
| [Wiki Completa](https://github.com/tomzdev/spotify-migration-tool/wiki) | [Segnala Bug](https://github.com/tomzdev/spotify-migration-tool/issues) | [Forum Q&A](https://github.com/tomzdev/spotify-migration-tool/discussions) | [Contatto Diretto](mailto:support@example.com) |

</div>

### 🔍 **Prima di Chiedere Aiuto**

1. ✅ **Controlla** questa guida
2. ✅ **Verifica** la sezione Troubleshooting
3. ✅ **Cerca** nelle [Issues esistenti](https://github.com/tomzdev/spotify-migration-tool/issues)
4. ✅ **Leggi** le [FAQ](#-faq)

### 📝 **Come Segnalare un Problema**

Quando apri una issue, includi:

```markdown
**Descrizione del problema:**
Cosa stava succedendo quando si è verificato l'errore?

**Passi per riprodurre:**
1. Ho fatto X
2. Poi ho fatto Y
3. È apparso l'errore

**Messaggio di errore:**
[Copia e incolla l'errore esatto]

**Informazioni sistema:**
- OS: Windows/Mac/Linux
- Versione Node.js: [output di `node --version`]
- Browser: Chrome/Firefox/Safari/Edge

**File .env (SENZA credenziali):**
SPOTIFY_CLIENT_ID=HIDDEN
SPOTIFY_CLIENT_SECRET=HIDDEN
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/source/callback
# ... resto della configurazione
```

---

## 🤝 Contribuire

### 💡 **Modi per Contribuire**

- 🌟 **Stella** il progetto su GitHub
- 🐛 **Segnala** bug e problemi
- 💻 **Invia** pull request con miglioramenti
- 📖 **Migliora** la documentazione
- 🌍 **Traduci** l'app in altre lingue
- 📢 **Condividi** con altri utenti Spotify

### 🎯 **Roadmap Futura**

- [ ] 🌐 Interfaccia web pubblica (nessun setup locale)
- [ ] 📱 App mobile per iOS/Android
- [ ] 🎨 Temi personalizzabili
- [ ] 📊 Statistiche avanzate di migrazione
- [ ] 🔄 Sincronizzazione continua tra account
- [ ] 🌍 Supporto multilingue
- [ ] ☁️ Backup cloud delle configurazioni

---

## 📄 Licenza

Questo progetto è sotto licenza **MIT** - vedi il file [LICENSE](LICENSE) per i dettagli.

### 🚫 **Disclaimer**

- Questo tool non è affiliato con Spotify AB
- Usa solo le API pubbliche ufficiali di Spotify
- Rispetta tutti i Terms of Service di Spotify
- Non modifica o viola alcun contenuto protetto da copyright

---

<div align="center">

## ⭐ Ti è stato utile?

**Se questo tool ti ha aiutato a migrare la tua libreria Spotify, considera di:**

[![GitHub Stars](https://img.shields.io/github/stars/tomzdev/spotify-migration-tool?style=social)](https://github.com/tomzdev/spotify-migration-tool/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/tomzdev/spotify-migration-tool?style=social)](https://github.com/tomzdev/spotify-migration-tool/fork)

**Condividi con i tuoi amici!** 📢

---

**Fatto con ❤️ per la community Spotify**

*Ultima aggiornamento: Gennaio 2025*

</div> 