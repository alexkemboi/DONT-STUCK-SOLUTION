'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step {
    label: string
    description: string
}

interface StepIndicatorProps {
    currentStep: number
    steps: Step[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
    return (
        <div className="flex items-center w-full">
            {steps.map((step, index) => (
                <div key={step.label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                'flex items-center justify-center w-9 h-9 rounded-full border-2 text-sm font-medium transition-all duration-300',
                                index < currentStep &&
                                    'bg-foreground border-foreground text-background',
                                index === currentStep &&
                                    'border-foreground text-foreground',
                                index > currentStep &&
                                    'border-muted-foreground/30 text-muted-foreground/50'
                            )}
                        >
                            {index < currentStep ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                index + 1
                            )}
                        </div>
                        <div className="hidden sm:block">
                            <p
                                className={cn(
                                    'text-sm font-medium leading-none',
                                    index === currentStep
                                        ? 'text-foreground'
                                        : 'text-muted-foreground'
                                )}
                            >
                                {step.label}
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-0.5">
                                {step.description}
                            </p>
                        </div>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={cn(
                                'flex-1 h-px mx-4 transition-colors duration-300',
                                index < currentStep
                                    ? 'bg-foreground'
                                    : 'bg-muted-foreground/20'
                            )}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}
