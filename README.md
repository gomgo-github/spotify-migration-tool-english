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
- [🚀 Installazione e Setup](#-installazione-e-setup)
- [🎮 Come Usare l'App](#-come-usare-lapp)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [❓ FAQ](#-faq)

---

## ✨ Caratteristiche

### 🚀 **Funzionalità Principali**
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

</td>
<td width="33%">

### 💚 **Brani Salvati** 
- ✅ Tutti i brani "Mi piace"
- ✅ Fino a 10.000+ brani
- ✅ Controllo duplicati automatico
- ✅ Gestione batch intelligente

</td>
<td width="33%">

### 👨‍🎤 **Artisti Seguiti**
- ✅ Tutti gli artisti che segui
- ✅ Migrazione batch ottimizzata
- ✅ Verifica automatica duplicati
- ✅ Processo veloce e affidabile

</td>
</tr>
</table>

---

## 🚀 Installazione e Setup

### 📋 **Prerequisiti**

**Ti servono:**
- **Node.js** (versione LTS): [Scarica qui](https://nodejs.org/)
- **Due account Spotify** (gratuiti o premium)
- **Una app Spotify** nel Developer Dashboard

---

### 🌟 **Step 1: Scaricare l'Applicazione**

**Metodo 1 - Download ZIP:**
1. Vai su https://github.com/tomzdev/spotify-migration-tool
2. Clicca **"Code"** → **"Download ZIP"**
3. Estrai nella cartella che preferisci

**Metodo 2 - Git Clone:**
```bash
git clone https://github.com/tomzdev/spotify-migration-tool.git
cd spotify-migration-tool
```

---

### 🎵 **Step 2: Configurare App Spotify**

> **⚠️ IMPORTANTE**: Questo è il passaggio più critico!

#### **2.1 Crea l'App Spotify**

1. **Vai su**: [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. **Accedi** con qualsiasi account Spotify
3. **Clicca** su **"Create app"**

#### **2.2 Configura l'App**

Compila i campi:

| Campo | Valore |
|-------|--------|
| **App name** | `Spotify Migration Tool` |
| **App description** | `Tool per migrare playlist tra account Spotify` |
| **Website** | `http://localhost:5000` |
| **Redirect URI** | Vedi sotto ⬇️ |

#### **2.3 Aggiungi i Redirect URI** 

> **🔑 CRUCIALE**: Aggiungi ESATTAMENTE questi due URI:

1. `http://localhost:5000/api/auth/source/callback`
2. `http://localhost:5000/api/auth/destination/callback`

#### **2.4 Ottieni le Credenziali**

1. **Salva** l'app
2. Vai su **"Settings"**
3. **Copia** il **Client ID** e **Client Secret**

#### **2.5 Aggiungi Utenti di Test**

1. Vai su **"User Management"**
2. **Aggiungi** l'email dell'account **sorgente**
3. **Aggiungi** l'email dell'account **destinazione**

---

### ⚙️ **Step 3: Configurazione Locale**

#### **3.1 Installa le Dipendenze**

```bash
# Installa dipendenze backend
npm install

# Installa dipendenze frontend e build
cd client
npm install
npm run build
cd ..
```

#### **3.2 Configura Environment**

**Metodo veloce:**
1. Copia il file `config-example.env` 
2. Rinominalo in `.env`
3. Modifica i valori:

```env
# Sostituisci con i tuoi valori reali
SPOTIFY_CLIENT_ID=il_tuo_client_id
SPOTIFY_CLIENT_SECRET=il_tuo_client_secret

# NON modificare questi
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/source/callback
DEST_REDIRECT_URI=http://localhost:5000/api/auth/destination/callback

# Genera una stringa casuale lunga
SESSION_SECRET=stringa_casuale_molto_lunga_e_sicura

PORT=5000
```

---

### 🚀 **Step 4: Avviare l'Applicazione**

```bash
npm start
```

**Output atteso:**
```
🚀 Server avviato su porta 5000
🎵 Spotify Migration Tool pronto!
🌐 Apri: http://localhost:5000
```

**Apri il browser su:** http://localhost:5000

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
2. **Accedi** con l'account da cui vuoi **copiare** i dati
3. **Autorizza** l'applicazione

### 2️⃣ **Connetti Account Destinazione**

1. **Clicca** su **"Connetti Account Destinazione"**
2. **⚠️ IMPORTANTE**: Se vedi l'account precedente, clicca **"Non sei tu?"**
3. **Accedi** con l'account **destinazione**
4. **Autorizza** l'applicazione

### 3️⃣ **Avvia la Migrazione**

1. **Clicca** su **"Inizia Migrazione"**
2. **Seleziona** cosa migrare:
   - ☑️ Playlist
   - ☑️ Brani Salvati
   - ☑️ Artisti Seguiti

3. **Clicca** **"Avvia Migrazione"**

### 📊 **Monitoraggio Progresso**

Durante la migrazione vedrai aggiornamenti in tempo reale:

```
🎵 Migrazione in Corso...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Playlist:       ████████████░░░░░░░░ 15/27 (55%)
💚 Brani Salvati:  ██████░░░░░░░░░░░░░░ 312/1247 (25%)  
👨‍🎤 Artisti:       ████████████████████ 89/89 (100%) ✅

⏱️ Tempo trascorso: 2m 34s
```

---

## 🛠️ Troubleshooting

### 🔴 **Errori Comuni**

**❌ "INVALID_CLIENT: Invalid redirect URI"**
- **Problema**: Redirect URI non configurati correttamente
- **Soluzione**: Verifica che nell'app Spotify ci siano ESATTAMENTE:
  - `http://localhost:5000/api/auth/source/callback`
  - `http://localhost:5000/api/auth/destination/callback`

**❌ "403 Forbidden" durante l'autenticazione**
- **Problema**: Account non aggiunto come utente di test
- **Soluzione**: Vai su User Management e aggiungi l'email dell'account

**❌ "Cannot connect to server"**
- **Problema**: Porta 5000 occupata
- **Soluzione**: Cambia porta nel file `.env` (es. `PORT=3000`)

**❌ App si chiude o errori NPM**
- **Problema**: Dipendenze corrotte
- **Soluzione**: 
  ```bash
  rm -rf node_modules client/node_modules
  npm install
  cd client && npm install && npm run build && cd ..
  ```

### 🟡 **Avvertimenti Non Critici**

**⚠️ "Source and destination accounts are the same"**
- Non grave, ma inutile migrare da un account a se stesso

**⚠️ "Some tracks could not be migrated"**
- Normale per brani non disponibili nella regione o rimossi da Spotify

---

## ❓ FAQ

**❓ Posso usare account gratuiti?**
- Sì! Funziona con account gratuiti e premium

**❓ I miei dati sono sicuri?**
- Assolutamente sì. L'app non salva credenziali, usa solo API ufficiali Spotify

**❓ Quanti brani posso migrare?**
- Teoricamente illimitati (gestisce automaticamente migliaia di brani)

**❓ Cosa succede se interrompo la migrazione?**
- Puoi fermare e riavviare quando vuoi, evita automaticamente i duplicati

**❓ Funziona su Mac/Linux?**
- Sì, funziona su qualsiasi sistema con Node.js

**❓ Posso migrare tra paesi diversi?**
- Sì, ma alcuni brani potrebbero non essere disponibili per motivi di licensing

---

## 🆘 Supporto

**Hai problemi?**
- 🐛 [Segnala Bug](https://github.com/tomzdev/spotify-migration-tool/issues)
- 💬 [Discussioni](https://github.com/tomzdev/spotify-migration-tool/discussions)
- 📚 [Documentazione Completa](https://github.com/tomzdev/spotify-migration-tool/wiki)

**Prima di chiedere aiuto:**
1. Controlla questa guida
2. Verifica la sezione Troubleshooting
3. Cerca nelle Issues esistenti 