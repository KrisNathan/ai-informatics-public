<script lang="ts">
  import type { EventHandler } from "svelte/elements";
  import ChatBubble from "../components/ChatBubble.svelte";

  interface Message {
    role: "model" | "user";
    parts: string;
  }

  let messages: Message[] = [
    {
      role: "model",
      parts: "Hello! Welcome to DigiBox Official Store, how may I help you? Please keep in mind that I am a chatbot and may provide incorrect information.",
    },
  ];
  let isDisabled: boolean = false;

  const pushPrompt = async () => {
    const result = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ messages: messages }),
    });
    const resBody = await result.json();
    messages = [...messages, { role: "model", parts: resBody }];
  };

  let chatboxValue: string = "";
  const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = (el) => {
    if (isDisabled) return;

    isDisabled = true;
    messages = [...messages, { role: "user", parts: chatboxValue }];
    chatboxValue = "";

    pushPrompt().then(() => {
      isDisabled = false;
    }).catch((e) => {
      console.error(e);      
    });
  };
</script>

<!-- Chat bubbles -->
<div
  class="chat w-full overflow-y-scroll flex flex-col py-72 max-h-screen top-0"
>
  {#each messages as message}
    <ChatBubble message={message.parts} />
  {/each}
</div>

<form
  class="absolute w-full p-3 bg-stone-800 outline outline-1 outline-stone-700 bottom-0"
  id="chat-box"
  on:submit|preventDefault={handleSubmit}
>
  <input
    type="text"
    class="w-full p-3 rounded-full bg-transparent outline outline-1 outline-stone-700 text-white"
    placeholder="Say something..."
    bind:value={chatboxValue}
  />
</form>

<style>
  .chat::-webkit-scrollbar-track {
    padding: 2px 0;
    background-color: #404040;
  }

  .chat::-webkit-scrollbar {
    width: 10px;
  }

  .chat::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #737272;
  }
</style>
