'use client'

import { useField } from 'formik'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
    name: string
    label: string
    type?: string
    placeholder?: string
    disabled?: boolean
    className?: string
}

export function FormField({ name, label, type = 'text', placeholder, disabled, className }: FormFieldProps) {
    const [field, meta] = useField(name)
    const hasError = meta.touched && meta.error

    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={name} className="text-sm font-medium text-foreground">
                {label}
            </Label>
            <Input
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                className={cn(hasError && 'border-destructive')}
            />
            {hasError && (
                <p className="text-xs text-destructive">{meta.error}</p>
            )}
        </div>
    )
}
