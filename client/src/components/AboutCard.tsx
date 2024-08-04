import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AboutCard() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>hello</CardTitle>
        <CardDescription>Deploy your new project indfakdjkdfnbgkajdfngkajdfgnasdasdasdasdasdasdick.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>hello</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
}
