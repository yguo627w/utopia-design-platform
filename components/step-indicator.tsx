"use client"

import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

interface StepIndicatorProps {
  currentStep: number
  totalSteps?: number
}

const steps = [
      { number: 1, name: "上传房间照片", path: "/upload" },
  { number: 2, name: "设计工作台", path: "/design" },
  { number: 3, name: "预览渲染", path: "/preview" },
  { number: 4, name: "商城购买", path: "/marketplace" },
]

export default function StepIndicator({ currentStep, totalSteps = 4 }: StepIndicatorProps) {
  const router = useRouter()

  const handleStepClick = (step: (typeof steps)[0]) => {
    // Allow navigation to completed steps or current step
    if (step.number <= currentStep) {
      router.push(step.path)
    }
  }

  return (
    <div className="bg-card/50 border-b border-border py-2">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center">
                <div
                  onClick={() => handleStepClick(step)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    step.number < currentStep
                      ? "bg-primary text-white cursor-pointer hover:bg-primary/90"
                      : step.number === currentStep
                        ? "bg-primary text-white cursor-pointer hover:bg-primary/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {step.number < currentStep ? <Check className="h-3 w-3" /> : step.number}
                </div>
                <div
                  onClick={() => handleStepClick(step)}
                  className={`ml-2 flex items-center space-x-2 ${step.number <= currentStep ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  <span
                    className={`text-xs font-medium ${
                      step.number === currentStep ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    步骤 {step.number}/{totalSteps}
                  </span>
                  <span
                    className={`text-xs ${step.number === currentStep ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.name}
                  </span>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-3 ${step.number < currentStep ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
