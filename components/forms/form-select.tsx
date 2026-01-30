'use client'

import { useField, useFormikContext } from 'formik'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FormSelectProps {
    name: string
    label: string
    options: { value: string; label: string }[]
    placeholder?: string
    disabled?: boolean
    className?: string
}

export function FormSelect({ name, label, options, placeholder, disabled, className }: FormSelectProps) {
    const [field, meta] = useField(name)
    const { setFieldValue } = useFormikContext()
    const hasError = meta.touched && meta.error

    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={name} className="text-sm font-medium text-foreground">
                {label}
            </Label>
            <Select
                value={field.value}
                onValueChange={(value) => setFieldValue(name, value)}
                disabled={disabled}
            >
                <SelectTrigger className={cn('w-full', hasError && 'border-destructive')}>
                    <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {hasError && (
                <p className="text-xs text-destructive">{meta.error}</p>
            )}
        </div>
    )
}
