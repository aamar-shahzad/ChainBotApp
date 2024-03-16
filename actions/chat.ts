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
export async function queryToCustom(data: { inputs: string }) {
  const session = await getUser();
  if (!session?.user) redirect("/login");
  let id: string | undefined;
  let error: undefined | { message: string };
  //add try catch
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    const newConversationId = generateRandomId(8);
    const newMessageJson = [
      {
        id: newConversationId,
        question: data.inputs,
        answer: result.generated_text,
      },
    ];
    const dataRef = await prisma.conversation.create({
      data: {
        messages: newMessageJson,
        name: data.inputs,
        userId: session.user.id,
      },
    });
    id = dataRef.id;
  } catch (err) {
    console.log(err);
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
  const payload = { inputs: message ,wait_for_model:true};
  const response = await fetch(
    "https://api-inference.huggingface.co/models/google/gemma-7b",
    {
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();
  return result[0].generated_text;
}
