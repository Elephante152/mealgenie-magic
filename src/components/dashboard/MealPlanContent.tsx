import { ScrollArea } from "@/components/ui/scroll-area"

interface MealPlanContentProps {
  content: string;
}

export const MealPlanContent = ({ content }: MealPlanContentProps) => {
  const formatPlanContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('Day')) {
        return (
          <div key={index} className="mt-6 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{line}</h3>
          </div>
        )
      } else if (line.includes('Breakfast:') || line.includes('Lunch:') || line.includes('Dinner:')) {
        return (
          <div key={index} className="mt-4 mb-2">
            <h4 className="text-md font-medium text-gray-700">{line}</h4>
          </div>
        )
      } else if (line.trim().startsWith('-')) {
        return (
          <div key={index} className="ml-4 text-gray-600">
            {line}
          </div>
        )
      }
      return <div key={index}>{line}</div>
    })
  }

  return (
    <ScrollArea className="p-6 pt-2 max-h-[80vh]">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 p-6">
        <div className="space-y-1 text-sm text-gray-700 leading-relaxed">
          {formatPlanContent(content)}
        </div>
      </div>
    </ScrollArea>
  )
}