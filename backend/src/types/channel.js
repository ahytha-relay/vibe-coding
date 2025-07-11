import { Type } from '@sinclair/typebox';

export const ChannelType = Type.Object({
  id: Type.String(),
  channelTemplateId: Type.String(),
});
