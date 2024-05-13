# Steam Family New Games Notifier

## Install

* NodeJS 20.11+ required
* `npm install`
* Copy `config.sample.json` to `config.json` and edit it. Should be self-explanatory.
  * You'll need a webhook URL from your discord server settings
  * You'll need a Steam API key. You can request one for free from Steam.
  * You'll need your family's SteamID64s. You can get those from the Account Details page (click on your avatar on the upper right corner of the steam window/site)

* Run with `node index.mjs --init` first. This will establish a list of games for everyone and won't send the webhook.
* Periodically run `node index.mjs` to get notified of new games (for example via a crontab)

* Enjoy!


