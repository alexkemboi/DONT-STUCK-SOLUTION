'use client'

import { useField, useFormikContext } from 'formik'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormCheckboxProps {
    name: string
    label: string
    disabled?: boolean
    className?: string
}

export function FormCheckbox({ name, label, disabled, className }: FormCheckboxProps) {
    const [field] = useField(name)
    const { setFieldValue } = useFormikContext()

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Checkbox
                id={name}
                checked={field.value}
                onCheckedChange={(checked) => setFieldValue(name, checked)}
                disabled={disabled}
            />
            <Label htmlFor={name} className="text-sm font-medium text-foreground cursor-pointer">
                {label}
            </Label>
        </div>
    )
}
