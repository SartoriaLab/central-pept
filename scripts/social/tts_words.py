"""Voz grátis (edge-tts) com o tempo de cada palavra, para a legenda do Reels.

Uso: python tts_words.py <voz> <velocidade> <saida.mp3>   (texto pela entrada padrão)
Imprime JSON: [{"text": "...", "start": s, "end": s}, ...] em segundos.
"""
import asyncio
import json
import sys

import edge_tts

# A Thalita é multilíngue e adivinha o idioma por frase: frase curta só com nomes e palavras
# que existem em espanhol ("Mounjaro dando enjoo?") sai com sotaque espanhol. O serviço do
# edge-tts recusa o <lang> do SSML, então a defesa é o texto (regra em write.ts).
TICKS = 10_000_000  # o edge-tts mede em unidades de 100 ns


async def main() -> None:
    voice, rate, out = sys.argv[1], sys.argv[2], sys.argv[3]
    text = sys.stdin.read()
    words = []
    com = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    with open(out, "wb") as f:
        async for chunk in com.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start = chunk["offset"] / TICKS
                words.append({"text": chunk["text"], "start": start, "end": start + chunk["duration"] / TICKS})
    json.dump(words, sys.stdout, ensure_ascii=False)


asyncio.run(main())
