import * as t from 'io-ts';

const CallCodec = t.type({
  now: t.union([t.string, t.null]),
});

const ExtrinsicCodec = t.type({
  calls: t.array(CallCodec),
});

const BlockCodec = t.type({
  height: t.number,
  extrinsics: t.array(ExtrinsicCodec),
});

export type Block = t.TypeOf<typeof BlockCodec>;

const EventCodec = t.type({
  args: t.type({
    owner: t.string,
    assetId: t.number,
    balance: t.string,
  }),
  block: BlockCodec,
});

const ArchiveCodec = t.type({
  event: t.array(EventCodec),
});

export const AssetBurned = t.type({
  archive: ArchiveCodec,
});

export type AssetBurned = t.TypeOf<typeof AssetBurned>;
