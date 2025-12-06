// Paystack integration for payment processing
export interface PaystackConfig {
  publicKey: string
  email: string
  amount: number // Amount in kobo (smallest currency unit)
  currency?: string
  reference?: string
  metadata?: Record<string, any>
  channels?: string[]
  callback?: (response: PaystackResponse) => void
  onClose?: () => void
}

export interface PaystackResponse {
  reference: string
  status: string
  trans: string
  transaction: string
  message: string
  trxref: string
}

export function generateReference(): string {
  return `CAP_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function initializePaystack(config: PaystackConfig): void {
  const handler = (window as any).PaystackPop?.setup({
    key: config.publicKey,
    email: config.email,
    amount: config.amount,
    currency: config.currency || "NGN",
    ref: config.reference || generateReference(),
    metadata: config.metadata,
    channels: config.channels || ["card", "bank", "ussd", "bank_transfer"],
    callback: config.callback,
    onClose: config.onClose,
  })

  handler?.openIframe()
}

// Verify transaction on server side
export async function verifyTransaction(reference: string): Promise<{
  status: boolean
  message: string
  data?: {
    amount: number
    currency: string
    status: string
    reference: string
    metadata?: Record<string, any>
  }
}> {
  const response = await fetch(`/api/paystack/verify?reference=${reference}`)
  return response.json()
}
