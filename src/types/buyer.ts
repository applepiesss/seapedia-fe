export interface WalletTransaction {
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}

export interface Address {
  id?: number;
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
}
