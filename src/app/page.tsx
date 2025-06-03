'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import Papa from 'papaparse'
import { useState } from 'react'

const COLUMNS = [
  {
    label: 'First Name',
    key: 'firstName',
  },
  {
    label: 'Last Name',
    key: 'lastName',
  },
  {
    label: 'Email',
    key: 'email',
  },
] as const

type Row = {
  id: number
  firstName: string
  lastName: string
  email: string
}

const ROWS: Row[] = [
  {
    id: 1,
    firstName: 'Luiz',
    lastName: 'Henrique',
    email: '7henrique18@gmail.com',
  },
]

const MAX_ROWS = 10

function mapCsvRowsToRows(
  csvRows: Record<string, string>[],
  mapping: Record<string, string>
): Row[] {
  return csvRows.slice(0, MAX_ROWS).map((row, index) => {
    const mappedRow: Row = {
      id: index + 1,
      firstName: '',
      lastName: '',
      email: '',
    }

    for (const column of COLUMNS) {
      const csvColumn = Object.keys(mapping).find(
        csvCol => mapping[csvCol] === column.key
      )

      if (csvColumn && csvColumn in row) {
        mappedRow[column.key] = row[csvColumn] || ''
      }
    }

    return mappedRow
  })
}

export default function Home() {
  const [rows, setRows] = useState<Row[]>(ROWS)
  const [isLoading, setIsLoading] = useState(false)

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    setIsLoading(true)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: async res => {
        try {
          const csvRows = res.data as Record<string, string>[]
          const firstRows = csvRows.slice(0, MAX_ROWS)
          const fileCols = Object.keys(csvRows[0] || {})

          // Chama a API para fazer o mapping das colunas
          const response = await fetch('/api/match-columns', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileCols,
              firstRows,
              columns: COLUMNS.map(col => ({ label: col.label, key: col.key })),
            }),
          })

          const { mapping } = await response.json()

          const mappedRows = mapCsvRowsToRows(csvRows, mapping)

          setRows(mappedRows)
        } catch (error) {
        } finally {
          setIsLoading(false)
        }
      },
    })
  }

  return (
    <div
      className={cn(
        'mx-auto flex h-screen max-w-md flex-col items-center justify-center gap-4'
      )}
    >
      <div className="flex gap-2">
        <Input
          type="file"
          accept=".csv"
          className="rounded-md border"
          placeholder="Select a CSV file"
          onChange={onFile}
          disabled={isLoading}
        />
        <Button disabled={isLoading}>
          {isLoading ? 'Processando...' : 'Parse and Preview'}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map(column => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              {COLUMNS.map(column => (
                <TableCell key={column.key}>
                  {row[column.key as keyof typeof row]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
