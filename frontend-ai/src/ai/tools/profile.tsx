import { z } from "zod";
import { createRunnableUI } from "@/utils/server";
import { DynamicStructuredTool } from "@langchain/core/tools";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const profileSchema = z.object({
  name: z.string().optional().describe("The name of the user"),
  age: z.number().optional().describe("The age of the user"),
  bio: z.string().optional().describe("The bio of the user"),
});

export const profileTool = new DynamicStructuredTool({
  name: "render_profile",
  description: "A tool to render user profiles, base on user data input",
  schema: profileSchema,
  func: async (input, config) => {
    const stream = await createRunnableUI(
      config,
      <div>Profile Loading ...</div>
    );
    stream.done(
      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-3">
          <CardTitle>{input.name}</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            {input.bio}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>{input.age} Years old</Button>
        </CardFooter>
      </Card>
    );

    return JSON.stringify(input, null);
  },
});
