"use server";

import { getUser } from "@/lib/auth";
import { generateRandomId } from "@/lib/utils";
import prisma from "@/prisma/client";
import { JsonMessagesArraySchema } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import OpenAI from "openai";

export type Message = {
  message: string;
  conversationId: string;
};

export type NewMessage = Omit<Message, "conversationId">;
// const BASE_URL="https://aamar1-changedetecor.hf.space"
const BASE_URL="http://127.0.0.1:8000"
export async function newChat(params: NewMessage) {
  const session = await getUser();
  if (!session?.user) redirect("/login");
  let id: string | undefined;
  let error: undefined | { message: string };
  try {
    const responseMessage = await createCompletion(params.message);
    console.log("ne chat")
    const newConversationId = generateRandomId(8);
    const newMessageJson = [
      {
        id: newConversationId,
        question: params.message,
        answer: responseMessage,
      },
    ];
    const dataRef = await prisma.conversation.create({
      data: {
        messages: newMessageJson,
        name: params.message,
        userId: session.user.id,
      },
    });
    id = dataRef.id;
  } catch (err) {
    if (err instanceof Error) error = { message: err.message };
  }
  console.log(error);

  if (error) return error;
  redirect(`/chat/${id}`);
}

export async function chat(params: Message) {
  let error: undefined | { message: string };
  try {
    const responseMessage = await createCompletion(params.message);
    const newConversationId = generateRandomId(8);
    const dataRef = await prisma.conversation.findUnique({
      where: {
        id: params.conversationId,
      },
    });
    const updatedMessageJson = [
      ...JsonMessagesArraySchema.parse(dataRef?.messages),
      {
        id: newConversationId,
        question: params.message,
        answer: responseMessage,
      },
    ];
    await prisma.conversation.update({
      where: {
        id: params.conversationId,
      },
      data: {
        messages: updatedMessageJson,
      },
    });
  } catch (err) {
    if (err instanceof Error) error = { message: err.message };
  }
  console.log(error);

  if (error) return error;
  revalidatePath(`/chat/${params.conversationId}`);
}

declare global {
  var ai_map: undefined | Map<string, OpenAI>;
}

const map = globalThis.ai_map ?? new Map<string, OpenAI>();

async function createCompletion(message: string) {
  const payload = { message: message };
  console.log("payload", payload);

  try {
    const response = await fetch(`${BASE_URL}/prediction`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    const {summary}=data
    return summary; // or do something with data
  } catch (error) {
    console.log("error", error);
    return "Something went wrong try again";
  }
}

