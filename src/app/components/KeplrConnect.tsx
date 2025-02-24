'use client';

import { useState, useEffect } from 'react';
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { SigningStargateClient } from "@cosmjs/stargate";
import { chainConfig } from '../config/chainConfig';
import { Button } from "@/components/ui/button";

declare global {
  interface Window extends KeplrWindow {}
}

export default function KeplrConnect() {
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Auto-connect if wallet connection was previously persisted
  useEffect(() => {
    const storedConnection = localStorage.getItem("keplrConnected");
    if (storedConnection === "true") {
      connectKeplr();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectKeplr = async () => {
    try {
      // Check if Keplr is installed
      if (!window.keplr) {
        throw new Error("Please install Keplr extension");
      }

      // Suggest the chain info to Keplr (for custom chains)
      await window.keplr.experimentalSuggestChain({
        chainId: chainConfig.chainId,
        chainName: chainConfig.chainName,
        rpc: chainConfig.rpc,
        rest: chainConfig.rest,
        bip44: chainConfig.bip44,
        bech32Config: chainConfig.bech32Config,
        currencies: chainConfig.currencies,
        feeCurrencies: chainConfig.feeCurrencies,
        stakeCurrency: chainConfig.stakeCurrency,
        features: chainConfig.features,
      });

      // Enable the chain
      await window.keplr.enable(chainConfig.chainId);

      // Get the offline signer
      const offlineSigner = window.keplr.getOfflineSigner(chainConfig.chainId);

      // Get user address
      const accounts = await offlineSigner.getAccounts();
      const userAddress = accounts[0].address;
      setAddress(userAddress);

      // Create client and query balance
      const client = await SigningStargateClient.connectWithSigner(
        chainConfig.rpc,
        offlineSigner
      );

      const balanceResult = await client.getBalance(
        userAddress,
        chainConfig.stakeCurrency.coinMinimalDenom
      );

      // Convert balance from minimal denomination (uregen) to REGEN
      const regenBalance = (parseInt(balanceResult.amount) / 1_000_000).toFixed(6);
      setBalance(regenBalance);

      // Persist the connection state. This will let us auto-connect on refresh.
      localStorage.setItem("keplrConnected", "true");

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const disconnectKeplr = () => {
    // Clear the state and remove persisted connection state
    setAddress('');
    setBalance('');
    setError('');
    localStorage.removeItem("keplrConnected");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {!address && (
        <Button onClick={connectKeplr}>
          Connect Keplr
        </Button>
      )}

      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}

      {address && (
        <div className="text-center">
          <p className="text-sm text-gray-600">Connected Address:</p>
          <p className="font-mono text-sm mb-2">{address}</p>
          <p className="text-sm text-gray-600">Balance:</p>
          <p className="font-bold">{balance} REGEN</p>

          <Button onClick={disconnectKeplr} variant="destructive" className="mt-4">
            Disconnect Keplr
          </Button>
        </div>
      )}
    </div>
  );
}
