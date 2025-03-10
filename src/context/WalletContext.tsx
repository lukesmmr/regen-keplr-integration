'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getSigningRegenClient } from '@regen-network/api';
import { chainConfig } from '@/app/config/chainConfig';
import { Window as KeplrWindow } from '@keplr-wallet/types';

declare global {
  interface Window extends KeplrWindow {}
}

interface WalletContextType {
  address: string;
  balance: string;
  error: string;
  regenPrice: number;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendTransaction: (recipient: string, amount: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [regenPrice, setRegenPrice] = useState(0);
  const keplrWallet = typeof window !== 'undefined' ? window.keplr : null;

  const connectWallet = async () => {
    try {
      if (!keplrWallet) {
        throw new Error('Please install Keplr extension');
      }
      // Suggest the chain information for custom chains
      await keplrWallet?.experimentalSuggestChain({
        chainId: chainConfig.chainId,
        chainName: chainConfig.chainName,
        rpc: chainConfig.rpc,
        rest: chainConfig.rest,
        bip44: chainConfig.bip44,
        bech32Config: chainConfig.bech32Config,
        currencies: chainConfig.currencies,
        feeCurrencies: chainConfig.feeCurrencies,
        stakeCurrency: chainConfig.stakeCurrency,
      });

      // Enable the chain and get the offline signer
      await keplrWallet?.enable(chainConfig.chainId);
      const offlineSigner = keplrWallet?.getOfflineSigner(
        chainConfig.chainId
      );
      const accounts = await offlineSigner.getAccounts();
      const userAddress = accounts[0].address;
      setAddress(userAddress);

      // Create a client using the Regen Network API and query balance
      const client = await getSigningRegenClient({
        rpcEndpoint: chainConfig.rpc,
        signer: offlineSigner,
      });
      const balanceResult = await client.getBalance(
        userAddress,
        chainConfig.stakeCurrency.coinMinimalDenom
      );
      // Convert the amount (assumed in uREGEN) to REGEN with 6 decimals
      const regenBalance = (parseInt(balanceResult.amount) / 1_000_000).toFixed(
        6
      );
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

  // Function to fetch the current REGEN price from our API endpoint
  const fetchRegenPrice = async () => {
    try {
      const response = await fetch('/api/regenPrice');
      if (!response.ok) {
        throw new Error('Failed to fetch REGEN price');
      }
      const data = await response.json();
      if (data.regenPrice) {
        setRegenPrice(data.regenPrice);
      }
    } catch (error) {
      console.error('Error fetching REGEN price:', error);
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    const storedConnection = localStorage.getItem('keplrConnected');
    if (storedConnection === 'true') {
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch the REGEN price on mount and then refetch every 5 minutes
  useEffect(() => {
    fetchRegenPrice();
    const interval = setInterval(fetchRegenPrice, 300000); // 300,000ms = 5 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Add event listener for Keplr wallet changes
    const handleKeplrAccountChange = () => {
      // Reconnect wallet to get updated account information
      connectWallet();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keplr_keystorechange', handleKeplrAccountChange);
      
      // Clean up event listener on component unmount
      return () => {
        window.removeEventListener('keplr_keystorechange', handleKeplrAccountChange);
      };
    }
  }, [address]);

  // Send tokens to a recipient using the Regen Network API
  const sendTransaction = async (
    recipient: string,
    amount: string
  ): Promise<string> => {
    try {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      const offlineSigner = (window as any).keplr.getOfflineSigner(
        chainConfig.chainId
      );
      const client = await getSigningRegenClient({
        rpcEndpoint: chainConfig.rpc,
        signer: offlineSigner,
      });

      // Convert REGEN to uREGEN (multiply by 10^6)
      const amountInUREGEN = Math.floor(
        parseFloat(amount) * 1_000_000
      ).toString();

      const result = await client.sendTokens(
        address,
        recipient,
        [
          {
            denom: chainConfig.stakeCurrency.coinMinimalDenom,
            amount: amountInUREGEN,
          },
        ],
        {
          amount: [
            {
              denom: chainConfig.stakeCurrency.coinMinimalDenom,
              amount: '5000',
            },
          ],
          gas: '200000',
        }
      );

      // Update balance after successful transaction
      const balanceResult = await client.getBalance(
        address,
        chainConfig.stakeCurrency.coinMinimalDenom
      );
      const regenBalance = (parseInt(balanceResult.amount) / 1_000_000).toFixed(
        6
      );
      setBalance(regenBalance);

      return result.transactionHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      throw err;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        error,
        regenPrice,
        connectWallet,
        disconnectWallet,
        sendTransaction,
      }}
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
