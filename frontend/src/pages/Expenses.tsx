'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Plus, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-toastify'; // FIX: Changed from custom useToast hook to direct react-toastify import

import {
  getBranches,
  getMembers,
  getExpenditureHeads,
  getCurrencies,
  getPaymentMethods,
  createExpenditure,
} from '@/services/api'

interface Expenditure {
  id: number
  description: string
  expenditureHeadCode: string
  amount: number
  taxAmount?: number
  totalAmount?: number
  paymentMethodId?: number
  currencyCode?: string
  voucherNumber?: string
  branchCode?: string
  expenseDate?: string
  approvalStatus?: string
  isReimbursement?: boolean
  reimbursedTo?: number
}

// Data structures for lookups
interface LookupItem {
  code: string;
  name: string;
}
interface PaymentMethodItem {
  id: number;
  name: string;
}

export default function ExpensesPage() {
  const [categories, setCategories] = useState<LookupItem[]>([])
  const [branches, setBranches] = useState<LookupItem[]>([])
  const [currencies, setCurrencies] = useState<LookupItem[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([])

  // Form State
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState<string>('')
  const [taxAmount, setTaxAmount] = useState<string>('')
  const [categoryCode, setCategoryCode] = useState('')
  const [currencyCode, setCurrencyCode] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [branchCode, setBranchCode] = useState('')
  const [expenseDate, setExpenseDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Only fetching required lookup data
    const fetchData = async () => {
      try {
        const [cats, brs, curs, pay] = await Promise.all([
          getExpenditureHeads(),
          getBranches(),
          getCurrencies(),
          getPaymentMethods()
        ])

        setCategories(Array.isArray(cats) ? cats : cats?.data || [])
        setBranches(Array.isArray(brs) ? brs : brs?.data || [])
        setCurrencies(Array.isArray(curs) ? curs : curs?.data || [])
        setPaymentMethods(Array.isArray(pay) ? pay : pay?.data || [])

      } catch (error) {
        console.error("Failed to fetch initial data:", error)
        // FIX: Using react-toastify error method
        toast.error("Could not load necessary form data. Please try again.")
      }
    }

    fetchData()
  }, [])

  // Helper to calculate total amount (used only for display)
  const totalAmount = (Number(amount) || 0) + (Number(taxAmount) || 0)

  const resetForm = () => {
    setDescription('')
    setAmount('')
    setTaxAmount('')
    setCategoryCode('')
    setCurrencyCode('')
    setPaymentMethodId('')
    setBranchCode('')
    setExpenseDate(format(new Date(), 'yyyy-MM-dd'))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const data = {
      description,
      amount: parseFloat(amount),
      taxAmount: parseFloat(taxAmount) || 0,
      expenditureHeadCode: categoryCode,
      currencyCode,
      paymentMethodId: parseInt(paymentMethodId),
      branchCode,
      expenseDate,
      
    }

    try {
      const res = await createExpenditure(data)
      
      // FIX: Using react-toastify success method
      toast.success(`Expense successfully saved`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      resetForm()

    } catch (error) {
      console.error("Expense creation failed:", error)
      // FIX: Using react-toastify error method
      toast.error("There was an error saving the expense. Please check your inputs and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Card className="max-w-full mx-auto shadow-lg border-t-4 border-blue-600">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800 flex items-center">
            <Plus className="w-6 h-6 mr-2 text-blue-600" />
            Record New Expense
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          <p className="text-gray-600 mb-6">Fill in the details below to record a new expenditure.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* General Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="expenseDate">Expense Date *</Label>
                <Input
                  id="expenseDate"
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={categoryCode}
                  onValueChange={setCategoryCode}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select an expenditure head" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.code} value={cat.code}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the purpose of the expense..."
                required
                rows={3}
              />
            </div>

            {/* Financial Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Base Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxAmount">Tax/VAT Amount</Label>
                <Input
                  id="taxAmount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Select
                  value={currencyCode}
                  onValueChange={setCurrencyCode}
                  required
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((cur) => (
                      <SelectItem key={cur.code} value={cur.code}>
                        {cur.code} - {cur.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Total Amount</Label>
                <div className="p-2 border rounded-md h-10 flex items-center bg-blue-50/50 font-semibold text-blue-700">
                  {currencyCode} {totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Payment and Branch Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select
                  value={paymentMethodId}
                  onValueChange={setPaymentMethodId}
                  required
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((pm) => (
                      <SelectItem key={pm.id} value={String(pm.id)}>
                        {pm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch/Location *</Label>
                <Select
                  value={branchCode}
                  onValueChange={setBranchCode}
                  required
                >
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.code} value={b.code}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                disabled={isSubmitting}
                className="text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Form
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Save Expense
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
