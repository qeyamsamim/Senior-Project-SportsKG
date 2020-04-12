import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiAiClient } from 'api-ai-javascript';
import { BehaviorSubject } from 'rxjs';

export class Message {
  constructor(public content: string, public sentBy: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly token = environment.dialogflow.chatbot;
  readonly client = new ApiAiClient({accessToken: this.token});

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  update(msg: Message) {
    this.conversation.next([msg]);
  }

  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg).then(res => {
      const speech = res.result.fulfillment.speech;
      const chatbot = new Message(speech, 'bot');
      this.update(chatbot);
    });
  }
}
