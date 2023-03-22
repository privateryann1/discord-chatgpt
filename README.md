
# Discord ChatGPT Bot

A discord bot that uses the OpenAI ChatGPT API.

https://openai.com/blog/chatgpt




## Features

- The bot functions through threads allowing multiple interactions to occur at the same time
- Chat auto-timeout to save resources
- Lightweight


## Installation

How to build the project with npm

```bash
  # navigate to project directory
  npm install
  npm run
```

If using pterodactyl NodeJS egg, you can modify the "done" message found in `src/events/client/ready.js`. This should be set to the same thing found in your egg start configuration.

Navigate to `.env` in the project root directory and insert your API keys.

[OpenAI Account Page](https://platform.openai.com/account/api-keys)

[Discord Developer Portal](https://discord.com/developers/applications)
## Usage/Examples

```
# Starts a thread with ChatGPT
/chat-gpt <prompt>
```
## Demo

https://discord.gg/djKdpbnyWc

