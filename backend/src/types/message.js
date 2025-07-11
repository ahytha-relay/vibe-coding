import {Type} from '@sinclair/typebox';

export const MessageType = Type.Object({
  id: Type.String(),
  channelId: Type.String(),
  content: Type.String(),
});
