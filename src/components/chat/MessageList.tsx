import { FC } from 'react';
import { Message } from '../../types';
import { MessageBubble } from './MessageBubble';
import { LoadingMessage } from './LoadingMessage';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList: FC<MessageListProps> = ({ messages, isLoading }) => {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && <LoadingMessage />}
    </div>
  );
};