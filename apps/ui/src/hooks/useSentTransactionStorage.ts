import { RequiredAsset } from '@force-bridge/commons';
import { BridgeTransactionStatus, UnFailedTransactionSummary } from '@force-bridge/commons/lib/types/apiv1';
import { useLocalStorage } from '@rehooks/local-storage';

export interface SentTransactionStorage {
  transactions: TransactionSummaryWithSender[] | null;
  addTransaction: (tx: TransactionWithSender) => void;
}

export type TransactionSummaryWithSender = UnFailedTransactionSummary & { sender: string };

export interface TransactionWithSender {
  txId: string;
  timestamp: number;
  sender: string;
  fromAsset: RequiredAsset<'amount'>;
  toAsset: RequiredAsset<'amount'>;
}

export function useSentTransactionStorage(): SentTransactionStorage {
  const [transactions, setTransactions] = useLocalStorage<TransactionSummaryWithSender[]>('SentTransactionStorage');
  const addTransaction = (tx: TransactionWithSender) => {
    const txSummary: TransactionSummaryWithSender = {
      status: BridgeTransactionStatus.Pending,
      sender: tx.sender,
      txSummary: {
        fromAsset: tx.fromAsset,
        toAsset: tx.toAsset,
        fromTransaction: { txId: tx.txId, timestamp: tx.timestamp },
      },
    };
    if (!transactions) {
      return setTransactions([txSummary]);
    }
    setTransactions(transactions.concat(txSummary));
  };
  return { transactions: transactions, addTransaction: addTransaction };
}
