import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummarySection {
  id: string;
  title: string;
  content: string[];
}

export function Summary({ level, data }: { level: string; data?: SummarySection[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-muted-foreground">No summary available for this lesson.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {data.map((section) => (
            <Card key={section.id}>
              <CardHeader className="py-3">
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <ul className="list-inside list-disc space-y-1">
                  {section.content.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
