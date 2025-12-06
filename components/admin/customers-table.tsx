"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Customer {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  created_at: string
}

interface CustomersTableProps {
  customers: Customer[]
}

function getFullName(customer: Customer): string {
  const firstName = customer.first_name || ""
  const lastName = customer.last_name || ""
  return `${firstName} ${lastName}`.trim() || "—"
}

function getInitials(customer: Customer): string {
  const firstName = customer.first_name || ""
  const lastName = customer.last_name || ""
  if (firstName || lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  return customer.email?.slice(0, 2).toUpperCase() || "??"
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const [search, setSearch] = useState("")

  const filteredCustomers = customers.filter((customer) => {
    const fullName = getFullName(customer).toLowerCase()
    return customer.email?.toLowerCase().includes(search.toLowerCase()) || fullName.includes(search.toLowerCase())
  })

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(customer)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{getFullName(customer)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                  <TableCell>
                    <Badge variant={customer.role === "admin" ? "default" : "secondary"}>{customer.role}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(customer.created_at), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
