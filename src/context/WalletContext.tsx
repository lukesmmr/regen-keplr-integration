'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SigningStargateClient } from '@cosmjs/stargate';
import { chainConfig } from '@/app/config/chainConfig';

interface WalletContextType {
  address: string;
  balance: string;
  error: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  const connectWallet = async () => {
    try {
      if (!window.keplr) {
        throw new Error('Please install Keplr extension');
      }

      // Suggest the chain information for custom chains
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

      // Enable the chain and get the offline signer
      await window.keplr.enable(chainConfig.chainId);
      const offlineSigner = window.keplr.getOfflineSigner(chainConfig.chainId);
      const accounts = await offlineSigner.getAccounts();
      const userAddress = accounts[0].address;
      setAddress(userAddress);

      // Create Stargate client and query balance
      const client = await SigningStargateClient.connectWithSigner(
        chainConfig.rpc,
        offlineSigner
      );
      const balanceResult = await client.getBalance(
        userAddress,
        chainConfig.stakeCurrency.coinMinimalDenom
      );
      const regenBalance = (parseInt(balanceResult.amount) / 1_000_000).toFixed(6);
      setBalance(regenBalance);

      localStorage.setItem('keplrConnected', 'true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const disconnectWallet = () => {
    setAddress('');
    setBalance('');
    setError('');
    localStorage.removeItem('keplrConnected');
  };

  // Auto-connect if previously connected
  useEffect(() => {
    const storedConnection = localStorage.getItem('keplrConnected');
    if (storedConnection === 'true') {
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WalletContext.Provider
      value={{ address, balance, error, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 