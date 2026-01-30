'use client'

import { useField } from 'formik'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormTextareaProps {
    name: string
    label: string
    placeholder?: string
    disabled?: boolean
    className?: string
    rows?: number
}

export function FormTextarea({ name, label, placeholder, disabled, className, rows = 3 }: FormTextareaProps) {
    const [field, meta] = useField(name)
    const hasError = meta.touched && meta.error

    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={name} className="text-sm font-medium text-foreground">
                {label}
            </Label>
            <Textarea
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                {...field}
                className={cn(hasError && 'border-destructive')}
            />
            {hasError && (
                <p className="text-xs text-destructive">{meta.error}</p>
            )}
        </div>
    )
}
