import Image from 'next/image';

export default function PoweredByKeplr() {
  return (
    <div className="flex flex-col items-center gap-1 text-sm text-gray-500">
      <div className="flex items-center justify-center gap-1">
        <span>Powered by</span>
        <Image
          src="/keplr-monochrome-dark.svg"
          alt="Keplr Logo"
          width={75}
          height={25}
        />
      </div>
      <span className="italic text-xs">Connected to Regen Redwood Testnet</span>
    </div>
  );
}