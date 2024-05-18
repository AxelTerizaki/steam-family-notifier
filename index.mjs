import { Webhook, MessageBuilder } from 'discord-webhook-node';
import fs from 'fs';
import fetch from 'node-fetch';
import { resolve } from 'path';

const __dirname = import.meta.dirname;
const configRaw = fs.readFileSync(resolve(__dirname, 'config.json'), 'utf-8');
const config = JSON.parse(configRaw);

const newGames = new Set();
const currentGames = new Set();

for (const gamer of config.family) {
	try {
		const gameList = fs.readFileSync(resolve(__dirname, `games.${gamer.name}.txt`), 'utf-8');
		for (const game of gameList.split('\n')) {
			currentGames.add(game);
		}
	} catch(err) {
		console.log(err);
		// Do nothing
	}
	
	const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${config.steamAPIKey}&format=json&steamid=${gamer.steamID}&include_appinfo=true`; 

	const res = await fetch(url);
	const json = await res.json();
	const games = [];

	for (const game of json.response.games) {
		games.push(game.name);	
		if (!currentGames.has(game.name)) newGames.add(game.name);
	}

	fs.writeFileSync(resolve(__dirname, `games.${gamer.name}.txt`), games.join('\n'), 'utf-8');
}

if (newGames.size > 0 && process.argv[2] !== '--init') {
	const games = Array.from(newGames).map(g => `* ${g}\n`);
	const hook = new Webhook(config.webhook.url);
	hook.setUsername(config.webhook.username);

	const embed = new MessageBuilder()
		.setTitle(config.webhook.message)
		.setDescription(games.join(''));

	hook.send(embed);
}
