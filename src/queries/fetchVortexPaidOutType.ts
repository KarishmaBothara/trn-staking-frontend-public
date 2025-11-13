import * as t from 'io-ts';

const CallCodec = t.type({
  now: t.union([t.string, t.null]),
});

const ExtrinsicCodec = t.type({
  calls: t.array(CallCodec),
});

const BlockCodec = t.type({
  height: t.number,
  hash: t.string,
  extrinsics: t.array(ExtrinsicCodec),
});

const EventArgsCodec = t.type({
  id: t.number,
  who: t.string,
  amount: t.string,
});

const EventCodec = t.type({
  block: BlockCodec,
  args: EventArgsCodec,
});

const ArchiveCodec = t.type({
  event: t.array(EventCodec),
});

export const VortexPaidOut = t.type({
  archive: ArchiveCodec,
});

export type VortexPaidOut = t.TypeOf<typeof VortexPaidOut>;
